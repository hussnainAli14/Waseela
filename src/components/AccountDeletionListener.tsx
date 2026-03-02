import React from 'react';
import { useAccountDeletionListener } from '@/hooks/useAccountDeletionListener';

/**
 * Component that listens for account deletion status changes
 * This component doesn't render anything, it just sets up the listener
 */
export const AccountDeletionListener: React.FC = () => {
  useAccountDeletionListener();
  return null;
};
