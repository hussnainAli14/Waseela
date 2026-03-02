import { firebaseFirestore } from '@/config/firebase';
import type { Business, BusinessFormData, ListingFilters, ListingStatus } from '@/types/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { toMilliseconds } from '@/utils/dateUtils';

const COLLECTION = 'businesses';

import { uploadListingImages, deleteImage } from '@/services/storage/imageUpload';

/**
 * Helper function to serialize Firestore document data
 * Converts Timestamp objects to milliseconds for Redux serialization
 */
const serializeBusinessData = (docId: string, data: any): Business => {
    // Helper to convert any timestamp field
    const serializeTimestamp = (timestamp: any): number | undefined => {
        if (!timestamp) return undefined;
        if (timestamp?.toMillis) return timestamp.toMillis();
        if (typeof timestamp === 'number') return timestamp;
        if (typeof timestamp === 'string') return toMilliseconds(timestamp);
        return undefined;
    };

    return {
        id: docId,
        ...data,
        createdAt: serializeTimestamp(data?.createdAt) ?? Date.now(),
        updatedAt: serializeTimestamp(data?.updatedAt) ?? Date.now(),
        approvedAt: serializeTimestamp(data?.approvedAt),
        rejectedAt: serializeTimestamp(data?.rejectedAt),
    } as Business;
};

/**
 * Create a new business listing
 * Optimizes image upload by running in parallel and ensures listing ID is available for storage path
 */
export const createBusiness = async (
    data: BusinessFormData,
    ownerId: string,
    imageUris: string[] = []
): Promise<string> => {
    try {
        // 1. Generate ID first
        const docRef = firebaseFirestore.collection(COLLECTION).doc();
        const businessId = docRef.id;

        // 2. Upload images in parallel (if any)
        let imageUrls: string[] = [];
        if (imageUris.length > 0) {
            // Separate local file URIs from Firebase Storage URLs
            const localImageUris = imageUris.filter(uri => {
                if (!uri) return false;
                // Only upload local file URIs
                return uri.startsWith('file://') || (!uri.startsWith('http://') && !uri.startsWith('https://'));
            });
            
            const existingFirebaseUrls = imageUris.filter(uri => 
                uri && (uri.startsWith('https://firebasestorage.googleapis.com') || uri.startsWith('http://firebasestorage.googleapis.com'))
            );
            
            // Upload local images if any
            if (localImageUris.length > 0) {
                try {
                    const uploadedUrls = await uploadListingImages(
                        localImageUris,
                        ownerId,
                        businessId,
                        'business'
                    );
                    imageUrls = [...existingFirebaseUrls, ...uploadedUrls];
                } catch (uploadError) {
                    console.error('Error uploading business images:', uploadError);
                    // If upload fails, only use existing Firebase URLs, never store local URIs
                    imageUrls = existingFirebaseUrls;
                    // Optionally: throw error to prevent creating business without images
                    // throw new Error('Failed to upload images. Please try again.');
                }
            } else {
                // No local files to upload, just use existing Firebase URLs
                imageUrls = existingFirebaseUrls;
            }
        }

        // 3. Create document with real image URLs (never store local file URIs)
        const businessData: Business = {
            id: businessId,
            ...data,
            ownerId,
            images: imageUrls, // Only Firebase Storage URLs
            rating: 0,
            reviewCount: 0,
            verified: false,
            status: 'pending' as ListingStatus,
            createdAt: toMilliseconds(new Date().toISOString()), // Store as number for consistency
            updatedAt: toMilliseconds(new Date().toISOString()), // Store as number for consistency
        } as Business; // Cast to satisfy strict typing if needed

        // Add optional whatsapp if present
        if (data.whatsapp) {
            businessData.whatsapp = data.whatsapp;
        }

        await docRef.set(businessData);
        return businessId;
    } catch (error) {
        console.error('Error creating business:', error);
        throw error;
    }
};

/**
 * Get a single business by ID
 */
export const getBusiness = async (businessId: string): Promise<Business | null> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(businessId).get();

    if (!doc.exists) {
        return null;
    }

    return serializeBusinessData(doc.id, doc.data());
};

/**
 * Get businesses with filters and pagination
 */
