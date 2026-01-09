import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { firebaseAuth, firebaseFirestore } from '@/config/firebase';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

export interface User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    createdAt?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Async thunks for Firebase operations
export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({ email, password, displayName }: { email: string; password: string; displayName?: string }, { rejectWithValue }) => {
        try {
            const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
            const { uid, email: userEmail } = userCredential.user;

            // Update profile if displayName provided
            if (displayName) {
                await userCredential.user.updateProfile({ displayName });
            }

            // Store user data in Firestore
            const userData: User = {
                uid,
                email: userEmail!,
                displayName: displayName || '',
                createdAt: new Date().toISOString(),
            };

            await firebaseFirestore.collection('users').doc(uid).set(userData);

            return userData;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const signIn = createAsyncThunk(
    'auth/signIn',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
            const { uid, email: userEmail, displayName, photoURL } = userCredential.user;

            // Fetch user data from Firestore
            const userDoc = await firebaseFirestore.collection('users').doc(uid).get();
            const userData = userDoc.data() as User;

            return {
                uid,
                email: userEmail!,
                displayName: displayName || userData?.displayName || '',
                photoURL: photoURL || userData?.photoURL || '',
            };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const signOut = createAsyncThunk(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            await firebaseAuth.signOut();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (firebaseUser: FirebaseAuthTypes.User, { rejectWithValue }) => {
        try {
            const { uid, email, displayName, photoURL } = firebaseUser;

            // Fetch user data from Firestore
            const userDoc = await firebaseFirestore.collection('users').doc(uid).get();
            const userData = userDoc.data() as User;

            return {
                uid,
                email: email!,
                displayName: displayName || userData?.displayName || '',
                photoURL: photoURL || userData?.photoURL || '',
            };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Sign Up
        builder
            .addCase(signUp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Sign In
        builder
            .addCase(signIn.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Sign Out
        builder
            .addCase(signOut.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signOut.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(signOut.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Load User
        builder
            .addCase(loadUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
