import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import { SearchBarProps } from './types';
import { colors } from '@/theme';

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  placeholder = 'Search',
  onChangeText,
  onSubmitEditing,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onPressRightIcon,
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const renderLeftIcon = () =>
    leftIcon || (
      <Ionicons
        name="search-outline"
        size={20}
        color={colors.text.secondary}
        style={styles.defaultIcon}
      />
    );

  const renderRightIcon = () => {
    if (rightIcon) {
      if (onPressRightIcon) {
        return (
          <TouchableOpacity onPress={onPressRightIcon} style={styles.iconButton}>
            {rightIcon}
          </TouchableOpacity>
        );
      }
      return <View style={styles.iconButton}>{rightIcon}</View>;
    }
    return null;
  };

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.containerFocused,
        style,
      ]}>
      {renderLeftIcon()}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={onSubmitEditing}
        {...inputProps}
      />
      {renderRightIcon()}
    </View>
  );
};

export default SearchBar;

