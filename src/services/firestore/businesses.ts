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
    startAfterDoc?: FirebaseFirestoreTypes.DocumentSnapshot
): Promise<{ businesses: Business[]; lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null }> => {
    console.log('🔥 Firestore: getBusinesses called with filters:', filters);
    let query = firebaseFirestore.collection(COLLECTION).where('status', '==', 'approved');

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

    // Order by and limit
    query = query.orderBy('createdAt', 'desc').limit(limit);

    // Pagination
    if (startAfterDoc) {
        query = query.startAfter(startAfterDoc);
    }

    const snapshot = await query.get();
    console.log('✅ Firestore: Query returned', snapshot.docs.length, 'businesses');

    const businesses: Business[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Business[];

    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    return { businesses, lastDoc };
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
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('ownerId', '==', ownerId)
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Business[];
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
