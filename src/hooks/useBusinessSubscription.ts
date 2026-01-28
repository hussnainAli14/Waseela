import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { subscribeToBusinesses } from '@/services/firestore/businesses';
import { setBusinesses } from '@/store/slices/businessesSlice';
import type { ListingFilters } from '@/types/firestore';

/**
 * Hook to subscribe to real-time business updates
 * Automatically updates Redux store when businesses are approved/rejected/modified in admin panel
 */
export const useBusinessSubscription = (filters: ListingFilters = { status: 'approved' }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log('🔥 useBusinessSubscription: Setting up subscription with filters:', filters);

        const unsubscribe = subscribeToBusinesses(filters, (businesses) => {
            console.log('📡 useBusinessSubscription: Received update:', businesses.length, 'businesses');
            dispatch(setBusinesses(businesses));
        });

        return () => {
            console.log('🔥 useBusinessSubscription: Cleaning up subscription');
            unsubscribe();
        };
    }, [JSON.stringify(filters), dispatch]); // Use JSON.stringify for deep comparison
};
