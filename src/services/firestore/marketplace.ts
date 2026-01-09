import { firebaseFirestore } from '@/config/firebase';
import type { MarketplaceItem, MarketplaceFormData, MarketplaceFilters, ItemStatus } from '@/types/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const COLLECTION = 'marketplace';

export const createMarketplaceItem = async (
    data: MarketplaceFormData,
    sellerId: string,
    images: string[] = []
): Promise<string> => {
    const itemData: Omit<MarketplaceItem, 'id'> = {
        ...data,
        sellerId,
        images,
        currency: 'GBP',
        status: 'active' as ItemStatus,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const docRef = await firebaseFirestore.collection(COLLECTION).add(itemData);
    return docRef.id;
};

export const getMarketplaceItem = async (itemId: string): Promise<MarketplaceItem | null> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(itemId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data(),
    } as MarketplaceItem;
};

export const getMarketplaceItems = async (
    filters: MarketplaceFilters = {},
    limit: number = 20,
    startAfterDoc?: FirebaseFirestoreTypes.DocumentSnapshot
): Promise<{ items: MarketplaceItem[]; lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null }> => {
    let query = firebaseFirestore.collection(COLLECTION).where('status', '==', 'active');

    if (filters.category) {
        query = query.where('category', '==', filters.category);
    }

    if (filters.city) {
        query = query.where('city', '==', filters.city);
    }

    if (filters.condition) {
        query = query.where('condition', '==', filters.condition);
    }

    query = query.orderBy('createdAt', 'desc').limit(limit);

    if (startAfterDoc) {
        query = query.startAfter(startAfterDoc);
    }

    const snapshot = await query.get();

    const items: MarketplaceItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as MarketplaceItem[];

    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    return { items, lastDoc };
};

export const getMarketplaceItemsBySeller = async (sellerId: string): Promise<MarketplaceItem[]> => {
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('sellerId', '==', sellerId)
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as MarketplaceItem[];
};

export const updateMarketplaceItem = async (
    itemId: string,
    data: Partial<MarketplaceFormData>,
    images?: string[]
): Promise<void> => {
    const updateData: any = {
        ...data,
        updatedAt: new Date().toISOString(),
    };

    if (images) {
        updateData.images = images;
    }

    await firebaseFirestore.collection(COLLECTION).doc(itemId).update(updateData);
};

export const deleteMarketplaceItem = async (itemId: string): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(itemId).delete();
};

export const markAsSold = async (itemId: string): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(itemId).update({
        status: 'sold' as ItemStatus,
        updatedAt: new Date().toISOString(),
    });
};

export const incrementViews = async (itemId: string): Promise<void> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(itemId).get();
    const currentViews = (doc.data()?.views || 0) as number;

    await firebaseFirestore.collection(COLLECTION).doc(itemId).update({
        views: currentViews + 1,
    });
};

export const searchMarketplaceItems = async (
    searchTerm: string,
    limit: number = 20
): Promise<MarketplaceItem[]> => {
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('status', '==', 'active')
        .orderBy('title')
        .startAt(searchTerm)
        .endAt(searchTerm + '\uf8ff')
        .limit(limit)
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as MarketplaceItem[];
};
