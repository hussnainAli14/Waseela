import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface HeaderProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

