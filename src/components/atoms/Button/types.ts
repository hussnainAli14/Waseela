import { TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

