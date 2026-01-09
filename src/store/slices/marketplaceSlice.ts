import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { MarketplaceItem, MarketplaceFormData, MarketplaceFilters } from '@/types/firestore';
import * as marketplaceService from '@/services/firestore/marketplace';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

interface MarketplaceState {
    items: MarketplaceItem[];
    userItems: MarketplaceItem[];
    selectedItem: MarketplaceItem | null;
    isLoading: boolean;
    isUserItemsLoading: boolean;
    error: string | null;
    filters: MarketplaceFilters;
    hasMore: boolean;
    lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null;
}

const initialState: MarketplaceState = {
    items: [],
    userItems: [],
    selectedItem: null,
    isLoading: false,
    isUserItemsLoading: false,
    error: null,
    filters: {},
    hasMore: true,
    lastDoc: null,
};

export const fetchMarketplaceItems = createAsyncThunk(
    'marketplace/fetchItems',
    async ({ filters, limit = 20 }: { filters?: MarketplaceFilters; limit?: number }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { marketplace: MarketplaceState };
            const { items, lastDoc } = await marketplaceService.getMarketplaceItems(
                filters || state.marketplace.filters,
                limit,
                state.marketplace.lastDoc || undefined
            );
            return { items, lastDoc, isLoadMore: !!state.marketplace.lastDoc };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserMarketplaceItems = createAsyncThunk(
    'marketplace/fetchUserItems',
    async (userId: string, { rejectWithValue }) => {
        try {
            const items = await marketplaceService.getMarketplaceItemsBySeller(userId);
            return items;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMarketplaceItemById = createAsyncThunk(
    'marketplace/fetchItemById',
    async (itemId: string, { rejectWithValue }) => {
        try {
            const item = await marketplaceService.getMarketplaceItem(itemId);
            if (!item) {
                throw new Error('Item not found');
            }
            return item;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createMarketplaceItem = createAsyncThunk(
    'marketplace/createItem',
    async (
        { data, userId, images }: { data: MarketplaceFormData; userId: string; images: string[] },
        { rejectWithValue }
    ) => {
        try {
            const itemId = await marketplaceService.createMarketplaceItem(data, userId, images);
            return itemId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateMarketplaceItem = createAsyncThunk(
    'marketplace/updateItem',
    async (
        { itemId, data, images }: { itemId: string; data: Partial<MarketplaceFormData>; images?: string[] },
        { rejectWithValue }
    ) => {
        try {
            await marketplaceService.updateMarketplaceItem(itemId, data, images);
            return { itemId, data, images };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteMarketplaceItem = createAsyncThunk(
    'marketplace/deleteItem',
    async (itemId: string, { rejectWithValue }) => {
        try {
            await marketplaceService.deleteMarketplaceItem(itemId);
            return itemId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const markItemAsSold = createAsyncThunk(
    'marketplace/markAsSold',
    async (itemId: string, { rejectWithValue }) => {
        try {
            await marketplaceService.markAsSold(itemId);
            return itemId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const marketplaceSlice = createSlice({
    name: 'marketplace',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<MarketplaceFilters>) => {
            state.filters = action.payload;
            state.lastDoc = null;
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
        resetItems: state => {
            state.items = [];
            state.lastDoc = null;
            state.hasMore = true;
        },
        setSelectedItem: (state, action: PayloadAction<MarketplaceItem | null>) => {
            state.selectedItem = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchMarketplaceItems.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMarketplaceItems.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.isLoadMore) {
                    state.items = [...state.items, ...action.payload.items];
                } else {
                    state.items = action.payload.items;
                }
                state.lastDoc = action.payload.lastDoc;
                state.hasMore = action.payload.items.length > 0;
            })
            .addCase(fetchMarketplaceItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchUserMarketplaceItems.pending, state => {
                state.isUserItemsLoading = true;
            })
            .addCase(fetchUserMarketplaceItems.fulfilled, (state, action) => {
                state.isUserItemsLoading = false;
                state.userItems = action.payload;
            })
            .addCase(fetchUserMarketplaceItems.rejected, (state, action) => {
                state.isUserItemsLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchMarketplaceItemById.pending, state => {
                state.isLoading = true;
            })
            .addCase(fetchMarketplaceItemById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedItem = action.payload;
            })
            .addCase(fetchMarketplaceItemById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(createMarketplaceItem.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createMarketplaceItem.fulfilled, state => {
                state.isLoading = false;
            })
            .addCase(createMarketplaceItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(updateMarketplaceItem.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateMarketplaceItem.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.userItems.findIndex(i => i.id === action.payload.itemId);
                if (index !== -1) {
                    state.userItems[index] = {
                        ...state.userItems[index],
                        ...action.payload.data,
                        ...(action.payload.images && { images: action.payload.images }),
                    };
                }
            })
            .addCase(updateMarketplaceItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(deleteMarketplaceItem.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteMarketplaceItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userItems = state.userItems.filter(i => i.id !== action.payload);
            })
            .addCase(deleteMarketplaceItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(markItemAsSold.pending, state => {
                state.isLoading = true;
            })
            .addCase(markItemAsSold.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.userItems.findIndex(i => i.id === action.payload);
                if (index !== -1) {
                    state.userItems[index].status = 'sold';
                }
            })
            .addCase(markItemAsSold.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, clearFilters, clearError, resetItems, setSelectedItem } =
    marketplaceSlice.actions;

export default marketplaceSlice.reducer;
