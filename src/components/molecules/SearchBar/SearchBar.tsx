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
  const [internalValue, setInternalValue] = useState('');

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

  // Allow typing even when a value is passed without an onChange handler by falling back
  // to internal state updates.
  const isControlled = value !== undefined && onChangeText !== undefined;
  const inputValue = isControlled ? value : value ?? internalValue;

  const handleChangeText = (text: string) => {
    if (!isControlled) {
      setInternalValue(text);
    }
    onChangeText?.(text);
  };

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.containerFocused,
        style,
      ]}
      // Capture touch so parent touchables (e.g., wrappers that dismiss keyboard) don't steal focus
      onStartShouldSetResponderCapture={() => true}>
      {renderLeftIcon()}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        value={inputValue}
        onChangeText={handleChangeText}
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

