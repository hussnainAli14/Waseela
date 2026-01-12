import { firebaseFirestore } from '@/config/firebase';
import type { Product, ProductFormData, ListingStatus } from '@/types/firestore';

const COLLECTION = 'products';

/**
 * Create a new product listing
 */
export const createProduct = async (
    data: ProductFormData,
    sellerId: string,
    images: string[] = []
): Promise<string> => {
    // Build product data object, only including defined values
    const productData: any = {
        title: data.title,
        description: data.description,
        category: data.category,
        condition: data.condition,
        price: data.price,
        location: data.location,
        city: data.city,
        sellerId,
        images: images.length > 0 ? images : [],
        verified: false,
        status: 'pending' as ListingStatus,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const docRef = await firebaseFirestore.collection(COLLECTION).add(productData);
    return docRef.id;
};

/**
 * Get a single product by ID
 */
export const getProduct = async (productId: string): Promise<Product | null> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(productId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data(),
    } as Product;
};

/**
 * Get products with filters and pagination
 */
export const getProducts = async (
    filters: any = {},
    limit: number = 20,
    startAfterDocId?: string
): Promise<{ products: Product[]; lastDocId: string | null }> => {
    console.log('🔥 Firestore: getProducts called with filters:', filters);
    let query: any = firebaseFirestore.collection(COLLECTION);

    // Apply filters
    if (filters.category) {
        query = query.where('category', '==', filters.category);
    }

    if (filters.city) {
        query = query.where('city', '==', filters.city);
    }

    if (filters.condition) {
        query = query.where('condition', '==', filters.condition);
    }

    if (filters.verified !== undefined) {
        query = query.where('verified', '==', filters.verified);
    }

    if (filters.status !== undefined) {
        query = query.where('status', '==', filters.status);
    }

    // Determine if we need to order by createdAt (requires index with filters)
    // When filtering by category, city, condition, verified, or status, we need a composite index
    // If index doesn't exist, we'll skip orderBy and sort in memory instead
    const hasFiltersRequiringIndex = !!(
        filters.category ||
        filters.city ||
        filters.condition ||
        filters.verified !== undefined ||
        filters.status !== undefined
    );

    // Only use orderBy if we don't have filters that require an index
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
            if (lastDoc.exists && lastDoc.data()) {
                query = query.startAfter(lastDoc);
            }
        } catch (error) {
            console.warn('⚠️ Firestore: Could not fetch lastDoc for pagination:', error);
        }
    }

    try {
        const snapshot = await query.get();
        console.log('✅ Firestore: Query returned', snapshot.docs.length, 'products');

        let products: Product[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Product[];

        // If we couldn't use orderBy due to filters requiring index, sort in memory
        if (hasFiltersRequiringIndex) {
            products = products.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA; // Descending order (newest first)
            });
            // Limit to requested amount after sorting
            products = products.slice(0, limit);
        }

        const lastDocId = products.length > 0 ? products[products.length - 1].id : null;

        console.log(`✅ Firestore: Retrieved ${products.length} products`);
        return { products, lastDocId };
    } catch (error: any) {
        console.error('❌ Firestore: Error fetching products:', error);
        throw error;
    }
};

/**
 * Get products by seller ID
 */
export const getProductsBySeller = async (sellerId: string): Promise<Product[]> => {
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('sellerId', '==', sellerId)
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Product[];
};

/**
 * Update a product
 */
export const updateProduct = async (
    productId: string,
    data: Partial<ProductFormData>,
    images?: string[]
): Promise<void> => {
    const updateData: any = {
        ...data,
        updatedAt: new Date().toISOString(),
    };

    if (images) {
        updateData.images = images;
    }

    await firebaseFirestore.collection(COLLECTION).doc(productId).update(updateData);
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId: string): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(productId).delete();
};
