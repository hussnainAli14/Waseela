import { AuthScreenProps } from '@/navigation/types';

export type SignupScreenProps = AuthScreenProps<'Signup'>;

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

