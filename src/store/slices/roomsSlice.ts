import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Room, RoomFormData, RoomFilters } from '@/types/firestore';
import * as roomsService from '@/services/firestore/rooms';

interface RoomsState {
    rooms: Room[];
    userRooms: Room[];
    selectedRoom: Room | null;
    isLoading: boolean;
    isUserRoomsLoading: boolean;
    error: string | null;
    filters: RoomFilters;
    hasMore: boolean;
    lastDocId: string | null; // Store only document ID instead of DocumentSnapshot for serialization
}

const initialState: RoomsState = {
    rooms: [],
    userRooms: [],
    selectedRoom: null,
    isLoading: false,
    isUserRoomsLoading: false,
    error: null,
    filters: {},
    hasMore: true,
    lastDocId: null,
};

export const fetchRooms = createAsyncThunk(
    'rooms/fetchRooms',
    async ({ filters, limit = 20 }: { filters?: RoomFilters; limit?: number }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { rooms: RoomsState };
            const { rooms, lastDocId } = await roomsService.getRooms(
                filters || state.rooms.filters,
                limit,
                state.rooms.lastDocId || undefined
            );
            return { rooms, lastDocId, isLoadMore: !!state.rooms.lastDocId };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserRooms = createAsyncThunk(
    'rooms/fetchUserRooms',
    async (posterId: string, { rejectWithValue }) => {
        try {
            const rooms = await roomsService.getRoomsByPoster(posterId);
            return rooms;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchRoomById = createAsyncThunk(
    'rooms/fetchRoomById',
    async (roomId: string, { rejectWithValue }) => {
        try {
            const room = await roomsService.getRoom(roomId);
            if (!room) {
                throw new Error('Room not found');
            }
            return room;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createRoom = createAsyncThunk(
    'rooms/createRoom',
    async (
        { data, posterId, poster, images }: { data: RoomFormData; posterId: string; poster: { name: string; photo?: string }; images: string[] },
        { rejectWithValue }
    ) => {
        try {
            const roomId = await roomsService.createRoom(data, posterId, poster, images);
            return roomId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateRoom = createAsyncThunk(
    'rooms/updateRoom',
    async (
        { roomId, data, images }: { roomId: string; data: Partial<RoomFormData>; images?: string[] },
        { rejectWithValue }
    ) => {
        try {
            await roomsService.updateRoom(roomId, data, images);
            return { roomId, data, images };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteRoom = createAsyncThunk(
    'rooms/deleteRoom',
    async (roomId: string, { rejectWithValue }) => {
        try {
            await roomsService.deleteRoom(roomId);
            return roomId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<RoomFilters>) => {
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
        resetRooms: state => {
            state.rooms = [];
            state.lastDocId = null;
            state.hasMore = true;
        },
        setSelectedRoom: (state, action: PayloadAction<Room | null>) => {
            state.selectedRoom = action.payload;
        },
    },
    extraReducers: builder => {
        // Fetch rooms
        builder
            .addCase(fetchRooms.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.isLoadMore) {
                    state.rooms = [...state.rooms, ...action.payload.rooms];
                } else {
                    state.rooms = action.payload.rooms;
                }
                state.lastDocId = action.payload.lastDocId;
                state.hasMore = action.payload.rooms.length > 0;
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch user rooms
        builder
            .addCase(fetchUserRooms.pending, state => {
                state.isUserRoomsLoading = true;
            })
            .addCase(fetchUserRooms.fulfilled, (state, action) => {
                state.isUserRoomsLoading = false;
                state.userRooms = action.payload;
            })
            .addCase(fetchUserRooms.rejected, (state, action) => {
                state.isUserRoomsLoading = false;
                state.error = action.payload as string;
            });

        // Fetch room by ID
        builder
            .addCase(fetchRoomById.pending, state => {
                state.isLoading = true;
            })
            .addCase(fetchRoomById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedRoom = action.payload;
            })
            .addCase(fetchRoomById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Create room
        builder
            .addCase(createRoom.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createRoom.fulfilled, state => {
                state.isLoading = false;
            })
            .addCase(createRoom.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update room
        builder
            .addCase(updateRoom.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateRoom.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.userRooms.findIndex(r => r.id === action.payload.roomId);
                if (index !== -1) {
                    state.userRooms[index] = {
                        ...state.userRooms[index],
                        ...action.payload.data,
                        ...(action.payload.images && { images: action.payload.images }),
                    };
                }
            })
            .addCase(updateRoom.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Delete room
        builder
            .addCase(deleteRoom.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userRooms = state.userRooms.filter(r => r.id !== action.payload);
            })
            .addCase(deleteRoom.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, clearFilters, clearError, resetRooms, setSelectedRoom } = roomsSlice.actions;

export default roomsSlice.reducer;
