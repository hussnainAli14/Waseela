import React, { useState } from 'react';
import { View, TextInput, ViewStyle, StyleProp } from 'react-native';
import { TextFieldProps } from './types';
import { styles } from './styles';
import { Text } from '../Text';

const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  size = 'medium',
  containerStyle,
  inputContainerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getInputContainerStyle = (): Array<StyleProp<ViewStyle>> => {
    const baseStyle: Array<StyleProp<ViewStyle>> = [
      styles.inputContainer,
      size === 'small' && styles.inputContainerSmall,
      size === 'medium' && styles.inputContainerMedium,
      size === 'large' && styles.inputContainerLarge,
      inputContainerStyle,
    ];

    if (error) {
      baseStyle.push(styles.inputContainerError);
    } else if (isFocused) {
      baseStyle.push(styles.inputContainerFocused);
    }

    return baseStyle;
  };

  const getInputStyle = () => {
    return [
      styles.input,
      size === 'small' && styles.inputSmall,
      size === 'medium' && styles.inputMedium,
      size === 'large' && styles.inputLarge,
      inputStyle,
    ];
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="md-medium" style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>{leftIcon}</View>
        )}
        <TextInput
          style={getInputStyle()}
          placeholderTextColor="#999"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...textInputProps}
        />
        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      {error && (
        <Text variant="sm-normal" style={[styles.errorText, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default TextField;

