import { AuthScreenProps } from '@/navigation/types';

export type ForgotPasswordScreenProps = AuthScreenProps<'ForgotPassword'>;

export interface ForgotPasswordFormData {
  email: string;
}