export const getBusinesses = async (
    filters: ListingFilters = {},
    limit: number = 20,
    startAfterDocId?: string
): Promise<{ businesses: Business[]; lastDocId: string | null }> => {
    console.log('🔥 Firestore: getBusinesses called with filters:', filters);
    // Start with base collection query
    let query: FirebaseFirestoreTypes.Query = firebaseFirestore.collection(COLLECTION);

    // Default to filtering out 'pending' items - only show 'approved' unless explicitly requested otherwise
    // This ensures pending items are not shown in listings (except in profile tab)
    if (filters.status !== undefined) {
        query = query.where('status', '==', filters.status);
    } else {
        // Default: only show approved businesses
        query = query.where('status', '==', 'approved');
    }

    // Apply filters
    if (filters.category) {
        console.log('📂 Firestore: Adding category filter:', filters.category);
        query = query.where('category', '==', filters.category);
    }

    if (filters.city) {
        console.log('🏙️ Firestore: Adding city filter:', filters.city);
        query = query.where('city', '==', filters.city);
    }

    if (filters.verified !== undefined) {
        query = query.where('verified', '==', filters.verified);
    }

    if (filters.minRating) {
        query = query.where('rating', '>=', filters.minRating);
    }

    // Determine if we need to order by createdAt (requires index with filters)
    // When filtering by category, city, or verified, we need a composite index
    // If index doesn't exist, we'll skip orderBy and sort in memory instead
    const hasFiltersRequiringIndex = !!(filters.category || filters.city || filters.verified !== undefined);

    // Only use orderBy if we don't have filters that require an index, or if pagination is not needed
    // This avoids index errors - we'll sort in memory as fallback
    if (!hasFiltersRequiringIndex) {
        query = query.orderBy('createdAt', 'desc');
    }

    // Fetch more results if we need to sort in memory (to account for potential filtering during sort)
    const queryLimit = hasFiltersRequiringIndex ? limit * 2 : limit;
    query = query.limit(queryLimit);

    // Pagination - only works with orderBy, so skip if we're sorting in memory
    if (startAfterDocId && !hasFiltersRequiringIndex) {
        try {
            const lastDoc = await firebaseFirestore.collection(COLLECTION).doc(startAfterDocId).get();
            const docData = lastDoc.data();
            if (docData) {
                query = query.startAfter(lastDoc);
            }
        } catch (error) {
            console.warn('⚠️ Firestore: Could not fetch lastDoc for pagination:', error);
        }
    }

    try {
        const snapshot = await query.get();
        console.log('✅ Firestore: Query returned', snapshot.docs.length, 'businesses');

        // Log sample data to help debug filter issues
        if (snapshot.docs.length === 0 && (filters.category || filters.city)) {
            console.warn('⚠️ Firestore: No results found with filters:', filters);
            console.log('💡 Tip: Check if category/city values match exactly (case-sensitive)');
        }

        let businesses: Business[] = snapshot.docs.map(doc => serializeBusinessData(doc.id, doc.data()));

        // If we couldn't use orderBy due to filters requiring index, sort in memory
        if (hasFiltersRequiringIndex) {
            businesses = businesses.sort((a, b) => {
                const dateA = toMilliseconds(a.createdAt);
                const dateB = toMilliseconds(b.createdAt);
                return dateB - dateA; // Descending order
            });
            // Limit to requested amount after sorting
            businesses = businesses.slice(0, limit);
        }

        // Return only the document ID instead of the DocumentSnapshot
        const lastDocId = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null;

        return { businesses, lastDocId };
    } catch (error: any) {
        // If it's an index error and we haven't tried without orderBy yet, retry without it
        if (error.message?.includes('index') && hasFiltersRequiringIndex) {
            console.warn('⚠️ Firestore: Index missing, retrying without orderBy and sorting in memory');
            try {
                // Retry query without orderBy
                let fallbackQuery: FirebaseFirestoreTypes.Query = firebaseFirestore.collection(COLLECTION);

                // Apply status filter (default to 'approved' if not specified)
                if (filters.status !== undefined) {
                    fallbackQuery = fallbackQuery.where('status', '==', filters.status);
                } else {
                    fallbackQuery = fallbackQuery.where('status', '==', 'approved');
                }
                if (filters.category) {
                    fallbackQuery = fallbackQuery.where('category', '==', filters.category);
                }
                if (filters.city) {
                    fallbackQuery = fallbackQuery.where('city', '==', filters.city);
                }
                if (filters.verified !== undefined) {
                    fallbackQuery = fallbackQuery.where('verified', '==', filters.verified);
                }
                if (filters.minRating) {
                    fallbackQuery = fallbackQuery.where('rating', '>=', filters.minRating);
                }

                // Get more results to account for sorting in memory, then limit
                const fallbackSnapshot = await fallbackQuery.limit(limit * 2).get();

                let fallbackBusinesses: Business[] = fallbackSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Business[];

                // Sort by createdAt in memory
                fallbackBusinesses = fallbackBusinesses.sort((a, b) => {
                    const dateA = toMilliseconds(a.createdAt);
                    const dateB = toMilliseconds(b.createdAt);
                    return dateB - dateA;
                });

                // Limit to requested amount
                fallbackBusinesses = fallbackBusinesses.slice(0, limit);

                const lastDocId = fallbackBusinesses.length > 0 ? fallbackBusinesses[fallbackBusinesses.length - 1].id : null;

                console.log('✅ Firestore: Fallback query returned', fallbackBusinesses.length, 'businesses (sorted in memory)');
                console.warn('💡 Create Firestore indexes for better performance. Check Firebase Console.');

                return { businesses: fallbackBusinesses, lastDocId };
            } catch (fallbackError: any) {
                console.error('❌ Firestore: Fallback query also failed:', fallbackError);
                throw fallbackError;
            }
        }

        console.error('❌ Firestore: Error fetching businesses:', error);
        if (error.message?.includes('index')) {
            console.error('💡 Firestore index required. Check Firebase Console for index creation link.');
        }
        throw error;
    }
};

