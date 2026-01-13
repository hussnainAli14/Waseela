import type { SavedListing } from '@/types/firestore';
import { getBusiness } from '@/services/firestore/businesses';
import { getService } from '@/services/firestore/services';
import { getProduct } from '@/services/firestore/products';
import { getRoom } from '@/services/firestore/rooms';

export interface FullSavedListing {
    id: string;
    name?: string;
    title?: string;
    category: string;
    image: string;
    location?: string;
    city?: string;
    savedType: 'business' | 'service' | 'marketplace' | 'room';
    savedAt: string;
    rating?: number;
    reviews?: number;
    verified?: boolean;
    price?: number;
    priceLabel?: string;
}

/**
 * Fetch full listing data for saved items
 * Takes saved item IDs and fetches complete listing information from respective collections
 */
export const fetchFullSavedListings = async (
    savedItems: SavedListing[]
): Promise<FullSavedListing[]> => {
    const promises = savedItems.map(async (item) => {
        try {
            let listingData: any;

            switch (item.itemType) {
                case 'business':
                    listingData = await getBusiness(item.itemId);
                    if (!listingData) return null;
                    return {
                        id: listingData.id,
                        name: listingData.name,
                        category: listingData.category,
                        image: listingData.images?.[0] || listingData.logoUrl || 'https://via.placeholder.com/300',
                        location: listingData.city,
                        city: listingData.city,
                        savedType: 'business' as const,
                        savedAt: item.savedAt,
                        rating: listingData.rating,
                        reviews: listingData.reviewCount,
                        verified: listingData.verified,
                    };

                case 'service':
                    listingData = await getService(item.itemId);
                    if (!listingData) return null;
                    return {
                        id: listingData.id,
                        name: listingData.name,
                        category: listingData.serviceType,
                        image: listingData.images?.[0] || 'https://via.placeholder.com/300',
                        location: listingData.city,
                        city: listingData.city,
                        savedType: 'service' as const,
                        savedAt: item.savedAt,
                        rating: listingData.rating,
                        reviews: listingData.reviewCount,
                        verified: listingData.verified,
                    };

                case 'marketplace':
                    listingData = await getProduct(item.itemId);
                    if (!listingData) return null;
                    return {
                        id: listingData.id,
                        title: listingData.title,
                        category: listingData.category,
                        image: listingData.images?.[0] || 'https://via.placeholder.com/300',
                        location: listingData.city,
                        city: listingData.city,
                        savedType: 'marketplace' as const,
                        savedAt: item.savedAt,
                        price: listingData.price,
                    };

                case 'room':
                    listingData = await getRoom(item.itemId);
                    if (!listingData) return null;
                    return {
                        id: listingData.id,
                        title: listingData.title,
                        category: listingData.type,
                        image: listingData.images?.[0] || 'https://via.placeholder.com/300',
                        location: listingData.city,
                        city: listingData.city,
                        savedType: 'room' as const,
                        savedAt: item.savedAt,
                        price: listingData.price,
                        priceLabel: listingData.priceLabel,
                    };

                default:
                    console.warn(`Unknown item type: ${item.itemType}`);
                    return null;
            }
        } catch (error) {
            console.error(`Error fetching ${item.itemType} ${item.itemId}:`, error);
            return null;
        }
    });

    const results = await Promise.all(promises);
    // Filter out null values (failed fetches or deleted listings)
    return results.filter((item) => item !== null) as FullSavedListing[];
};

/**
 * Format saved date for display
 */
export const formatSavedDate = (savedAt: string): string => {
    const date = new Date(savedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
