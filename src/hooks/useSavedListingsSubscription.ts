import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { subscribeToSavedListings } from '@/services/firestore/savedListings';
import { setSavedListings } from '@/store/slices/savedListingsSlice';

/**
 * Hook to subscribe to real-time saved listings updates
 * Automatically updates Redux store when user saves/unsaves items
 */
export const useSavedListingsSubscription = (userId: string | undefined) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!userId) return;

        console.log('🔖 useSavedListingsSubscription: Setting up subscription for user:', userId);

        const unsubscribe = subscribeToSavedListings(userId, (savedListings) => {
            console.log('📡 useSavedListingsSubscription: Received update:', savedListings.length, 'saved items');
            dispatch(setSavedListings(savedListings));
        });

        return () => {
            console.log('🔖 useSavedListingsSubscription: Cleaning up subscription');
            unsubscribe();
        };
    }, [userId, dispatch]);
};
