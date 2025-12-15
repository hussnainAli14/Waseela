import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { CardProps } from './types';

const Card: React.FC<CardProps> = ({
  children,
  style,
  contentStyle,
  backgroundColor,
  borderColor,
  borderRadius,
  padding,
  onPress,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      {...(onPress ? { activeOpacity: 0.9, onPress } : {})}
      style={[
        styles.container,
        backgroundColor ? { backgroundColor } : null,
        borderColor ? { borderColor, borderWidth: 1 } : null,
        borderRadius !== undefined ? { borderRadius } : null,
        padding !== undefined ? { padding } : null,
        style,
      ]}>
      <View style={contentStyle}>{children}</View>
    </Container>
  );
};

export default Card;

