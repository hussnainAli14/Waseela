import React from 'react';
import { View } from 'react-native';
import { styles as baseStyles } from './styles';
import { HeaderProps } from './types';

const Header: React.FC<HeaderProps> = ({
  children,
  style,
  contentStyle,
  backgroundColor,
  paddingHorizontal,
  paddingVertical,
}) => {
  return (
    <View
      style={[
        baseStyles.container,
        backgroundColor ? { backgroundColor } : null,
        paddingHorizontal !== undefined && { paddingHorizontal },
        paddingVertical !== undefined && { paddingVertical },
        style,
      ]}>
      <View style={[baseStyles.content, contentStyle]}>{children}</View>
    </View>
  );
};

export default Header;

