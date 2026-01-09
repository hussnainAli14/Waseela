import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Service, ServiceFormData, ListingFilters } from '@/types/firestore';
import * as servicesService from '@/services/firestore/services';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

interface ServicesState {
    services: Service[];
    featuredServices: Service[];
    userServices: Service[];
    selectedService: Service | null;
    isLoading: boolean;
    isFeaturedLoading: boolean;
    isUserServicesLoading: boolean;
    error: string | null;
    filters: ListingFilters & { serviceType?: string };
    hasMore: boolean;
    lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null;
}

const initialState: ServicesState = {
    services: [],
    featuredServices: [],
    userServices: [],
    selectedService: null,
    isLoading: false,
    isFeaturedLoading: false,
    isUserServicesLoading: false,
    error: null,
    filters: {},
    hasMore: true,
    lastDoc: null,
};

export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async ({ filters, limit = 20 }: { filters?: ListingFilters & { serviceType?: string }; limit?: number }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { services: ServicesState };
            const { services, lastDoc } = await servicesService.getServices(
                filters || state.services.filters,
                limit,
                state.services.lastDoc || undefined
            );
            return { services, lastDoc, isLoadMore: !!state.services.lastDoc };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchFeaturedServices = createAsyncThunk(
    'services/fetchFeaturedServices',
    async (limit: number = 10, { rejectWithValue }) => {
        try {
            const services = await servicesService.getFeaturedServices(limit);
            return services;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserServices = createAsyncThunk(
    'services/fetchUserServices',
    async (userId: string, { rejectWithValue }) => {
        try {
            const services = await servicesService.getServicesByProvider(userId);
            return services;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchServiceById = createAsyncThunk(
    'services/fetchServiceById',
    async (serviceId: string, { rejectWithValue }) => {
        try {
            const service = await servicesService.getService(serviceId);
            if (!service) {
                throw new Error('Service not found');
            }
            return service;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createService = createAsyncThunk(
    'services/createService',
    async (
        { data, userId, images }: { data: ServiceFormData; userId: string; images: string[] },
        { rejectWithValue }
    ) => {
        try {
            const serviceId = await servicesService.createService(data, userId, images);
            return serviceId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateService = createAsyncThunk(
    'services/updateService',
    async (
        { serviceId, data, images }: { serviceId: string; data: Partial<ServiceFormData>; images?: string[] },
        { rejectWithValue }
    ) => {
        try {
            await servicesService.updateService(serviceId, data, images);
            return { serviceId, data, images };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteService = createAsyncThunk(
    'services/deleteService',
    async (serviceId: string, { rejectWithValue }) => {
        try {
            await servicesService.deleteService(serviceId);
            return serviceId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const searchServices = createAsyncThunk(
    'services/searchServices',
    async (searchTerm: string, { rejectWithValue }) => {
        try {
            const services = await servicesService.searchServices(searchTerm);
            return services;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<ListingFilters & { serviceType?: string }>) => {
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
        resetServices: state => {
            state.services = [];
            state.lastDoc = null;
            state.hasMore = true;
        },
        setSelectedService: (state, action: PayloadAction<Service | null>) => {
            state.selectedService = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchServices.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.isLoadMore) {
                    state.services = [...state.services, ...action.payload.services];
                } else {
                    state.services = action.payload.services;
                }
                state.lastDoc = action.payload.lastDoc;
                state.hasMore = action.payload.services.length > 0;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchFeaturedServices.pending, state => {
                state.isFeaturedLoading = true;
            })
            .addCase(fetchFeaturedServices.fulfilled, (state, action) => {
                state.isFeaturedLoading = false;
                state.featuredServices = action.payload;
            })
            .addCase(fetchFeaturedServices.rejected, (state, action) => {
                state.isFeaturedLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchUserServices.pending, state => {
                state.isUserServicesLoading = true;
            })
            .addCase(fetchUserServices.fulfilled, (state, action) => {
                state.isUserServicesLoading = false;
                state.userServices = action.payload;
            })
            .addCase(fetchUserServices.rejected, (state, action) => {
                state.isUserServicesLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchServiceById.pending, state => {
                state.isLoading = true;
            })
            .addCase(fetchServiceById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedService = action.payload;
            })
            .addCase(fetchServiceById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(createService.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createService.fulfilled, state => {
                state.isLoading = false;
            })
            .addCase(createService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(updateService.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateService.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.userServices.findIndex(s => s.id === action.payload.serviceId);
                if (index !== -1) {
                    state.userServices[index] = {
                        ...state.userServices[index],
                        ...action.payload.data,
                        ...(action.payload.images && { images: action.payload.images }),
                    };
                }
            })
            .addCase(updateService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(deleteService.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userServices = state.userServices.filter(s => s.id !== action.payload);
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(searchServices.pending, state => {
                state.isLoading = true;
            })
            .addCase(searchServices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services = action.payload;
            })
            .addCase(searchServices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, clearFilters, clearError, resetServices, setSelectedService } =
    servicesSlice.actions;

export default servicesSlice.reducer;
