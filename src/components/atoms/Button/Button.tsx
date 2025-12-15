import React from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { ButtonProps } from './types';
import { styles } from './styles';
import { Text } from '../Text';
import { colors } from '@/theme';

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled,
  containerStyle,
  textStyle,
  leftIcon,
  rightIcon,
  ...touchableProps
}) => {
  const getButtonStyle = () => {
    const baseStyle = [
      styles.button,
      size === 'small' && styles.buttonSmall,
      size === 'medium' && styles.buttonMedium,
      size === 'large' && styles.buttonLarge,
      variant === 'primary' && styles.buttonPrimary,
      variant === 'secondary' && styles.buttonSecondary,
      variant === 'outline' && styles.buttonOutline,
      variant === 'text' && styles.buttonText,
      fullWidth && styles.fullWidth,
      (disabled || loading) && styles.buttonDisabled,
    ];

    return baseStyle;
  };

  const getTextStyle = () => {
    return [
      styles.text,
      size === 'small' && styles.textSmall,
      size === 'medium' && styles.textMedium,
      size === 'large' && styles.textLarge,
      variant === 'primary' && styles.textPrimary,
      variant === 'secondary' && styles.textSecondary,
      variant === 'outline' && styles.textOutline,
      variant === 'text' && styles.textText,
      textStyle,
    ];
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return colors.common.white;
      case 'outline':
      case 'text':
        return colors.secondary[500];
      default:
        return colors.common.white;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), containerStyle]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...touchableProps}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
        />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text variant="md-semibold" style={getTextStyle()}>
            {title}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;

