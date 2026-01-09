import storage from '@react-native-firebase/storage';
import ImageResizer from 'react-native-image-resizer';
import { Platform } from 'react-native';

export interface UploadProgress {
    bytesTransferred: number;
    totalBytes: number;
    percentage: number;
}

export interface UploadResult {
    url: string;
    path: string;
}

/**
 * Compress and resize image before upload
 */
const compressImage = async (
    uri: string,
    maxWidth: number = 1200,
    maxHeight: number = 1200,
    quality: number = 80
): Promise<string> => {
    try {
        const resizedImage = await ImageResizer.createResizedImage(
            uri,
            maxWidth,
            maxHeight,
            'JPEG',
            quality,
            0,
            undefined,
            false,
            { mode: 'contain', onlyScaleDown: true }
        );
        return resizedImage.uri;
    } catch (error) {
        console.error('Error compressing image:', error);
        return uri; // Return original if compression fails
    }
};

/**
 * Upload a single image to Firebase Storage
 * @param uri - Local file URI
 * @param path - Storage path (e.g., 'listings/userId/imageName.jpg')
 * @param onProgress - Optional progress callback
 */
export const uploadImage = async (
    uri: string,
    path: string,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    try {
        // Compress image before upload
        const compressedUri = await compressImage(uri);

        // Create reference
        const reference = storage().ref(path);

        // Handle file URI for different platforms
        const fileUri = Platform.OS === 'ios' ? compressedUri.replace('file://', '') : compressedUri;

        // Upload file
        const task = reference.putFile(fileUri);

        // Track progress
        if (onProgress) {
            task.on('state_changed', snapshot => {
                const progress: UploadProgress = {
                    bytesTransferred: snapshot.bytesTransferred,
                    totalBytes: snapshot.totalBytes,
                    percentage: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                };
                onProgress(progress);
            });
        }

        // Wait for upload to complete
        await task;

        // Get download URL
        const url = await reference.getDownloadURL();

        return {
            url,
            path,
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
};

/**
 * Upload multiple images
 * @param uris - Array of local file URIs
 * @param basePath - Base storage path (e.g., 'listings/userId/')
 * @param onProgress - Optional progress callback for each image
 */
export const uploadMultipleImages = async (
    uris: string[],
    basePath: string,
    onProgress?: (index: number, progress: UploadProgress) => void
): Promise<UploadResult[]> => {
    const uploadPromises = uris.map((uri, index) => {
        const fileName = `image_${Date.now()}_${index}.jpg`;
        const path = `${basePath}${fileName}`;

        return uploadImage(uri, path, progress => {
            if (onProgress) {
                onProgress(index, progress);
            }
        });
    });

    return Promise.all(uploadPromises);
};

/**
 * Upload images for a listing
 * @param uris - Array of local file URIs
 * @param userId - User ID
 * @param listingType - Type of listing (business, service, marketplace, room)
 */
export const uploadListingImages = async (
    uris: string[],
    userId: string,
    listingType: 'business' | 'service' | 'marketplace' | 'room',
    onProgress?: (index: number, progress: UploadProgress) => void
): Promise<string[]> => {
    const basePath = `listings/${listingType}/${userId}/`;
    const results = await uploadMultipleImages(uris, basePath, onProgress);
    return results.map(result => result.url);
};

/**
 * Upload profile photo
 * @param uri - Local file URI
 * @param userId - User ID
 */
export const uploadProfilePhoto = async (
    uri: string,
    userId: string,
    onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
    const path = `profiles/${userId}/photo_${Date.now()}.jpg`;
    const result = await uploadImage(uri, path, onProgress);
    return result.url;
};

/**
 * Delete an image from Firebase Storage
 * @param url - Download URL or storage path
 */
export const deleteImage = async (url: string): Promise<void> => {
    try {
        // Extract path from URL if it's a download URL
        let path = url;
        if (url.includes('firebasestorage.googleapis.com')) {
            const urlObj = new URL(url);
            const pathMatch = urlObj.pathname.match(/\/o\/(.+?)\?/);
            if (pathMatch) {
                path = decodeURIComponent(pathMatch[1]);
            }
        }

        const reference = storage().ref(path);
        await reference.delete();
    } catch (error) {
        console.error('Error deleting image:', error);
        // Don't throw error if image doesn't exist
        if ((error as any).code !== 'storage/object-not-found') {
            throw error;
        }
    }
};

/**
 * Delete multiple images
 * @param urls - Array of download URLs or storage paths
 */
export const deleteMultipleImages = async (urls: string[]): Promise<void> => {
    const deletePromises = urls.map(url => deleteImage(url));
    await Promise.allSettled(deletePromises);
};

/**
 * Get image metadata
 * @param path - Storage path
 */
export const getImageMetadata = async (path: string) => {
    const reference = storage().ref(path);
    return reference.getMetadata();
};

/**
 * Generate thumbnail (smaller version of image)
 * @param uri - Local file URI
 * @param path - Storage path for thumbnail
 */
export const uploadThumbnail = async (
    uri: string,
    path: string
): Promise<string> => {
    const thumbnailUri = await compressImage(uri, 300, 300, 70);
    const result = await uploadImage(thumbnailUri, path);
    return result.url;
};
