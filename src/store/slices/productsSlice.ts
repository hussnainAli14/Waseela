import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductFormData } from '@/types/firestore';
import * as productsService from '@/services/firestore/products';

interface ProductsState {
    products: Product[];
    userProducts: Product[];
    selectedProduct: Product | null;
    isLoading: boolean;
    isUserProductsLoading: boolean;
    error: string | null;
    hasMore: boolean;
    lastDocId: string | null;
}

const initialState: ProductsState = {
    products: [],
    userProducts: [],
    selectedProduct: null,
    isLoading: false,
    isUserProductsLoading: false,
    error: null,
    hasMore: true,
    lastDocId: null,
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ filters, limit = 20 }: { filters?: any; limit?: number }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { products: ProductsState };
            const { products, lastDocId } = await productsService.getProducts(
                filters || {},
                limit,
                state.products.lastDocId || undefined
            );
            return { products, lastDocId, isLoadMore: !!state.products.lastDocId };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserProducts = createAsyncThunk(
    'products/fetchUserProducts',
    async (sellerId: string, { rejectWithValue }) => {
        try {
            const products = await productsService.getProductsBySeller(sellerId);
            return products;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (productId: string, { rejectWithValue }) => {
        try {
            const product = await productsService.getProduct(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (
        { data, sellerId, images }: { data: ProductFormData; sellerId: string; images: string[] },
        { rejectWithValue }
    ) => {
        try {
            const productId = await productsService.createProduct(data, sellerId, images);
            return productId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async (
        { productId, data, images }: { productId: string; data: Partial<ProductFormData>; images?: string[] },
        { rejectWithValue }
    ) => {
        try {
            await productsService.updateProduct(productId, data, images);
            return { productId, data, images };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (productId: string, { rejectWithValue }) => {
        try {
            await productsService.deleteProduct(productId);
            return productId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearError: state => {
            state.error = null;
        },
        resetProducts: state => {
            state.products = [];
            state.lastDocId = null;
            state.hasMore = true;
        },
        setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
            state.selectedProduct = action.payload;
        },
    },
    extraReducers: builder => {
        // Fetch products
        builder
            .addCase(fetchProducts.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.isLoadMore) {
                    state.products = [...state.products, ...action.payload.products];
                } else {
                    state.products = action.payload.products;
                }
                state.lastDocId = action.payload.lastDocId;
                state.hasMore = action.payload.products.length === action.meta.arg.limit;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch user products
        builder
            .addCase(fetchUserProducts.pending, state => {
                state.isUserProductsLoading = true;
            })
            .addCase(fetchUserProducts.fulfilled, (state, action) => {
                state.isUserProductsLoading = false;
                state.userProducts = action.payload;
            })
            .addCase(fetchUserProducts.rejected, (state, action) => {
                state.isUserProductsLoading = false;
                state.error = action.payload as string;
            });

        // Fetch product by ID
        builder
            .addCase(fetchProductById.pending, state => {
                state.isLoading = true;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Create product
        builder
            .addCase(createProduct.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, state => {
                state.isLoading = false;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update product
        builder
            .addCase(updateProduct.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.userProducts.findIndex(p => p.id === action.payload.productId);
                if (index !== -1) {
                    state.userProducts[index] = {
                        ...state.userProducts[index],
                        ...action.payload.data,
                        ...(action.payload.images && { images: action.payload.images }),
                    };
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Delete product
        builder
            .addCase(deleteProduct.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userProducts = state.userProducts.filter(p => p.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, resetProducts, setSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
