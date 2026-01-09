import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { SavedListing } from '@/types/firestore';
import * as savedListingsService from '@/services/firestore/savedListings';

interface SavedListingsState {
    items: SavedListing[];
    isLoading: boolean;
    error: string | null;
    savedItemIds: string[]; // Array instead of Set for Redux serialization
}

const initialState: SavedListingsState = {
    items: [],
    isLoading: false,
    error: null,
    savedItemIds: [],
};

export const fetchSavedListings = createAsyncThunk(
    'savedListings/fetch',
    async (userId: string, { rejectWithValue }) => {
        try {
            const items = await savedListingsService.getSavedItems(userId);
            return items;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const saveItem = createAsyncThunk(
    'savedListings/save',
    async (
        { userId, itemType, itemId }: { userId: string; itemType: 'business' | 'service' | 'marketplace' | 'room'; itemId: string },
        { rejectWithValue }
    ) => {
        try {
            await savedListingsService.saveItem(userId, itemType, itemId);
            return { itemType, itemId };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const unsaveItem = createAsyncThunk(
    'savedListings/unsave',
    async ({ userId, itemId }: { userId: string; itemId: string }, { rejectWithValue }) => {
        try {
            await savedListingsService.unsaveItem(userId, itemId);
            return itemId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkIfSaved = createAsyncThunk(
    'savedListings/checkIfSaved',
    async ({ userId, itemId }: { userId: string; itemId: string }, { rejectWithValue }) => {
        try {
            const isSaved = await savedListingsService.isItemSaved(userId, itemId);
            return { itemId, isSaved };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const savedListingsSlice = createSlice({
    name: 'savedListings',
    initialState,
    reducers: {
        clearError: state => {
            state.error = null;
        },
        resetSavedListings: state => {
            state.items = [];
            state.savedItemIds = [];
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSavedListings.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSavedListings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
                state.savedItemIds = action.payload.map(item => item.itemId);
            })
            .addCase(fetchSavedListings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(saveItem.pending, state => {
                state.isLoading = true;
            })
            .addCase(saveItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.push({
                    itemType: action.payload.itemType,
                    itemId: action.payload.itemId,
                    savedAt: new Date().toISOString(),
                });
                if (!state.savedItemIds.includes(action.payload.itemId)) {
                    state.savedItemIds.push(action.payload.itemId);
                }
            })
            .addCase(saveItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(unsaveItem.pending, state => {
                state.isLoading = true;
            })
            .addCase(unsaveItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(item => item.itemId !== action.payload);
                state.savedItemIds = state.savedItemIds.filter(id => id !== action.payload);
            })
            .addCase(unsaveItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(checkIfSaved.fulfilled, (state, action) => {
                if (action.payload.isSaved) {
                    if (!state.savedItemIds.includes(action.payload.itemId)) {
                        state.savedItemIds.push(action.payload.itemId);
                    }
                } else {
                    state.savedItemIds = state.savedItemIds.filter(id => id !== action.payload.itemId);
                }
            });
    },
});

export const { clearError, resetSavedListings } = savedListingsSlice.actions;

export default savedListingsSlice.reducer;
