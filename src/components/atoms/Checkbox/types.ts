import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type CheckboxSize = 'small' | 'medium' | 'large';

export interface CheckboxProps {
  checked?: boolean;
  onPress: () => void;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  size?: CheckboxSize;
}

