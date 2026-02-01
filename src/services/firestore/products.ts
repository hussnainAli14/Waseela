import { firebaseFirestore } from '@/config/firebase';
import type { Product, ProductFormData, ListingStatus } from '@/types/firestore';
import { toMilliseconds } from '@/utils/dateUtils';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const COLLECTION = 'products';

/**
 * Convert Firestore timestamp objects to ISO strings for Redux serialization
 */
const serializeProduct = (data: any): Product => {
    const product = { ...data };

    // Convert Firestore timestamps to ISO strings/numbers
    if (product.createdAt) {
        product.createdAt = toMilliseconds(product.createdAt);
    }
    if (product.updatedAt) {
        product.updatedAt = toMilliseconds(product.updatedAt);
    }
    if (product.approvedAt) {
        product.approvedAt = toMilliseconds(product.approvedAt);
    }
    if (product.rejectedAt) {
        product.rejectedAt = toMilliseconds(product.rejectedAt);
    }

    return product as Product;
};

/**
 * Create a new product listing
 */
import { uploadListingImages } from '@/services/storage/imageUpload';

/**
 * Create a new product listing
 * Optimizes image upload by running in parallel and ensures listing ID is available for storage path
 */
export const createProduct = async (
    data: ProductFormData,
    sellerId: string,
    seller: { name: string; photo?: string },
    imageUris: string[] = []
): Promise<string> => {
    try {
        // 1. Generate ID first
        const docRef = firebaseFirestore.collection(COLLECTION).doc();
        const productId = docRef.id;

        // 2. Upload images in parallel (if any)
        let imageUrls: string[] = [];
        if (imageUris.length > 0) {
            imageUrls = await uploadListingImages(
                imageUris,
                sellerId,
                productId,
                'product'
            );
        }

        // 3. Build product data object
        const productData: Product = {
            id: productId,
            title: data.title,
            description: data.description,
            category: data.category,
            condition: data.condition,
            price: data.price,
            location: data.location,
            city: data.city,
            phone: data.phone,
            whatsapp: data.whatsapp,
            email: data.email,
            sellerId,
            sellerName: seller.name,
            sellerPhoto: seller.photo,
            images: imageUrls,
            verified: false,
            status: 'pending' as ListingStatus,
            views: 0,
            createdAt: toMilliseconds(new Date().toISOString()),
            updatedAt: toMilliseconds(new Date().toISOString()),
        } as Product;

        await docRef.set(productData);
        return productId;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};


/**
 * Get a single product by ID
 */
export const getProduct = async (productId: string): Promise<Product | null> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(productId).get();

    if (!doc.exists) {
        return null;
    }

    return serializeProduct({
        id: doc.id,
        ...doc.data(),
    });
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
            if (lastDoc.exists() && lastDoc.data()) {
                query = query.startAfter(lastDoc);
            }
        } catch (error) {
            console.warn('⚠️ Firestore: Could not fetch lastDoc for pagination:', error);
        }
    }

    try {
        const snapshot = await query.get();
        console.log('✅ Firestore: Query returned', snapshot.docs.length, 'products');

        let products: Product[] = snapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
            serializeProduct({
                id: doc.id,
                ...doc.data(),
            })
        );

        // If we couldn't use orderBy due to filters requiring index, sort in memory
        if (hasFiltersRequiringIndex) {
            products = products.sort((a, b) => {
                const dateA = toMilliseconds(a.createdAt);
                const dateB = toMilliseconds(b.createdAt);
                return dateB - dateA;
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
    try {
        // Try with orderBy first
        try {
            const query = firebaseFirestore
                .collection(COLLECTION)
                .where('sellerId', '==', sellerId)
                .orderBy('createdAt', 'desc');

            const snapshot = await query.get();
            const products = snapshot.docs.map(doc =>
                serializeProduct({
                    id: doc.id,
                    ...doc.data(),
                })
            );

            // Already sorted by Firestore, but ensure consistency
            return products.sort((a, b) => {
                const dateA = toMilliseconds(a.createdAt);
                const dateB = toMilliseconds(b.createdAt);
                return dateB - dateA;
            });
        } catch (error: any) {
            // If orderBy fails (index missing), fetch without orderBy and sort in memory
            if (error.code === 'failed-precondition' || error.message?.includes('index')) {
                console.warn('⚠️ Firestore: Index missing for getProductsBySeller, fetching without orderBy');
                const snapshot = await firebaseFirestore
                    .collection(COLLECTION)
                    .where('sellerId', '==', sellerId)
                    .get();

                const products = snapshot.docs.map(doc =>
                    serializeProduct({
                        id: doc.id,
                        ...doc.data(),
                    })
                );

                return products.sort((a, b) => {
                    const dateA = toMilliseconds(a.createdAt);
                    const dateB = toMilliseconds(b.createdAt);
                    return dateB - dateA;
                });
            }
            throw error;
        }
    } catch (error: any) {
        console.error('❌ Firestore: Error fetching products by seller:', error);
        throw error;
    }
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

/**
 * Mark a product as sold
 */
export const markAsSold = async (productId: string): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(productId).update({
        status: 'sold' as ListingStatus,
        updatedAt: new Date().toISOString(),
    });
};

/**
 * Get related products by category
 */
export const getRelatedProducts = async (
    category: string,
    currentId: string,
    limit: number = 3
): Promise<Product[]> => {
    try {
        const snapshot = await firebaseFirestore
            .collection(COLLECTION)
            .where('category', '==', category)
            .where('status', '==', 'approved')
            .limit(limit + 2)
            .get();

        const products = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Product[];

        return products
            .filter(p => p.id !== currentId)
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching related products:', error);
        return [];
    }
};
