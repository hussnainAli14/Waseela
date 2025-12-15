import { ReactNode } from 'react';
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

export interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  value?: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onPressRightIcon?: () => void;
}

