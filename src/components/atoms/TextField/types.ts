import { TextInputProps, ViewStyle, TextStyle } from 'react-native';

export type TextFieldVariant = 'default' | 'outlined' | 'filled';

export type TextFieldSize = 'small' | 'medium' | 'large';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: TextFieldVariant;
  size?: TextFieldSize;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

