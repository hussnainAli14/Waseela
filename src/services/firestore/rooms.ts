import { firebaseFirestore } from '@/config/firebase';
import type { Room, RoomFormData, RoomFilters, RoomStatus } from '@/types/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { toMilliseconds } from '@/utils/dateUtils';

const COLLECTION = 'rooms';

/**
 * Convert Firestore timestamp objects to numbers (milliseconds) for Redux serialization
 */
const serializeRoom = (data: any): Room => {
    const room = { ...data };

    // Convert Firestore timestamps to numbers
    if (room.createdAt) {
        room.createdAt = toMilliseconds(room.createdAt);
    }
    if (room.updatedAt) {
        room.updatedAt = toMilliseconds(room.updatedAt);
    }
    if (room.availableFrom) {
        room.availableFrom = toMilliseconds(room.availableFrom);
    }
    // Rooms might not have approvedAt/rejectedAt systematically but safe to check
    if (room.approvedAt) {
        room.approvedAt = toMilliseconds(room.approvedAt);
    }
    if (room.rejectedAt) {
        room.rejectedAt = toMilliseconds(room.rejectedAt);
    }

    return room as Room;
};

import { uploadListingImages } from '@/services/storage/imageUpload';

export const createRoom = async (
    data: RoomFormData,
    posterId: string,
    poster: { name: string; photo?: string },
    imageUris: string[] = []
): Promise<string> => {
    try {
        // 1. Generate ID first
        const docRef = firebaseFirestore.collection(COLLECTION).doc();
        const roomId = docRef.id;

        // 2. Upload images in parallel (if any)
        let imageUrls: string[] = [];
        if (imageUris.length > 0) {
            imageUrls = await uploadListingImages(
                imageUris,
                posterId,
                roomId,
                'room'
            );
        }

        // 3. Build room data object
        const roomData: any = {
            title: data.title,
            type: data.type,
            city: data.city,
            locationLine1: data.locationLine1,
            price: data.price,
            priceLabel: `£${data.price}/month`,
            description: data.description,
            billsIncluded: data.billsIncluded,
            availableFrom: toMilliseconds(data.availableFrom),
            amenities: data.amenities,
            whatsapp: data.whatsapp,
            posterId,
            posterName: poster.name,
            posterPhoto: poster.photo,
            images: imageUrls,
            status: 'pending' as RoomStatus,
            views: 0,
            createdAt: toMilliseconds(new Date().toISOString()),
            updatedAt: toMilliseconds(new Date().toISOString()),
        };

        // Only add optional fields if they have values
        if (data.locationLine2) roomData.locationLine2 = data.locationLine2;
        if (data.postcode) roomData.postcode = data.postcode;
        if (data.email) roomData.email = data.email;
        if (data.phone) roomData.phone = data.phone;

        await docRef.set(roomData);
        return roomId;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
};

export const getRoom = async (roomId: string): Promise<Room | null> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(roomId).get();

    if (!doc.exists) {
        return null;
    }

    return serializeRoom({
        id: doc.id,
        ...doc.data(),
    });
};