/**
 * Search businesses by name
 */
export const searchBusinesses = async (
    searchTerm: string,
    limit: number = 20
): Promise<Business[]> => {
    // Note: For production, use Algolia or similar for better search
    // This is a basic implementation using Firestore queries
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('status', '==', 'approved')
        .orderBy('name')
        .startAt(searchTerm)
        .endAt(searchTerm + '\uf8ff')
        .limit(limit)
        .get();

    return snapshot.docs.map(doc => serializeBusinessData(doc.id, doc.data()));
};

/**
 * Get featured businesses (top rated)
 */
export const getFeaturedBusinesses = async (limit: number = 10): Promise<Business[]> => {
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('status', '==', 'approved')
        .where('verified', '==', true)
        .orderBy('rating', 'desc')
        .limit(limit)
        .get();

    return snapshot.docs.map(doc => serializeBusinessData(doc.id, doc.data()));
};

/**
 * Get businesses by owner
 */
export const getBusinessesByOwner = async (ownerId: string): Promise<Business[]> => {
    try {
        // Try with orderBy first
        try {
            const query = firebaseFirestore
                .collection(COLLECTION)
                .where('ownerId', '==', ownerId)
                .orderBy('createdAt', 'desc');

            const snapshot = await query.get();
            const businesses = snapshot.docs.map(doc => serializeBusinessData(doc.id, doc.data()));

            // Already sorted by Firestore, but ensure consistency
            return businesses.sort((a, b) => {
                const dateA = toMilliseconds(a.createdAt);
                const dateB = toMilliseconds(b.createdAt);
                return dateB - dateA;
            });
        } catch (error: any) {
            // If orderBy fails (index missing), fetch without orderBy and sort in memory
            if (error.code === 'failed-precondition' || error.message?.includes('index')) {
                console.warn('⚠️ Firestore: Index missing for getBusinessesByOwner, fetching without orderBy');
                const snapshot = await firebaseFirestore
                    .collection(COLLECTION)
                    .where('ownerId', '==', ownerId)
                    .get();

                const businesses = snapshot.docs.map(doc => serializeBusinessData(doc.id, doc.data()));

                return businesses.sort((a, b) => {
                    const dateA = toMilliseconds(a.createdAt);
                    const dateB = toMilliseconds(b.createdAt);
                    return dateB - dateA;
                });
            }
            throw error;
        }
    } catch (error: any) {
        console.error('❌ Firestore: Error fetching businesses by owner:', error);
        throw error;
    }
};

/**
 * Update a business
 */
export const updateBusiness = async (
    businessId: string,
    data: Partial<BusinessFormData>,
    images?: string[]
): Promise<void> => {
    // Get current business data to compare images
    const businessDoc = await firebaseFirestore.collection(COLLECTION).doc(businessId).get();
    const currentBusiness = businessDoc.data();
    const currentImages: string[] = currentBusiness?.images || [];

    const updateData: any = {
        ...data,
        updatedAt: new Date().toISOString(),
    };

    // Handle images - upload local file URIs if present
    if (images !== undefined) {
        let finalImages = images;
        
        // Check if any images are local file URIs that need uploading
        const localImageUris = images.filter(uri => 
            uri && (uri.startsWith('file://') || (!uri.startsWith('http://') && !uri.startsWith('https://')))
        );
        
        if (localImageUris.length > 0 && currentBusiness?.ownerId) {
            // Upload local images to Firebase Storage
            const uploadedUrls = await uploadListingImages(
                localImageUris,
                currentBusiness.ownerId,
                businessId,
                'business'
            );
            
            // Replace local URIs with Firebase Storage URLs
            finalImages = images.map(uri => {
                const localIndex = localImageUris.indexOf(uri);
                if (localIndex !== -1) {
                    return uploadedUrls[localIndex];
                }
                return uri; // Keep Firebase URLs as-is
            });
        }
        
        updateData.images = finalImages;

        // Find images that were removed (in current but not in new)
        const removedImages = currentImages.filter(img => !finalImages.includes(img));
        
        // Delete removed images from Firebase Storage
        if (removedImages.length > 0) {
            try {
                await Promise.all(removedImages.map(img => deleteImage(img).catch(err => {
                    console.warn('Failed to delete image:', img, err);
                    // Continue even if deletion fails
                })));
            } catch (error) {
                console.error('Error deleting removed images:', error);
                // Continue with update even if image deletion fails
            }
        }
    }

    await firebaseFirestore.collection(COLLECTION).doc(businessId).update(updateData);
};

