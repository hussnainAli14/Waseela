import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setCategories, setCategoriesLoading, setCategoriesError } from '@/store/slices/categoriesSlice';
import { subscribeToCategories } from '@/services/firestore/categories';

/**
 * Hook to subscribe to real-time category updates
 * Should be mounted at a high level in the component tree
 */
export const useCategorySubscription = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCategoriesLoading(true));

        const unsubscribeBusiness = subscribeToCategories(
            (categories) => dispatch(setCategories({ type: 'business', categories })),
            (error) => dispatch(setCategoriesError(error.message)),
            'business'
        );

        const unsubscribeService = subscribeToCategories(
            (categories) => dispatch(setCategories({ type: 'service', categories })),
            (error) => dispatch(setCategoriesError(error.message)),
            'service'
        );

        const unsubscribeMarketplace = subscribeToCategories(
            (categories) => dispatch(setCategories({ type: 'marketplace', categories })),
            (error) => dispatch(setCategoriesError(error.message)),
            'marketplace'
        );

        const unsubscribeProfessional = subscribeToCategories(
            (categories) => dispatch(setCategories({ type: 'professional', categories })),
            (error) => dispatch(setCategoriesError(error.message)),
            'professional'
        );

        // Cleanup subscriptions on unmount
        return () => {
            unsubscribeBusiness();
            unsubscribeService();
            unsubscribeMarketplace();
            unsubscribeProfessional();
        };
    }, [dispatch]);
};