export const getRooms = async (
    filters: RoomFilters = {},
    limit: number = 20,
    startAfterDocId?: string
): Promise<{ rooms: Room[]; lastDocId: string | null }> => {
    console.log('🔥 Firestore: getRooms called with filters:', filters);
    // Start with base collection query - only filter by status if explicitly requested
    // This allows rooms without status field to be included
    let query: FirebaseFirestoreTypes.Query = firebaseFirestore.collection(COLLECTION);

    // Only filter by status if explicitly provided in filters (default to 'available' if not specified)
    // For now, we'll filter by 'available' by default, but make it optional
    query = query.where('status', '==', 'available');

    // Apply filters
    if (filters.type) {
        console.log('📂 Firestore: Adding type filter:', filters.type);
        query = query.where('type', '==', filters.type);
    }

    if (filters.city) {
        console.log('🏙️ Firestore: Adding city filter:', filters.city);
        query = query.where('city', '==', filters.city);
    }

    if (filters.billsIncluded !== undefined) {
        query = query.where('billsIncluded', '==', filters.billsIncluded);
    }

    // Handle price filters (client-side for maxPrice, Firestore for minPrice)
    if (filters.minPrice) {
        query = query.where('price', '>=', filters.minPrice);
    }

    // Determine if we have any filters beyond status that would require a composite index with orderBy
    // Since we always filter by status, any additional filter + orderBy requires a composite index
    const hasAdditionalFilters = !!(filters.type || filters.city || filters.billsIncluded !== undefined || filters.minPrice);

    // Only use orderBy if we don't have additional filters (status + orderBy works without composite index)
    // If we have additional filters, skip orderBy and sort in memory to avoid index errors
    let shouldSortInMemory = hasAdditionalFilters;

    if (!shouldSortInMemory) {
        query = query.orderBy('createdAt', 'desc');
    }

    // Fetch more results if we need to sort in memory (to ensure enough data after filtering)
    const queryLimit = shouldSortInMemory ? limit * 2 : limit;
    query = query.limit(queryLimit);

    // Pagination - only works with orderBy, so skip if we're sorting in memory
    if (startAfterDocId && !shouldSortInMemory) {
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
        console.log('✅ Firestore: Query returned', snapshot.docs.length, 'rooms');

        // Log sample data to help debug filter issues
        if (snapshot.docs.length === 0 && (filters.type || filters.city)) {
            console.warn('⚠️ Firestore: No results found with filters:', filters);
            console.log('💡 Tip: Check if type/city values match exactly (case-sensitive)');
        }

        let rooms: Room[] = snapshot.docs.map(doc => serializeRoom({
            id: doc.id,
            ...doc.data(),
        }));

        // Apply maxPrice filter client-side (if provided)
        if (filters.maxPrice) {
            rooms = rooms.filter(room => room.price <= filters.maxPrice!);
        }

        // If we skipped orderBy due to filters requiring index, sort in memory
        if (shouldSortInMemory) {
            rooms = rooms.sort((a, b) => {
                const dateA = toMilliseconds(a.createdAt);
                const dateB = toMilliseconds(b.createdAt);
                return dateB - dateA;
            });
            // Limit to requested amount after sorting
            rooms = rooms.slice(0, limit);
        }

        // Return only the document ID instead of the DocumentSnapshot
        const lastDocId = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null;

        return { rooms, lastDocId };
    } catch (error: any) {
        // If it's an index error, retry without orderBy and sort in memory
        if (error.message?.includes('index') || error.code === 'failed-precondition') {
            console.warn('⚠️ Firestore: Index missing, retrying without orderBy and sorting in memory');
            try {
                // Retry query without orderBy
                let fallbackQuery: FirebaseFirestoreTypes.Query = firebaseFirestore.collection(COLLECTION);

                fallbackQuery = fallbackQuery.where('status', '==', 'available');
                if (filters.type) {
                    fallbackQuery = fallbackQuery.where('type', '==', filters.type);
                }
                if (filters.city) {
                    fallbackQuery = fallbackQuery.where('city', '==', filters.city);
                }
                if (filters.billsIncluded !== undefined) {
                    fallbackQuery = fallbackQuery.where('billsIncluded', '==', filters.billsIncluded);
                }
                if (filters.minPrice) {
                    fallbackQuery = fallbackQuery.where('price', '>=', filters.minPrice);
                }

                // Get more results to account for sorting in memory, then limit
                const fallbackSnapshot = await fallbackQuery.limit(limit * 2).get();

                let fallbackRooms: Room[] = fallbackSnapshot.docs.map(doc => serializeRoom({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Apply maxPrice filter
                if (filters.maxPrice) {
                    fallbackRooms = fallbackRooms.filter(room => room.price <= filters.maxPrice!);
                }

                // Sort by createdAt in memory
                fallbackRooms = fallbackRooms.sort((a, b) => {
                    const dateA = toMilliseconds(a.createdAt);
                    const dateB = toMilliseconds(b.createdAt);
                    return dateB - dateA;
                });

                // Limit to requested amount
                fallbackRooms = fallbackRooms.slice(0, limit);

                const lastDocId = fallbackRooms.length > 0 ? fallbackRooms[fallbackRooms.length - 1].id : null;

                console.log('✅ Firestore: Fallback query returned', fallbackRooms.length, 'rooms (sorted in memory)');
                console.warn('💡 Create Firestore indexes for better performance. Check Firebase Console.');

                return { rooms: fallbackRooms, lastDocId };
            } catch (fallbackError: any) {
                console.error('❌ Firestore: Fallback query also failed:', fallbackError);
                throw fallbackError;
            }
        }

        console.error('❌ Firestore: Error fetching rooms:', error);
        if (error.message?.includes('index') || error.code === 'failed-precondition') {
            console.error('💡 Firestore index required. Check Firebase Console for index creation link.');
            console.error('💡 Tip: The app will work without indexes by sorting in memory, but creating indexes improves performance.');
        }
        throw error;
    }
};

export const getRoomsByPoster = async (posterId: string): Promise<Room[]> => {
    try {
        // Try with orderBy first
        try {
            const query = firebaseFirestore
                .collection(COLLECTION)
                .where('posterId', '==', posterId)
                .orderBy('createdAt', 'desc');

            const snapshot = await query.get();
            const rooms = snapshot.docs.map(doc => serializeRoom({
                id: doc.id,
                ...doc.data(),
            }));

            // Already sorted by Firestore, but ensure consistency
            return rooms.sort((a, b) => {
                const dateA = toMilliseconds(a.createdAt);
                const dateB = toMilliseconds(b.createdAt);
                return dateB - dateA;
            });
        } catch (error: any) {
            // If orderBy fails (index missing), fetch without orderBy and sort in memory
            if (error.code === 'failed-precondition' || error.message?.includes('index')) {
                console.warn('⚠️ Firestore: Index missing for getRoomsByPoster, fetching without orderBy');
                const snapshot = await firebaseFirestore
                    .collection(COLLECTION)
                    .where('posterId', '==', posterId)
                    .get();

                const rooms = snapshot.docs.map(doc => serializeRoom({
                    id: doc.id,
                    ...doc.data(),
                }));

                return rooms.sort((a, b) => {
                    const dateA = toMilliseconds(a.createdAt);
                    const dateB = toMilliseconds(b.createdAt);
                    return dateB - dateA;
                });
            }
            throw error;
        }
    } catch (error: any) {
        console.error('❌ Firestore: Error fetching rooms by poster:', error);
        throw error;
    }
};

export const updateRoom = async (
    roomId: string,
    data: Partial<RoomFormData>,
    images?: string[]
): Promise<void> => {
    const updateData: any = {
        ...data,
        updatedAt: new Date().toISOString(),
    };

    if (data.price) {
        updateData.priceLabel = `£${data.price}/month`;
    }

    if (data.availableFrom) {
        updateData.availableFrom = data.availableFrom.toISOString();
    }

    if (images) {
        updateData.images = images;
    }

    await firebaseFirestore.collection(COLLECTION).doc(roomId).update(updateData);
};

export const deleteRoom = async (roomId: string): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(roomId).delete();
};

export const markAsRented = async (roomId: string): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(roomId).update({
        status: 'rented' as RoomStatus,
        updatedAt: new Date().toISOString(),
    });
};



export const incrementViews = async (roomId: string): Promise<void> => {
    // Use atomic increment
    await firebaseFirestore.collection(COLLECTION).doc(roomId).update({
        views: firestore.FieldValue.increment(1),
    });
};

export const searchRooms = async (
    searchTerm: string,
    limit: number = 20
): Promise<Room[]> => {
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('status', '==', 'available')
        .orderBy('title')
        .startAt(searchTerm)
        .endAt(searchTerm + '\uf8ff')
        .limit(limit)
        .get();

    return snapshot.docs.map(doc => serializeRoom({
        id: doc.id,
        ...doc.data(),
    }));
};

/**
 * Get related rooms by type
 */
export const getRelatedRooms = async (
    type: string,
    currentId: string,
    limit: number = 3
): Promise<Room[]> => {
    try {
        const snapshot = await firebaseFirestore
            .collection(COLLECTION)
            .where('type', '==', type)
            .where('status', '==', 'available')
            .limit(limit + 2)
            .get();

        const rooms = snapshot.docs
            .map(doc => serializeRoom({
                id: doc.id,
                ...doc.data(),
            }));

        return rooms
            .filter(r => r.id !== currentId)
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching related rooms:', error);
        return [];
    }
};
