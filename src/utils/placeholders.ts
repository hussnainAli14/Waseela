/**
 * Placeholder images for different listing types
 * Used when no image is available in the database
 */

export type ListingType = 'product' | 'business' | 'service' | 'room' | 'professional';

const PLACEHOLDERS: Record<ListingType, string> = {
    product: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=600&q=80',
    business: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    service: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80',
    room: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    professional: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
};

/**
 * Get placeholder image URL for a specific listing type
 * @param type - The type of listing
 * @returns Placeholder image URL
 */
export const getPlaceholderImage = (type: ListingType): string => {
    return PLACEHOLDERS[type];
};

/**
 * Get image URL with fallback to placeholder
 * @param images - Array of image URLs from the listing
 * @param type - The type of listing
 * @returns First image URL or placeholder if no images exist
 */
export const getListingImage = (images: string[] | undefined, type: ListingType): string => {
    if (images && images.length > 0) {
        return images[0];
    }
    return getPlaceholderImage(type);
};

/**
 * Get all images with placeholder fallback
 * @param images - Array of image URLs from the listing
 * @param type - The type of listing
 * @returns Array of images or single placeholder
 */
export const getListingImages = (images: string[] | undefined, type: ListingType): string[] => {
    if (images && images.length > 0) {
        return images;
    }
    return [getPlaceholderImage(type)];
};
