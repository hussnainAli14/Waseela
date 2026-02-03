import { firebaseFirestore } from '@/config/firebase';
import type { Service, ServiceFormData, ListingFilters, ListingStatus } from '@/types/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { toMilliseconds } from '@/utils/dateUtils';

const COLLECTION = 'services';

/**
 * Convert Firestore timestamp objects to numbers (milliseconds) for Redux serialization
 */
const serializeService = (data: any): Service => {
    const service = { ...data };

    // Convert Firestore timestamps to numbers
    if (service.createdAt) {
        service.createdAt = toMilliseconds(service.createdAt);
    }
    if (service.updatedAt) {
        service.updatedAt = toMilliseconds(service.updatedAt);
    }
    if (service.approvedAt) {
        service.approvedAt = toMilliseconds(service.approvedAt);
    }
    if (service.rejectedAt) {
        service.rejectedAt = toMilliseconds(service.rejectedAt);
    }

    return service as Service;
};

/**
 * Create a new service listing
 */
import { uploadListingImages } from '@/services/storage/imageUpload';

/**
 * Create a new service listing
 * Optimizes image upload by running in parallel and ensures listing ID is available for storage path
 */
export const createService = async (
    data: ServiceFormData,
    providerId: string,
    imageUris: string[] = []
): Promise<string> => {
    try {
        // 1. Generate ID first
        const docRef = firebaseFirestore.collection(COLLECTION).doc();
        const serviceId = docRef.id;

        // 2. Upload images in parallel (if any)
        let imageUrls: string[] = [];
        if (imageUris.length > 0) {
            imageUrls = await uploadListingImages(
                imageUris,
                providerId,
                serviceId,
                'service'
            );
        }

        // 3. Build service data object
        // 3. Build service data object
        const serviceData: Service = {
            id: serviceId,
            name: data.name,
            serviceType: data.serviceType,
            description: data.description,
            city: data.city,
            areasCovered: data.areasCovered || [],
            email: data.email,
            tags: data.tags || [],
            providerId,
            images: imageUrls,
            rating: 0,
            reviewCount: 0,
            verified: false,
            status: 'pending' as ListingStatus,
            createdAt: toMilliseconds(new Date().toISOString()),
            updatedAt: toMilliseconds(new Date().toISOString()),
        } as Service;

        // Add optional fields only if defined
        if (data.whatsapp) serviceData.whatsapp = data.whatsapp;
        if (data.phone) serviceData.phone = data.phone;
        if (data.website) serviceData.website = data.website;
        if (data.instagram) serviceData.instagram = data.instagram;
        if (data.openingHours) serviceData.openingHours = data.openingHours;
        if (data.experience) serviceData.experience = data.experience;

        await docRef.set(serviceData);
        return serviceId;
    } catch (error) {
        console.error('Error creating service:', error);
        throw error;
    }
};

/**
 * Get a single service by ID
 */
export const getService = async (serviceId: string): Promise<Service | null> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(serviceId).get();

    if (!doc.exists) {
        return null;
    }

    return serializeService({
        id: doc.id,
        ...doc.data(),
    });
};

/**
 * Get services with filters and pagination
 */
