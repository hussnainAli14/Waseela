import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useAppDispatch } from '@/store/hooks';
import { signOut } from '@/store/slices/authSlice';

/**
 * Custom hook for handling user sign out
 * Shows confirmation dialog and dispatches sign out action
 */
export const useSignOut = () => {
    const dispatch = useAppDispatch();

    const handleSignOut = useCallback(() => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await dispatch(signOut()).unwrap();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to sign out. Please try again.');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    }, [dispatch]);

    return { handleSignOut };
};
