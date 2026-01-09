import { firebaseFirestore } from '@/config/firebase';
import type { SavedListing } from '@/types/firestore';

export const saveItem = async (
    userId: string,
    itemType: 'business' | 'service' | 'marketplace' | 'room',
    itemId: string
): Promise<void> => {
    const savedData: SavedListing = {
        itemType,
        itemId,
        savedAt: new Date().toISOString(),
    };

    await firebaseFirestore
        .collection('savedListings')
        .doc(userId)
        .collection('items')
        .doc(itemId)
        .set(savedData);
};

export const unsaveItem = async (
    userId: string,
    itemId: string
): Promise<void> => {
    await firebaseFirestore
        .collection('savedListings')
        .doc(userId)
        .collection('items')
        .doc(itemId)
        .delete();
};

export const getSavedItems = async (userId: string): Promise<SavedListing[]> => {
    const snapshot = await firebaseFirestore
        .collection('savedListings')
        .doc(userId)
        .collection('items')
        .orderBy('savedAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        ...doc.data(),
    })) as SavedListing[];
};

export const getSavedItemsByType = async (
    userId: string,
    itemType: 'business' | 'service' | 'marketplace' | 'room'
): Promise<SavedListing[]> => {
    const snapshot = await firebaseFirestore
        .collection('savedListings')
        .doc(userId)
        .collection('items')
        .where('itemType', '==', itemType)
        .orderBy('savedAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        ...doc.data(),
    })) as SavedListing[];
};

export const isItemSaved = async (
    userId: string,
    itemId: string
): Promise<boolean> => {
    const doc = await firebaseFirestore
        .collection('savedListings')
        .doc(userId)
        .collection('items')
        .doc(itemId)
        .get();

    return doc.exists;
};

export const getSavedCount = async (userId: string): Promise<number> => {
    const snapshot = await firebaseFirestore
        .collection('savedListings')
        .doc(userId)
        .collection('items')
        .get();

    return snapshot.size;
};
