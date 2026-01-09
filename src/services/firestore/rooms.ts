import { firebaseFirestore } from '@/config/firebase';
import type { Room, RoomFormData, RoomFilters, RoomStatus } from '@/types/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const COLLECTION = 'rooms';

export const createRoom = async (
    data: RoomFormData,
    posterId: string,
    images: string[] = []
): Promise<string> => {
    const roomData: Omit<Room, 'id'> = {
        ...data,
        posterId,
        images,
        priceLabel: `£${data.price}/month`,
        availableFrom: data.availableFrom.toISOString(),
        status: 'available' as RoomStatus,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const docRef = await firebaseFirestore.collection(COLLECTION).add(roomData);
    return docRef.id;
};

export const getRoom = async (roomId: string): Promise<Room | null> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(roomId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data(),
    } as Room;
};

export const getRooms = async (
    filters: RoomFilters = {},
    limit: number = 20,
    startAfterDoc?: FirebaseFirestoreTypes.DocumentSnapshot
): Promise<{ rooms: Room[]; lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null }> => {
    let query = firebaseFirestore.collection(COLLECTION).where('status', '==', 'available');

    if (filters.type) {
        query = query.where('type', '==', filters.type);
    }

    if (filters.city) {
        query = query.where('city', '==', filters.city);
    }

    if (filters.billsIncluded !== undefined) {
        query = query.where('billsIncluded', '==', filters.billsIncluded);
    }

    query = query.orderBy('createdAt', 'desc').limit(limit);

    if (startAfterDoc) {
        query = query.startAfter(startAfterDoc);
    }

    const snapshot = await query.get();

    const rooms: Room[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Room[];

    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    return { rooms, lastDoc };
};

export const getRoomsByPoster = async (posterId: string): Promise<Room[]> => {
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('posterId', '==', posterId)
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Room[];
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
    const doc = await firebaseFirestore.collection(COLLECTION).doc(roomId).get();
    const currentViews = (doc.data()?.views || 0) as number;

    await firebaseFirestore.collection(COLLECTION).doc(roomId).update({
        views: currentViews + 1,
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

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Room[];
};