export const getServices = async (
    filters: ListingFilters & { serviceType?: string } = {},
    limit: number = 20,
    startAfterDocId?: string
): Promise<{ services: Service[]; lastDocId: string | null }> => {
    console.log('🔥 Firestore: getServices called with filters:', filters);
    // Start with base collection query - only filter by status if explicitly requested
    // This allows services without status field to be included
    let query: FirebaseFirestoreTypes.Query = firebaseFirestore.collection(COLLECTION);

    // Only filter by status if explicitly provided in filters
    if (filters.status !== undefined) {
        query = query.where('status', '==', filters.status);
    }

    // Apply filters
    if (filters.serviceType) {
        console.log('📂 Firestore: Adding serviceType filter:', filters.serviceType);
        query = query.where('serviceType', '==', filters.serviceType);
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
    // When filtering by serviceType, city, or verified, we need a composite index
    // If index doesn't exist, we'll skip orderBy and sort in memory instead
    const hasFiltersRequiringIndex = !!(filters.serviceType || filters.city || filters.verified !== undefined);

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
        console.log('✅ Firestore: Query returned', snapshot.docs.length, 'services');

        // Log sample data to help debug filter issues
        if (snapshot.docs.length === 0 && (filters.serviceType || filters.city)) {
            console.warn('⚠️ Firestore: No results found with filters:', filters);
            console.log('💡 Tip: Check if serviceType/city values match exactly (case-sensitive)');
        }

        let services: Service[] = snapshot.docs.map(doc => serializeService({
            id: doc.id,
            ...doc.data(),
        }));

        // If we couldn't use orderBy due to filters requiring index, sort in memory
        if (hasFiltersRequiringIndex) {
            services = services.sort((a, b) => {
                const dateA = toMilliseconds(a.createdAt);
                const dateB = toMilliseconds(b.createdAt);
                return dateB - dateA; // Descending order
            });
            // Limit to requested amount after sorting
            services = services.slice(0, limit);
        }

        // Return only the document ID instead of the DocumentSnapshot
        const lastDocId = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null;

        return { services, lastDocId };
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
                if (filters.serviceType) {
                    fallbackQuery = fallbackQuery.where('serviceType', '==', filters.serviceType);
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

                let fallbackServices: Service[] = fallbackSnapshot.docs.map(doc => serializeService({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Sort by createdAt in memory
                fallbackServices = fallbackServices.sort((a, b) => {
                    const dateA = toMilliseconds(a.createdAt);
                    const dateB = toMilliseconds(b.createdAt);
                    return dateB - dateA; // Descending order
                });

                // Limit to requested amount
                fallbackServices = fallbackServices.slice(0, limit);

                const lastDocId = fallbackServices.length > 0 ? fallbackServices[fallbackServices.length - 1].id : null;

                console.log('✅ Firestore: Fallback query returned', fallbackServices.length, 'services (sorted in memory)');
                console.warn('💡 Create Firestore indexes for better performance. Check Firebase Console.');

                return { services: fallbackServices, lastDocId };
            } catch (fallbackError: any) {
                console.error('❌ Firestore: Fallback query also failed:', fallbackError);
                throw fallbackError;
            }
        }

        console.error('❌ Firestore: Error fetching services:', error);
        if (error.message?.includes('index')) {
            console.error('💡 Firestore index required. Check Firebase Console for index creation link.');
        }
        throw error;
    }
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

    return snapshot.docs.map(doc => serializeService({
        id: doc.id,
        ...doc.data(),
    }));
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

    return snapshot.docs.map(doc => serializeService({
        id: doc.id,
        ...doc.data(),
    }));
};

/**
 * Get services by provider
 */
export const getServicesByProvider = async (providerId: string): Promise<Service[]> => {
    try {
        // Try with orderBy first
        try {
            const query = firebaseFirestore
                .collection(COLLECTION)
                .where('providerId', '==', providerId)
                .orderBy('createdAt', 'desc');

            const snapshot = await query.get();
            const services = snapshot.docs.map(doc => serializeService({
                id: doc.id,
                ...doc.data(),
            }));

            // Already sorted by Firestore, but ensure consistency
            return services.sort((a, b) => {
                const dateA = toMilliseconds(a.createdAt);
                const dateB = toMilliseconds(b.createdAt);
                return dateB - dateA;
            });
        } catch (error: any) {
            // If orderBy fails (index missing), fetch without orderBy and sort in memory
            if (error.code === 'failed-precondition' || error.message?.includes('index')) {
                console.warn('⚠️ Firestore: Index missing for getServicesByProvider, fetching without orderBy');
                const snapshot = await firebaseFirestore
                    .collection(COLLECTION)
                    .where('providerId', '==', providerId)
                    .get();

                const services = snapshot.docs.map(doc => serializeService({
                    id: doc.id,
                    ...doc.data(),
                }));

                return services.sort((a, b) => {
                    const dateA = toMilliseconds(a.createdAt);
                    const dateB = toMilliseconds(b.createdAt);
                    return dateB - dateA;
                });
            }
            throw error;
        }
    } catch (error: any) {
        console.error('❌ Firestore: Error fetching services by provider:', error);
        throw error;
    }
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
        const services: Service[] = snapshot.docs.map(doc => serializeService({
            id: doc.id,
            ...doc.data(),
        }));

        callback(services);
    });

    return unsubscribe;
};

/**
 * Get related services by service type
 */
export const getRelatedServices = async (
    serviceType: string,
    currentId: string,
    limit: number = 3
): Promise<Service[]> => {
    try {
        const snapshot = await firebaseFirestore
            .collection(COLLECTION)
            .where('serviceType', '==', serviceType)
            .where('status', '==', 'approved')
            .limit(limit + 2)
            .get();

        const services = snapshot.docs
            .map(doc => serializeService({
                id: doc.id,
                ...doc.data(),
            }));

        return services
            .filter(s => s.id !== currentId)
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching related services:', error);
        return [];
    }
};
