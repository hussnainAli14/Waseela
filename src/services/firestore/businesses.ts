import { firebaseFirestore } from '@/config/firebase';
import type { Business, BusinessFormData, ListingFilters, ListingStatus } from '@/types/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const COLLECTION = 'businesses';

/**
 * Create a new business listing
 */
export const createBusiness = async (
    data: BusinessFormData,
    ownerId: string,
    images: string[] = []
): Promise<string> => {
    const businessData: Omit<Business, 'id'> = {
        ...data,
        ownerId,
        images,
        rating: 0,
        reviewCount: 0,
        verified: false,
        status: 'pending' as ListingStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const docRef = await firebaseFirestore.collection(COLLECTION).add(businessData);
    return docRef.id;
};

/**
 * Get a single business by ID
 */
export const getBusiness = async (businessId: string): Promise<Business | null> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(businessId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data(),
    } as Business;
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
    // Start with base collection query - only filter by status if explicitly requested
    // This allows businesses without status field to be included
    let query: FirebaseFirestoreTypes.Query = firebaseFirestore.collection(COLLECTION);
    
    // Only filter by status if explicitly provided in filters
    if (filters.status !== undefined) {
        query = query.where('status', '==', filters.status);
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

        let businesses: Business[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Business[];

        // If we couldn't use orderBy due to filters requiring index, sort in memory
        if (hasFiltersRequiringIndex) {
            businesses = businesses.sort((a, b) => {
                const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : (a.createdAt as any)?.toMillis?.() || 0;
                const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : (b.createdAt as any)?.toMillis?.() || 0;
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
                
                if (filters.status !== undefined) {
                    fallbackQuery = fallbackQuery.where('status', '==', filters.status);
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
                    const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : (a.createdAt as any)?.toMillis?.() || 0;
                    const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : (b.createdAt as any)?.toMillis?.() || 0;
                    return dateB - dateA; // Descending order
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

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Business[];
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

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Business[];
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
            const businesses = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Business[];
            
            // Already sorted by Firestore, but ensure consistency
            return businesses.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
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
                
                const businesses = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Business[];
                
                return businesses.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
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
    const updateData: any = {
        ...data,
        updatedAt: new Date().toISOString(),
    };

    if (images) {
        updateData.images = images;
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
    let query = firebaseFirestore.collection(COLLECTION).where('status', '==', 'approved');

    if (filters.category) {
        query = query.where('category', '==', filters.category);
    }

    if (filters.city) {
        query = query.where('city', '==', filters.city);
    }

    query = query.orderBy('createdAt', 'desc').limit(20);

    const unsubscribe = query.onSnapshot(snapshot => {
        const businesses: Business[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Business[];

        callback(businesses);
    });

    return unsubscribe;
};
