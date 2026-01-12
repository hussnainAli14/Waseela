import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import { SearchBarProps } from './types';
import { colors } from '@/theme';
import { useDebouncedCallback } from '@/hooks';

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
  debounceDelay = 500,
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  // Local state for immediate UI feedback (especially important when debouncing)
  const [localValue, setLocalValue] = useState(value ?? '');

  // Sync local value with prop value when it changes externally
  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

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

  // Use local value for immediate UI feedback
  const inputValue = localValue;

  // Create debounced callback if debouncing is enabled (debounceDelay > 0)
  const debouncedOnChangeText = useDebouncedCallback(
    (text: string) => {
      onChangeText?.(text);
    },
    debounceDelay
  );

  const handleChangeText = (text: string) => {
    // Always update local value immediately for responsive UI
    setLocalValue(text);
    
    // Debounce the onChangeText callback if debouncing is enabled
    if (debounceDelay > 0 && onChangeText) {
      debouncedOnChangeText(text);
    } else {
      // Call immediately if debouncing is disabled
      onChangeText?.(text);
    }
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

