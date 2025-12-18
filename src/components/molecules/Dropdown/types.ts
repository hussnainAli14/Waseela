import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  optionTextStyle?: StyleProp<TextStyle>;
  optionItemStyle?: StyleProp<ViewStyle>;
}

