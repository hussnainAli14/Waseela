import { AuthScreenProps } from '@/navigation/types';

export type LoginScreenProps = AuthScreenProps<'Login'>;

export interface LoginFormData {
  email: string;
  password: string;
}

