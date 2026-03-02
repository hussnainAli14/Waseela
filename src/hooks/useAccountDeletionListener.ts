import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { firebaseFirestore, firebaseAuth } from '@/config/firebase';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signOut } from '@/store/slices/authSlice';

/**
 * Hook to listen for account deletion status changes
 * Automatically signs out the user if their account is deleted by admin
 */
export const useAccountDeletionListener = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const hasShownAlertRef = useRef(false);

  useEffect(() => {
    // Only set up listener if user is authenticated
    if (!user?.uid) {
      // Clean up any existing listener
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    console.log('🔍 useAccountDeletionListener: Setting up listener for user:', user.uid);

    // Query for account deletion requests for this user
    // Listen to all deletion requests, then filter by status in the handler
    const query = firebaseFirestore
      .collection('account_deletions')
      .where('uid', '==', user.uid);

    // Set up real-time listener
    const unsubscribe = query.onSnapshot(
      (snapshot) => {
        if (!snapshot.empty) {
          // Check all deletion requests for this user
          snapshot.docs.forEach((doc) => {
            const deletionData = doc.data();
            const status = deletionData.status;
            
            // Check if account has been deleted/approved/completed
            if (['deleted', 'approved', 'completed'].includes(status) && !hasShownAlertRef.current) {
              console.log('🚨 useAccountDeletionListener: Account deletion detected:', status);
              
              // Prevent multiple alerts
              hasShownAlertRef.current = true;

              // Show alert and sign out
              Alert.alert(
                'Account Deleted',
                'Your account has been deleted by an administrator. You will be signed out now.',
                [
                  {
                    text: 'OK',
                    onPress: async () => {
                      try {
                        await dispatch(signOut()).unwrap();
                      } catch (error) {
                        console.error('Error signing out after account deletion:', error);
                        // Force sign out even if dispatch fails
                        await firebaseAuth.signOut();
                      }
                    },
                  },
                ],
                { cancelable: false }
              );
            }
          });
        }
      },
      (error) => {
        console.error('❌ useAccountDeletionListener: Error listening to account deletions:', error);
      }
    );

    unsubscribeRef.current = unsubscribe;

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [user?.uid, dispatch]);

  // Reset alert flag when user changes
  useEffect(() => {
    hasShownAlertRef.current = false;
  }, [user?.uid]);
};
