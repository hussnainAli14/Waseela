import { firebaseFirestore } from '@/config/firebase';
import type { Professional, ProfessionalFormData, ListingStatus } from '@/types/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const COLLECTION = 'professionals';

export const createProfessional = async (
    data: ProfessionalFormData,
    userId: string,
    profilePhoto?: string
): Promise<string> => {
    const professionalData: Omit<Professional, 'id'> = {
        ...data,
        userId,
        profilePhoto,
        connections: 0,
        verified: false,
        status: 'pending' as ListingStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const docRef = await firebaseFirestore.collection(COLLECTION).add(professionalData);
    return docRef.id;
};

export const getProfessional = async (professionalId: string): Promise<Professional | null> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(professionalId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data(),
    } as Professional;
};

export const getProfessionalByUserId = async (userId: string): Promise<Professional | null> => {
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('userId', '==', userId)
        .limit(1)
        .get();

    if (snapshot.empty) {
        return null;
    }

    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data(),
    } as Professional;
};

export const getProfessionals = async (
    filters: { industry?: string; location?: string; verified?: boolean } = {},
    limit: number = 20,
    startAfterDoc?: FirebaseFirestoreTypes.DocumentSnapshot
): Promise<{ professionals: Professional[]; lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null }> => {
    let query = firebaseFirestore.collection(COLLECTION).where('status', '==', 'approved');

    if (filters.industry) {
        query = query.where('industry', '==', filters.industry);
    }

    if (filters.location) {
        query = query.where('location', '==', filters.location);
    }

    if (filters.verified !== undefined) {
        query = query.where('verified', '==', filters.verified);
    }

    query = query.orderBy('createdAt', 'desc').limit(limit);

    if (startAfterDoc) {
        query = query.startAfter(startAfterDoc);
    }

    const snapshot = await query.get();

    const professionals: Professional[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Professional[];

    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    return { professionals, lastDoc };
};

export const updateProfessional = async (
    professionalId: string,
    data: Partial<ProfessionalFormData>,
    profilePhoto?: string
): Promise<void> => {
    const updateData: any = {
        ...data,
        updatedAt: new Date().toISOString(),
    };

    if (profilePhoto) {
        updateData.profilePhoto = profilePhoto;
    }

    await firebaseFirestore.collection(COLLECTION).doc(professionalId).update(updateData);
};

export const deleteProfessional = async (professionalId: string): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(professionalId).delete();
};

export const updateProfessionalStatus = async (
    professionalId: string,
    status: ListingStatus
): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(professionalId).update({
        status,
        updatedAt: new Date().toISOString(),
    });
};

export const incrementConnections = async (professionalId: string): Promise<void> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(professionalId).get();
    const currentConnections = (doc.data()?.connections || 0) as number;

    await firebaseFirestore.collection(COLLECTION).doc(professionalId).update({
        connections: currentConnections + 1,
    });
};

export const searchProfessionals = async (
    searchTerm: string,
    limit: number = 20
): Promise<Professional[]> => {
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('status', '==', 'approved')
        .orderBy('fullName')
        .startAt(searchTerm)
        .endAt(searchTerm + '\uf8ff')
        .limit(limit)
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Professional[];
};
