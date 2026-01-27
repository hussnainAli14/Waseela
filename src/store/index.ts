import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import businessesReducer from './slices/businessesSlice';
import servicesReducer from './slices/servicesSlice';
import marketplaceReducer from './slices/marketplaceSlice';
import savedListingsReducer from './slices/savedListingsSlice';
import roomsReducer from './slices/roomsSlice';
import productsReducer from './slices/productsSlice';
import reviewsReducer from './slices/reviewsSlice';
import reportsReducer from './slices/reportsSlice';
import categoriesReducer from './slices/categoriesSlice';
import professionalsReducer from './slices/professionalsSlice';

// Persist configuration
const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
    whitelist: ['auth'], // Only persist auth state
};

// Combine reducers
const rootReducer = combineReducers({
    auth: authReducer,
    businesses: businessesReducer,
    services: servicesReducer,
    marketplace: marketplaceReducer,
    savedListings: savedListingsReducer,
    rooms: roomsReducer,
    professionals: professionalsReducer,
    products: productsReducer,
    reviews: reviewsReducer,
    reports: reportsReducer,
    categories: categoriesReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
