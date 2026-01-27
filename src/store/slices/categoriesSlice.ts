import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCategories } from '@/services/firestore/categories';
import type { Category } from '@/types/firestore';

interface CategoriesState {
    businessCategories: Category[];
    serviceCategories: Category[];
    marketplaceCategories: Category[];
    isLoading: boolean;
    error: string | null;
    lastFetched: number | null;
}

const initialState: CategoriesState = {
    businessCategories: [],
    serviceCategories: [],
    marketplaceCategories: [],
    isLoading: false,
    error: null,
    lastFetched: null,
};

export const fetchAllCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const [business, service, marketplace] = await Promise.all([
                getCategories('business'),
                getCategories('service'),
                getCategories('marketplace'),
            ]);
            return { business, service, marketplace };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch categories');
        }
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        resetCategories: (state) => {
            state.businessCategories = [];
            state.serviceCategories = [];
            state.marketplaceCategories = [];
            state.error = null;
            state.lastFetched = null;
        },
        setCategories: (state, action: PayloadAction<{ type: 'business' | 'service' | 'marketplace', categories: Category[] }>) => {
            const { type, categories } = action.payload;
            if (type === 'business') state.businessCategories = categories;
            else if (type === 'service') state.serviceCategories = categories;
            else if (type === 'marketplace') state.marketplaceCategories = categories;
            state.lastFetched = Date.now();
            state.isLoading = false;
        },
        setCategoriesLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setCategoriesError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.businessCategories = action.payload.business;
                state.serviceCategories = action.payload.service;
                state.marketplaceCategories = action.payload.marketplace;
                state.lastFetched = Date.now();
            })
            .addCase(fetchAllCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetCategories, setCategories, setCategoriesLoading, setCategoriesError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
