/**
 * Placeholder images for different listing types
 * Used when no image is available in the database
 */

import { images } from '@/assets/images/images';

export type ListingType = 'product' | 'business' | 'service' | 'room' | 'professional';

const PLACEHOLDERS: Record<ListingType, any> = {
    product: images.placeholderImage,
    business: images.placeholderImage,
    service: images.placeholderImage,
    room: images.placeholderImage,
    professional: images.placeholderImage, // Use logo for now as user requested/implied
};

/**
 * Get placeholder image source for a specific listing type
 * @param type - The type of listing
 * @returns Placeholder image source
 */
export const getPlaceholderImage = (type: ListingType): any => {
    return PLACEHOLDERS[type];
};

/**
 * Get image source with fallback to placeholder
 * @param images - Array of image URLs from the listing
 * @param type - The type of listing
 * @returns First image URL (string) or placeholder source (any)
 */
export const getListingImage = (images: string[] | undefined, type: ListingType): any => {
    if (images && images.length > 0) {
        return images[0];
    }
    return getPlaceholderImage(type);
};

/**
 * Get all images with placeholder fallback
 * @param images - Array of image URLs from the listing
 * @param type - The type of listing
 * @returns Array of images or array containing single placeholder
 */
export const getListingImages = (images: string[] | undefined, type: ListingType): any[] => {
    if (images && images.length > 0) {
        return images;
    }
    return [getPlaceholderImage(type)];
};
