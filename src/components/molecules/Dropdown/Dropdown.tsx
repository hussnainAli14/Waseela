import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Dropdown as ElementDropdown } from 'react-native-element-dropdown';
import { colors } from '@/theme';
import { DropdownOption, DropdownProps } from './types';
import { styles } from './styles';

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select',
  buttonStyle,
  buttonTextStyle,
  optionTextStyle,
  optionItemStyle,
}) => {
  const handleChange = (item: DropdownOption) => {
    onSelect(item.value);
  };

  // Merge custom styles with default styles
  const containerStyle: ViewStyle = StyleSheet.flatten([
    styles.button,
    buttonStyle,
  ]);

  const placeholderStyle: TextStyle = StyleSheet.flatten([
    styles.buttonText,
    buttonTextStyle,
  ]);

  const selectedTextStyle: TextStyle = StyleSheet.flatten([
    styles.buttonText,
    buttonTextStyle,
  ]);

  const itemTextStyle: TextStyle = StyleSheet.flatten([
    styles.optionText,
    optionTextStyle,
  ]);

  const itemContainerStyle: ViewStyle = StyleSheet.flatten([
    styles.optionItem,
    optionItemStyle,
  ]);

  return (
    <ElementDropdown
      data={options}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={selectedValue}
      onChange={handleChange}
      style={containerStyle}
      placeholderStyle={placeholderStyle}
      selectedTextStyle={selectedTextStyle}
      itemTextStyle={itemTextStyle}
      itemContainerStyle={itemContainerStyle}
      containerStyle={styles.dropdownCard}
      activeColor={colors.primary[50]}
      fontFamily="Outfit-Medium"
      iconColor={colors.text.secondary}
    />
  );
};

export default Dropdown;

