import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { ProfessionalProfile, ProfessionalFormData } from '@/types/firestore';
import * as professionalsService from '@/services/firestore/professionals';

interface ProfessionalsFilters {
    industry?: string;
    location?: string;
    verified?: boolean;
    search?: string;
}

interface ProfessionalsState {
    professionals: ProfessionalProfile[];
    userProfessional: ProfessionalProfile | null;
    userProfessionals: ProfessionalProfile[]; // All professional profiles for the current user
    selectedProfessional: ProfessionalProfile | null;
    isLoading: boolean;
    isUserProfessionalLoading: boolean;
    isUserProfessionalsLoading: boolean;
    error: string | null;
    filters: ProfessionalsFilters;
    hasMore: boolean;
    lastDocId: string | null; // Store only document ID instead of DocumentSnapshot for serialization
}

const initialState: ProfessionalsState = {
    professionals: [],
    userProfessional: null,
    userProfessionals: [],
    selectedProfessional: null,
    isLoading: false,
    isUserProfessionalLoading: false,
    isUserProfessionalsLoading: false,
    error: null,
    filters: {},
    hasMore: true,
    lastDocId: null,
};

export const fetchProfessionals = createAsyncThunk(
    'professionals/fetchProfessionals',
    async ({ filters, limit = 20 }: { filters?: ProfessionalsFilters; limit?: number }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { professionals: ProfessionalsState };
            const { professionals, lastDocId } = await professionalsService.getProfessionals(
                filters || state.professionals.filters,
                limit,
                state.professionals.lastDocId || undefined
            );
            return { professionals, lastDocId, isLoadMore: !!state.professionals.lastDocId };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserProfessional = createAsyncThunk(
    'professionals/fetchUserProfessional',
    async (userId: string, { rejectWithValue }) => {
        try {
            const professional = await professionalsService.getProfessionalByUserId(userId);
            return professional;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserProfessionals = createAsyncThunk(
    'professionals/fetchUserProfessionals',
    async (userId: string, { rejectWithValue }) => {
        try {
            const professionals = await professionalsService.getProfessionalsByUserId(userId);
            return professionals;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchProfessionalById = createAsyncThunk(
    'professionals/fetchProfessionalById',
    async (professionalId: string, { rejectWithValue }) => {
        try {
            const professional = await professionalsService.getProfessional(professionalId);
            if (!professional) {
                throw new Error('Professional not found');
            }
            return professional;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createProfessional = createAsyncThunk(
    'professionals/createProfessional',
    async (
        { data, userId, profilePhoto }: { data: ProfessionalFormData; userId: string; profilePhoto?: string },
        { rejectWithValue }
    ) => {
        try {
            const professionalId = await professionalsService.createProfessional(data, userId, profilePhoto);
            return professionalId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateProfessional = createAsyncThunk(
    'professionals/updateProfessional',
    async (
        { professionalId, data, profilePhoto }: { professionalId: string; data: Partial<ProfessionalFormData>; profilePhoto?: string },
        { rejectWithValue }
    ) => {
        try {
            await professionalsService.updateProfessional(professionalId, data, profilePhoto);
            return { professionalId, data, profilePhoto };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const professionalsSlice = createSlice({
    name: 'professionals',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<ProfessionalsFilters>) => {
            state.filters = action.payload;
            state.lastDocId = null;
            state.hasMore = true;
        },
        clearFilters: state => {
            state.filters = {};
            state.lastDocId = null;
            state.hasMore = true;
        },
        clearError: state => {
            state.error = null;
        },
        resetProfessionals: state => {
            state.professionals = [];
            state.lastDocId = null;
            state.hasMore = true;
        },
        setSelectedProfessional: (state, action: PayloadAction<ProfessionalProfile | null>) => {
            state.selectedProfessional = action.payload;
        },
    },
    extraReducers: builder => {
        // Fetch professionals
        builder
            .addCase(fetchProfessionals.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProfessionals.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.isLoadMore) {
                    state.professionals = [...state.professionals, ...action.payload.professionals];
                } else {
                    state.professionals = action.payload.professionals;
                }
                state.lastDocId = action.payload.lastDocId;
                state.hasMore = action.payload.professionals.length > 0;
            })
            .addCase(fetchProfessionals.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch user professional
        builder
            .addCase(fetchUserProfessional.pending, state => {
                state.isUserProfessionalLoading = true;
            })
            .addCase(fetchUserProfessional.fulfilled, (state, action) => {
                state.isUserProfessionalLoading = false;
                state.userProfessional = action.payload;
            })
            .addCase(fetchUserProfessional.rejected, (state, action) => {
                state.isUserProfessionalLoading = false;
                state.error = action.payload as string;
            });

        // Fetch user professionals (all profiles)
        builder
            .addCase(fetchUserProfessionals.pending, state => {
                state.isUserProfessionalsLoading = true;
            })
            .addCase(fetchUserProfessionals.fulfilled, (state, action) => {
                state.isUserProfessionalsLoading = false;
                state.userProfessionals = action.payload;
            })
            .addCase(fetchUserProfessionals.rejected, (state, action) => {
                state.isUserProfessionalsLoading = false;
                state.error = action.payload as string;
            });

        // Fetch professional by ID
        builder
            .addCase(fetchProfessionalById.pending, state => {
                state.isLoading = true;
            })
            .addCase(fetchProfessionalById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedProfessional = action.payload;
            })
            .addCase(fetchProfessionalById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Create professional
        builder
            .addCase(createProfessional.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createProfessional.fulfilled, state => {
                state.isLoading = false;
            })
            .addCase(createProfessional.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update professional
        builder
            .addCase(updateProfessional.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateProfessional.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.userProfessional?.id === action.payload.professionalId) {
                    state.userProfessional = {
                        ...state.userProfessional,
                        ...action.payload.data,
                        ...(action.payload.profilePhoto && { profilePhoto: action.payload.profilePhoto }),
                    };
                }
            })
            .addCase(updateProfessional.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, clearFilters, clearError, resetProfessionals, setSelectedProfessional } = professionalsSlice.actions;

export default professionalsSlice.reducer;