/**
 * Delete a business
 */
export const deleteBusiness = async (businessId: string): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(businessId).delete();
};

/**
 * Update business status (for admin/moderation)
 */
export const updateBusinessStatus = async (
    businessId: string,
    status: ListingStatus
): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(businessId).update({
        status,
        updatedAt: new Date().toISOString(),
    });
};

/**
 * Update business rating (called after review)
 */
export const updateBusinessRating = async (
    businessId: string,
    newRating: number,
    reviewCount: number
): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(businessId).update({
        rating: newRating,
        reviewCount,
        updatedAt: new Date().toISOString(),
    });
};

/**
 * Listen to businesses in real-time
 */
export const subscribeToBusinesses = (
    filters: ListingFilters,
    callback: (businesses: Business[]) => void
): (() => void) => {
    let unsubscribeFn: (() => void) | null = null;

    const setupSubscription = (useOrderBy: boolean = true) => {
        try {
            let query = firebaseFirestore.collection(COLLECTION).where('status', '==', 'approved');

            if (filters.category) {
                query = query.where('category', '==', filters.category);
            }

            if (filters.city) {
                query = query.where('city', '==', filters.city);
            }

            // Check if we have filters that require a composite index
            const hasFiltersRequiringIndex = !!(filters.category || filters.city);

            // Only use orderBy if requested and we don't have filters that require an index
            if (useOrderBy && !hasFiltersRequiringIndex) {
                query = query.orderBy('createdAt', 'desc');
            }

            query = query.limit(20);

            unsubscribeFn = query.onSnapshot(
                (snapshot) => {
                    // Add null check for snapshot
                    if (!snapshot || !snapshot.docs) {
                        console.warn('⚠️ Firestore: Received null or invalid snapshot in subscribeToBusinesses');
                        callback([]);
                        return;
                    }

                    try {
                        const businesses: Business[] = snapshot.docs.map(doc => serializeBusinessData(doc.id, doc.data()));

                        // If we couldn't use orderBy due to filters requiring index, sort in memory
                        if (hasFiltersRequiringIndex || !useOrderBy) {
                            businesses.sort((a, b) => {
                                const dateA = toMilliseconds(a.createdAt);
                                const dateB = toMilliseconds(b.createdAt);
                                return dateB - dateA; // Descending order
                            });
                        }

                        callback(businesses);
                    } catch (error) {
                        console.error('❌ Firestore: Error processing snapshot in subscribeToBusinesses:', error);
                        callback([]);
                    }
                },
                (error) => {
                    // Handle errors in the subscription
                    console.error('❌ Firestore: Error in subscribeToBusinesses:', error);
                    
                    // If it's an index error and we haven't tried without orderBy yet, retry without it
                    if ((error.code === 'failed-precondition' || error.message?.includes('index')) && useOrderBy) {
                        console.warn('⚠️ Firestore: Index missing for subscription, retrying without orderBy');
                        
                        // Unsubscribe from the current subscription
                        if (unsubscribeFn) {
                            unsubscribeFn();
                        }
                        
                        // Retry without orderBy
                        setupSubscription(false);
                        return;
                    }
                    
                    // For other errors, return empty array
                    callback([]);
                }
            );
        } catch (error) {
            console.error('❌ Firestore: Error setting up subscribeToBusinesses:', error);
            callback([]);
            unsubscribeFn = () => {}; // Return a no-op function
        }
    };

    // Start with orderBy enabled
    setupSubscription(true);

    // Return unsubscribe function
    return () => {
        if (unsubscribeFn) {
            unsubscribeFn();
        }
    };
};

/**
 * Get related businesses by category
 */
export const getRelatedBusinesses = async (
    category: string,
    currentId: string,
    limit: number = 3
): Promise<Business[]> => {
    try {
        const snapshot = await firebaseFirestore
            .collection(COLLECTION)
            .where('category', '==', category)
            .where('status', '==', 'approved')
            .limit(limit + 2)
            .get();

        const businesses = snapshot.docs.map(doc => serializeBusinessData(doc.id, doc.data()));

        return businesses
            .filter(b => b.id !== currentId)
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching related businesses:', error);
        return [];
    }
};
