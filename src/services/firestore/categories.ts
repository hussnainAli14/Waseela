import { firebaseFirestore } from '@/config/firebase';
import type { Category } from '@/types/firestore';

const COLLECTION = 'categories';

export const getCategories = async (
    type?: 'business' | 'service' | 'marketplace'
): Promise<Category[]> => {
    let query = firebaseFirestore.collection(COLLECTION).where('active', '==', true);

    if (type) {
        query = query.where('type', '==', type);
    }

    const snapshot = await query.orderBy('order', 'asc').get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Category[];
};

export const getCategory = async (categoryId: string): Promise<Category | null> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(categoryId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data(),
    } as Category;
};

export const createCategory = async (
    type: 'business' | 'service' | 'marketplace',
    name: string,
    icon: string,
    order: number
): Promise<string> => {
    const categoryData: Omit<Category, 'id'> = {
        type,
        name,
        icon,
        order,
        active: true,
    };

    const docRef = await firebaseFirestore.collection(COLLECTION).add(categoryData);
    return docRef.id;
};

export const updateCategory = async (
    categoryId: string,
    data: Partial<Omit<Category, 'id'>>
): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(categoryId).update(data);
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(categoryId).delete();
};

export const toggleCategoryActive = async (
    categoryId: string,
    active: boolean
): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(categoryId).update({ active });
};
