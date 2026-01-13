import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Dropdown } from '../Dropdown';
import { DropdownOption } from '../Dropdown/types';

export interface CityDropdownProps {
  selectedValue?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  allOptionValue?: string;
  valueFormat?: 'lowercase' | 'capitalized';
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  optionTextStyle?: StyleProp<TextStyle>;
  optionItemStyle?: StyleProp<ViewStyle>;
}

// Standard UK cities list
const UK_CITIES = [
  'London',
  'Birmingham',
  'Manchester',
  'Liverpool',
  'Leeds',
  'Sheffield',
  'Bristol',
  'Newcastle',
  'Leicester',
  'Nottingham',
  'Cardiff',
  'Glasgow',
  'Edinburgh',
  'Bradford',
  'Southampton',
];

/**
 * Generic City Dropdown Component
 * Provides a reusable city selector with UK cities
 */
const CityDropdown: React.FC<CityDropdownProps> = ({
  selectedValue,
  onSelect,
  placeholder = 'Select city',
  includeAllOption = false,
  allOptionLabel = 'All Cities',
  allOptionValue = 'all',
  valueFormat = 'lowercase',
  buttonStyle,
  buttonTextStyle,
  optionTextStyle,
  optionItemStyle,
}) => {
  // Generate city options based on value format
  const cityOptions: DropdownOption[] = UK_CITIES.map(city => ({
    label: city,
    value: valueFormat === 'lowercase' ? city.toLowerCase() : city,
  }));

  // Add "All Cities" option if requested
  const options: DropdownOption[] = includeAllOption
    ? [{ label: allOptionLabel, value: allOptionValue }, ...cityOptions]
    : cityOptions;

  return (
    <Dropdown
      options={options}
      selectedValue={selectedValue}
      onSelect={onSelect}
      placeholder={placeholder}
      buttonStyle={buttonStyle}
      buttonTextStyle={buttonTextStyle}
      optionTextStyle={optionTextStyle}
      optionItemStyle={optionItemStyle}
    />
  );
};

export default CityDropdown;
