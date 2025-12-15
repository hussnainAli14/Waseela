import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  padding?: number;
  onPress?: () => void;
}

