import { firebaseFirestore } from '@/config/firebase';
import type { MarketplaceItem, MarketplaceFormData, MarketplaceFilters, ItemStatus } from '@/types/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { toMilliseconds } from '@/utils/dateUtils';

const COLLECTION = 'marketplace';

import { uploadListingImages } from '@/services/storage/imageUpload';

export const createMarketplaceItem = async (
    data: MarketplaceFormData,
    sellerId: string,
    imageUris: string[] = []
): Promise<string> => {
    try {
        // 1. Generate ID first
        const docRef = firebaseFirestore.collection(COLLECTION).doc();
        const itemId = docRef.id;

        // 2. Upload images in parallel (if any)
        let imageUrls: string[] = [];
        if (imageUris.length > 0) {
            imageUrls = await uploadListingImages(
                imageUris,
                sellerId,
                itemId,
                'marketplace'
            );
        }

        // 3. Build item data object
        const itemData: MarketplaceItem = {
            id: itemId,
            ...data,
            sellerId,
            images: imageUrls,
            currency: 'GBP',
            status: 'active' as ItemStatus,
            views: 0,
            createdAt: toMilliseconds(new Date().toISOString()),
            updatedAt: toMilliseconds(new Date().toISOString()),
        } as MarketplaceItem;

        await docRef.set(itemData);
        return itemId;
    } catch (error) {
        console.error('Error creating marketplace item:', error);
        throw error;
    }
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
    // Use atomic increment to avoid concurrency issues and save a read operation
    await firebaseFirestore.collection(COLLECTION).doc(itemId).update({
        views: firestore.FieldValue.increment(1),
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

/**
 * Get related marketplace items by category
 */
export const getRelatedMarketplaceItems = async (
    category: string,
    currentId: string,
    limit: number = 3
): Promise<MarketplaceItem[]> => {
    try {
        const snapshot = await firebaseFirestore
            .collection(COLLECTION)
            .where('category', '==', category)
            .where('status', '==', 'active')
            .limit(limit + 2)
            .get();

        const items = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as MarketplaceItem[];

        return items
            .filter(i => i.id !== currentId)
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching related marketplace items:', error);
        return [];
    }
};
