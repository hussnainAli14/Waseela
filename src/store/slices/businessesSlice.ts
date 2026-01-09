import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Business, BusinessFormData, ListingFilters } from '@/types/firestore';
import * as businessesService from '@/services/firestore/businesses';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

interface BusinessesState {
    businesses: Business[];
    featuredBusinesses: Business[];
    userBusinesses: Business[];
    selectedBusiness: Business | null;
    isLoading: boolean;
    isFeaturedLoading: boolean;
    isUserBusinessesLoading: boolean;
    error: string | null;
    filters: ListingFilters;
    hasMore: boolean;
    lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null;
}

const initialState: BusinessesState = {
    businesses: [],
    featuredBusinesses: [],
    userBusinesses: [],
    selectedBusiness: null,
    isLoading: false,
    isFeaturedLoading: false,
    isUserBusinessesLoading: false,
    error: null,
    filters: {},
    hasMore: true,
    lastDoc: null,
};

// Async thunks
export const fetchBusinesses = createAsyncThunk(
    'businesses/fetchBusinesses',
    async ({ filters, limit = 20 }: { filters?: ListingFilters; limit?: number }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { businesses: BusinessesState };
            const { businesses, lastDoc } = await businessesService.getBusinesses(
                filters || state.businesses.filters,
                limit,
                state.businesses.lastDoc || undefined
            );
            return { businesses, lastDoc, isLoadMore: !!state.businesses.lastDoc };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchFeaturedBusinesses = createAsyncThunk(
    'businesses/fetchFeaturedBusinesses',
    async (limit: number = 10, { rejectWithValue }) => {
        try {
            const businesses = await businessesService.getFeaturedBusinesses(limit);
            return businesses;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserBusinesses = createAsyncThunk(
    'businesses/fetchUserBusinesses',
    async (userId: string, { rejectWithValue }) => {
        try {
            const businesses = await businessesService.getBusinessesByOwner(userId);
            return businesses;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchBusinessById = createAsyncThunk(
    'businesses/fetchBusinessById',
    async (businessId: string, { rejectWithValue }) => {
        try {
            const business = await businessesService.getBusiness(businessId);
            if (!business) {
                throw new Error('Business not found');
            }
            return business;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createBusiness = createAsyncThunk(
    'businesses/createBusiness',
    async (
        { data, userId, images }: { data: BusinessFormData; userId: string; images: string[] },
        { rejectWithValue }
    ) => {
        try {
            const businessId = await businessesService.createBusiness(data, userId, images);
            return businessId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateBusiness = createAsyncThunk(
    'businesses/updateBusiness',
    async (
        { businessId, data, images }: { businessId: string; data: Partial<BusinessFormData>; images?: string[] },
        { rejectWithValue }
    ) => {
        try {
            await businessesService.updateBusiness(businessId, data, images);
            return { businessId, data, images };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteBusiness = createAsyncThunk(
    'businesses/deleteBusiness',
    async (businessId: string, { rejectWithValue }) => {
        try {
            await businessesService.deleteBusiness(businessId);
            return businessId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const searchBusinesses = createAsyncThunk(
    'businesses/searchBusinesses',
    async (searchTerm: string, { rejectWithValue }) => {
        try {
            const businesses = await businessesService.searchBusinesses(searchTerm);
            return businesses;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const businessesSlice = createSlice({
    name: 'businesses',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<ListingFilters>) => {
            state.filters = action.payload;
            state.lastDoc = null; // Reset pagination when filters change
            state.hasMore = true;
        },
        clearFilters: state => {
            state.filters = {};
            state.lastDoc = null;
            state.hasMore = true;
        },
        clearError: state => {
            state.error = null;
        },
        resetBusinesses: state => {
            state.businesses = [];
            state.lastDoc = null;
            state.hasMore = true;
        },
        setSelectedBusiness: (state, action: PayloadAction<Business | null>) => {
            state.selectedBusiness = action.payload;
        },
    },
    extraReducers: builder => {
        // Fetch businesses
        builder
            .addCase(fetchBusinesses.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBusinesses.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.isLoadMore) {
                    state.businesses = [...state.businesses, ...action.payload.businesses];
                } else {
                    state.businesses = action.payload.businesses;
                }
                state.lastDoc = action.payload.lastDoc;
                state.hasMore = action.payload.businesses.length > 0;
            })
            .addCase(fetchBusinesses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch featured businesses
        builder
            .addCase(fetchFeaturedBusinesses.pending, state => {
                state.isFeaturedLoading = true;
            })
            .addCase(fetchFeaturedBusinesses.fulfilled, (state, action) => {
                state.isFeaturedLoading = false;
                state.featuredBusinesses = action.payload;
            })
            .addCase(fetchFeaturedBusinesses.rejected, (state, action) => {
                state.isFeaturedLoading = false;
                state.error = action.payload as string;
            });

        // Fetch user businesses
        builder
            .addCase(fetchUserBusinesses.pending, state => {
                state.isUserBusinessesLoading = true;
            })
            .addCase(fetchUserBusinesses.fulfilled, (state, action) => {
                state.isUserBusinessesLoading = false;
                state.userBusinesses = action.payload;
            })
            .addCase(fetchUserBusinesses.rejected, (state, action) => {
                state.isUserBusinessesLoading = false;
                state.error = action.payload as string;
            });

        // Fetch business by ID
        builder
            .addCase(fetchBusinessById.pending, state => {
                state.isLoading = true;
            })
            .addCase(fetchBusinessById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedBusiness = action.payload;
            })
            .addCase(fetchBusinessById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Create business
        builder
            .addCase(createBusiness.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createBusiness.fulfilled, state => {
                state.isLoading = false;
            })
            .addCase(createBusiness.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update business
        builder
            .addCase(updateBusiness.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateBusiness.fulfilled, (state, action) => {
                state.isLoading = false;
                // Update in user businesses list
                const index = state.userBusinesses.findIndex(b => b.id === action.payload.businessId);
                if (index !== -1) {
                    state.userBusinesses[index] = {
                        ...state.userBusinesses[index],
                        ...action.payload.data,
                        ...(action.payload.images && { images: action.payload.images }),
                    };
                }
            })
            .addCase(updateBusiness.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Delete business
        builder
            .addCase(deleteBusiness.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteBusiness.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userBusinesses = state.userBusinesses.filter(b => b.id !== action.payload);
            })
            .addCase(deleteBusiness.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Search businesses
        builder
            .addCase(searchBusinesses.pending, state => {
                state.isLoading = true;
            })
            .addCase(searchBusinesses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.businesses = action.payload;
            })
            .addCase(searchBusinesses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, clearFilters, clearError, resetBusinesses, setSelectedBusiness } =
    businessesSlice.actions;

export default businessesSlice.reducer;
