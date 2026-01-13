import { firebaseFirestore } from '@/config/firebase';
import type { Professional, ProfessionalFormData, ListingStatus } from '@/types/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const COLLECTION = 'professionals';

export const createProfessional = async (
    data: ProfessionalFormData,
    userId: string,
    profilePhoto?: string
): Promise<string> => {
    // Build professional data object, only including defined values
    const professionalData: any = {
        fullName: data.fullName,
        profession: data.profession,
        industry: data.industry,
        location: data.location,
        bio: data.bio,
        skills: data.skills,
        email: data.email,
        userId,
        connections: 0,
        verified: false,
        status: 'pending' as ListingStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // Only add optional fields if they have values (not undefined)
    if (data.company) {
        professionalData.company = data.company;
    }
    if (data.experience) {
        professionalData.experience = data.experience;
    }
    if (data.education) {
        professionalData.education = data.education;
    }
    if (data.phone) {
        professionalData.phone = data.phone;
    }
    if (data.linkedIn) {
        professionalData.linkedIn = data.linkedIn;
    }
    if (data.website) {
        professionalData.website = data.website;
    }
    if (profilePhoto) {
        professionalData.profilePhoto = profilePhoto;
    }

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

/**
 * Get all professional profiles for a user
 */
export const getProfessionalsByUserId = async (userId: string): Promise<Professional[]> => {
    try {
        const snapshot = await firebaseFirestore
            .collection(COLLECTION)
            .where('userId', '==', userId)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Professional[];
    } catch (error: any) {
        console.error('❌ Firestore: Error fetching professionals by user ID:', error);
        throw error;
    }
};

export const getProfessionals = async (
    filters: { industry?: string; location?: string; verified?: boolean } = {},
    limit: number = 20,
    startAfterDocId?: string
): Promise<{ professionals: Professional[]; lastDocId: string | null }> => {
    console.log('🔥 Firestore: getProfessionals called with filters:', filters);
    // Start with base collection query
    let query: FirebaseFirestoreTypes.Query = firebaseFirestore.collection(COLLECTION);
    
    // Filter by approved status
    query = query.where('status', '==', 'approved');

    // Apply filters
    if (filters.industry) {
        console.log('📂 Firestore: Adding industry filter:', filters.industry);
        query = query.where('industry', '==', filters.industry);
    }

    if (filters.location) {
        console.log('🏙️ Firestore: Adding location filter:', filters.location);
        query = query.where('location', '==', filters.location);
    }

    if (filters.verified !== undefined) {
        query = query.where('verified', '==', filters.verified);
    }

    // Determine if we have any filters beyond status that would require a composite index with orderBy
    const hasAdditionalFilters = !!(filters.industry || filters.location || filters.verified !== undefined);
    
    // Only use orderBy if we don't have additional filters (status + orderBy works without composite index)
    let shouldSortInMemory = hasAdditionalFilters;
    
    if (!shouldSortInMemory) {
        query = query.orderBy('createdAt', 'desc');
    }
    
    // Fetch more results if we need to sort in memory
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
        console.log('✅ Firestore: Query returned', snapshot.docs.length, 'professionals');
        
        // Log sample data to help debug filter issues
        if (snapshot.docs.length === 0 && (filters.industry || filters.location)) {
            console.warn('⚠️ Firestore: No results found with filters:', filters);
            console.log('💡 Tip: Check if industry/location values match exactly (case-sensitive)');
        }

        let professionals: Professional[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Professional[];

        // If we skipped orderBy due to filters requiring index, sort in memory
        if (shouldSortInMemory) {
            professionals = professionals.sort((a, b) => {
                const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : (a.createdAt as any)?.toMillis?.() || 0;
                const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : (b.createdAt as any)?.toMillis?.() || 0;
                return dateB - dateA; // Descending order
            });
            // Limit to requested amount after sorting
            professionals = professionals.slice(0, limit);
        }

        // Return only the document ID instead of the DocumentSnapshot
        const lastDocId = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null;

        return { professionals, lastDocId };
    } catch (error: any) {
        // If it's an index error, retry without orderBy and sort in memory
        if (error.message?.includes('index') || error.code === 'failed-precondition') {
            console.warn('⚠️ Firestore: Index missing, retrying without orderBy and sorting in memory');
            try {
                // Retry query without orderBy
                let fallbackQuery: FirebaseFirestoreTypes.Query = firebaseFirestore.collection(COLLECTION);
                
                fallbackQuery = fallbackQuery.where('status', '==', 'approved');
                if (filters.industry) {
                    fallbackQuery = fallbackQuery.where('industry', '==', filters.industry);
                }
                if (filters.location) {
                    fallbackQuery = fallbackQuery.where('location', '==', filters.location);
                }
                if (filters.verified !== undefined) {
                    fallbackQuery = fallbackQuery.where('verified', '==', filters.verified);
                }
                
                // Get more results to account for sorting in memory, then limit
                const fallbackSnapshot = await fallbackQuery.limit(limit * 2).get();
                
                let fallbackProfessionals: Professional[] = fallbackSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Professional[];

                // Sort by createdAt in memory
                fallbackProfessionals = fallbackProfessionals.sort((a, b) => {
                    const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : (a.createdAt as any)?.toMillis?.() || 0;
                    const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : (b.createdAt as any)?.toMillis?.() || 0;
                    return dateB - dateA; // Descending order
                });

                // Limit to requested amount
                fallbackProfessionals = fallbackProfessionals.slice(0, limit);

                const lastDocId = fallbackProfessionals.length > 0 ? fallbackProfessionals[fallbackProfessionals.length - 1].id : null;
                
                console.log('✅ Firestore: Fallback query returned', fallbackProfessionals.length, 'professionals (sorted in memory)');
                console.warn('💡 Create Firestore indexes for better performance. Check Firebase Console.');
                
                return { professionals: fallbackProfessionals, lastDocId };
            } catch (fallbackError: any) {
                console.error('❌ Firestore: Fallback query also failed:', fallbackError);
                throw fallbackError;
            }
        }
        
        console.error('❌ Firestore: Error fetching professionals:', error);
        if (error.message?.includes('index') || error.code === 'failed-precondition') {
            console.error('💡 Firestore index required. Check Firebase Console for index creation link.');
            console.error('💡 Tip: The app will work without indexes by sorting in memory, but creating indexes improves performance.');
        }
        throw error;
    }
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
