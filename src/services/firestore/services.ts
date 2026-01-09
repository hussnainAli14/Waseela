import { firebaseFirestore } from '@/config/firebase';
import type { Service, ServiceFormData, ListingFilters, ListingStatus } from '@/types/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const COLLECTION = 'services';

/**
 * Create a new service listing
 */
export const createService = async (
    data: ServiceFormData,
    providerId: string,
    images: string[] = []
): Promise<string> => {
    const serviceData: Omit<Service, 'id'> = {
        ...data,
        providerId,
        images,
        rating: 0,
        reviewCount: 0,
        verified: false,
        status: 'pending' as ListingStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const docRef = await firebaseFirestore.collection(COLLECTION).add(serviceData);
    return docRef.id;
};

/**
 * Get a single service by ID
 */
export const getService = async (serviceId: string): Promise<Service | null> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(serviceId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data(),
    } as Service;
};

/**
 * Get services with filters and pagination
 */
export const getServices = async (
    filters: ListingFilters & { serviceType?: string } = {},
    limit: number = 20,
    startAfterDoc?: FirebaseFirestoreTypes.DocumentSnapshot
): Promise<{ services: Service[]; lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null }> => {
    let query = firebaseFirestore.collection(COLLECTION).where('status', '==', 'approved');

    // Apply filters
    if (filters.serviceType) {
        query = query.where('serviceType', '==', filters.serviceType);
    }

    if (filters.city) {
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

    const services: Service[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Service[];

    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    return { services, lastDoc };
};

/**
 * Search services by name
 */
export const searchServices = async (
    searchTerm: string,
    limit: number = 20
): Promise<Service[]> => {
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
    })) as Service[];
};

/**
 * Get featured services (top rated)
 */
export const getFeaturedServices = async (limit: number = 10): Promise<Service[]> => {
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
    })) as Service[];
};

/**
 * Get services by provider
 */
export const getServicesByProvider = async (providerId: string): Promise<Service[]> => {
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('providerId', '==', providerId)
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Service[];
};

/**
 * Update a service
 */
export const updateService = async (
    serviceId: string,
    data: Partial<ServiceFormData>,
    images?: string[]
): Promise<void> => {
    const updateData: any = {
        ...data,
        updatedAt: new Date().toISOString(),
    };

    if (images) {
        updateData.images = images;
    }

    await firebaseFirestore.collection(COLLECTION).doc(serviceId).update(updateData);
};

/**
 * Delete a service
 */
export const deleteService = async (serviceId: string): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(serviceId).delete();
};

/**
 * Update service status (for admin/moderation)
 */
export const updateServiceStatus = async (
    serviceId: string,
    status: ListingStatus
): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(serviceId).update({
        status,
        updatedAt: new Date().toISOString(),
    });
};

/**
 * Update service rating (called after review)
 */
export const updateServiceRating = async (
    serviceId: string,
    newRating: number,
    reviewCount: number
): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(serviceId).update({
        rating: newRating,
        reviewCount,
        updatedAt: new Date().toISOString(),
    });
};

/**
 * Listen to services in real-time
 */
export const subscribeToServices = (
    filters: ListingFilters & { serviceType?: string },
    callback: (services: Service[]) => void
): (() => void) => {
    let query = firebaseFirestore.collection(COLLECTION).where('status', '==', 'approved');

    if (filters.serviceType) {
        query = query.where('serviceType', '==', filters.serviceType);
    }

    if (filters.city) {
        query = query.where('city', '==', filters.city);
    }

    query = query.orderBy('createdAt', 'desc').limit(20);

    const unsubscribe = query.onSnapshot(snapshot => {
        const services: Service[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Service[];

        callback(services);
    });

    return unsubscribe;
};
