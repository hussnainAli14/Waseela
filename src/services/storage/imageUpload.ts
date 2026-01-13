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
 * Upload images for a listing with proper folder structure
 * @param uris - Array of local file URIs
 * @param userId - User ID
 * @param listingId - Listing ID (from Firestore document)
 * @param listingType - Type of listing (business, service, marketplace, room, professional)
 * @param onProgress - Optional progress callback
 */
export const uploadListingImages = async (
    uris: string[],
    userId: string,
    listingId: string,
    listingType: 'business' | 'service' | 'marketplace' | 'room' | 'professional' | 'product',
    onProgress?: (index: number, progress: UploadProgress) => void
): Promise<string[]> => {
    // Pluralize listing type for folder name
    const folderName = listingType === 'professional' ? 'professionals' : `${listingType}s`;
    const basePath = `listings/${folderName}/${userId}/${listingId}/`;

    const uploadPromises = uris.map(async (uri, index) => {
        const fileName = `image_${index}_${Date.now()}.jpg`;
        const path = `${basePath}${fileName}`;

        // Compress image before upload
        const compressedUri = await compressImage(uri);

        // Create reference
        const reference = storage().ref(path);

        // Handle file URI for different platforms
        const fileUri = Platform.OS === 'ios' ? compressedUri.replace('file://', '') : compressedUri;

        // Upload file with metadata
        const task = reference.putFile(fileUri, {
            customMetadata: {
                uploadedBy: userId,
                listingId: listingId,
                listingType: listingType,
                uploadDate: new Date().toISOString(),
                imageIndex: index.toString(),
            },
        });

        // Track progress
        if (onProgress) {
            task.on('state_changed', snapshot => {
                const progress: UploadProgress = {
                    bytesTransferred: snapshot.bytesTransferred,
                    totalBytes: snapshot.totalBytes,
                    percentage: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                };
                onProgress(index, progress);
            });
        }

        // Wait for upload to complete
        await task;

        // Get download URL
        const url = await reference.getDownloadURL();

        return url;
    });

    return Promise.all(uploadPromises);
};

/**
 * Upload profile photo
 * @param uri - Local file URI
 * @param userId - User ID
 * @param onProgress - Optional progress callback
 */
export const uploadProfilePhoto = async (
    uri: string,
    userId: string,
    onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
    const path = `users/${userId}/profile/avatar_${Date.now()}.jpg`;

    // Compress image (smaller for profile photos)
    const compressedUri = await compressImage(uri, 800, 800, 85);

    // Create reference
    const reference = storage().ref(path);

    // Handle file URI for different platforms
    const fileUri = Platform.OS === 'ios' ? compressedUri.replace('file://', '') : compressedUri;

    // Upload file with metadata
    const task = reference.putFile(fileUri, {
        customMetadata: {
            uploadedBy: userId,
            uploadDate: new Date().toISOString(),
            imageType: 'profile',
        },
    });

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

    return url;
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
            // Extract path from Firebase Storage URL
            // URL format: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile.jpg?alt=media&token=...
            const pathMatch = url.match(/\/o\/(.+?)\?/);
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

/**
 * Delete all images for a specific listing
 * @param userId - User ID
 * @param listingId - Listing ID
 * @param listingType - Type of listing
 */
export const deleteListingImages = async (
    userId: string,
    listingId: string,
    listingType: 'business' | 'service' | 'marketplace' | 'room' | 'professional' | 'product'
): Promise<void> => {
    try {
        const folderName = listingType === 'professional' ? 'professionals' : `${listingType}s`;
        const folderPath = `listings/${folderName}/${userId}/${listingId}`;

        const reference = storage().ref(folderPath);
        const listResult = await reference.listAll();

        // Delete all files in the folder
        const deletePromises = listResult.items.map(item => item.delete());
        await Promise.all(deletePromises);

        console.log(`✅ Deleted ${listResult.items.length} images from ${folderPath}`);
    } catch (error) {
        console.error('Error deleting listing images:', error);
        throw error;
    }
};

/**
 * Upload business logo (separate from listing images)
 * @param uri - Local file URI
 * @param userId - User ID
 * @param businessId - Business ID
 */
export const uploadBusinessLogo = async (
    uri: string,
    userId: string,
    businessId: string,
    onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
    const path = `listings/businesses/${userId}/${businessId}/logo_${Date.now()}.jpg`;

    // Compress logo (square format)
    const compressedUri = await compressImage(uri, 400, 400, 85);

    const reference = storage().ref(path);
    const fileUri = Platform.OS === 'ios' ? compressedUri.replace('file://', '') : compressedUri;

    const task = reference.putFile(fileUri, {
        customMetadata: {
            uploadedBy: userId,
            listingId: businessId,
            listingType: 'business',
            uploadDate: new Date().toISOString(),
            imageType: 'logo',
        },
    });

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

    await task;
    return reference.getDownloadURL();
};

/**
 * Upload service provider photo (separate from listing images)
 * @param uri - Local file URI
 * @param userId - User ID
 * @param serviceId - Service ID
 */
export const uploadServiceProviderPhoto = async (
    uri: string,
    userId: string,
    serviceId: string,
    onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
    const path = `listings/services/${userId}/${serviceId}/provider_${Date.now()}.jpg`;

    // Compress photo
    const compressedUri = await compressImage(uri, 800, 800, 85);

    const reference = storage().ref(path);
    const fileUri = Platform.OS === 'ios' ? compressedUri.replace('file://', '') : compressedUri;

    const task = reference.putFile(fileUri, {
        customMetadata: {
            uploadedBy: userId,
            listingId: serviceId,
            listingType: 'service',
            uploadDate: new Date().toISOString(),
            imageType: 'provider',
        },
    });

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

    await task;
    return reference.getDownloadURL();
};

/**
 * Get all image URLs for a listing
 * @param userId - User ID
 * @param listingId - Listing ID
 * @param listingType - Type of listing
 */
export const getListingImages = async (
    userId: string,
    listingId: string,
    listingType: 'business' | 'service' | 'marketplace' | 'room' | 'professional' | 'product'
): Promise<string[]> => {
    try {
        const folderName = listingType === 'professional' ? 'professionals' : `${listingType}s`;
        const folderPath = `listings/${folderName}/${userId}/${listingId}`;

        const reference = storage().ref(folderPath);
        const listResult = await reference.listAll();

        // Get download URLs for all images
        const urlPromises = listResult.items.map(item => item.getDownloadURL());
        const urls = await Promise.all(urlPromises);

        return urls;
    } catch (error) {
        console.error('Error getting listing images:', error);
        return [];
    }
};
