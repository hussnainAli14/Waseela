import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '../Text';
import { styles } from './styles';
import { CheckboxProps } from './types';
import { colors } from '@/theme';

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onPress,
  label,
  labelStyle,
  containerStyle,
  disabled = false,
  size = 'medium',
}) => {
  const getCheckboxSize = () => {
    switch (size) {
      case 'small':
        return 18;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const checkboxSize = getCheckboxSize();

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}>
      <View
        style={[
          styles.checkbox,
          size === 'small' && styles.checkboxSmall,
          size === 'large' && styles.checkboxLarge,
          checked && styles.checkboxChecked,
          disabled && styles.checkboxDisabled,
        ]}>
        {checked && (
          <Ionicons
            name="checkmark"
            size={checkboxSize - 8}
            color={colors.common.white}
          />
        )}
      </View>
      {label && (
        <Text
          variant="md-normal"
          style={[styles.label, labelStyle, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;

