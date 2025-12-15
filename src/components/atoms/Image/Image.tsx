import React from 'react';
import { Image as RNImage, View, ViewStyle } from 'react-native';
import { ImageComponentProps } from './types';
import { styles as baseStyles } from './styles';

const Image: React.FC<ImageComponentProps> = ({
  source,
  resizeMode = 'cover',
  containerStyle,
  imageStyle,
  width,
  height,
  borderRadius,
  ...imageProps
}) => {
  const dynamicContainerStyle: ViewStyle = {
    ...(width !== undefined && { width: width as ViewStyle['width'] }),
    ...(height !== undefined && { height: height as ViewStyle['height'] }),
    ...(borderRadius !== undefined && { borderRadius }),
  };

  const containerStyles = [
    baseStyles.container,
    dynamicContainerStyle,
    containerStyle,
  ];

  const imageStyles = [
    baseStyles.image,
    imageStyle,
  ];

  return (
    <View style={containerStyles}>
      <RNImage
        source={source}
        resizeMode={resizeMode}
        style={imageStyles}
        {...imageProps}
      />
    </View>
  );
};

export default Image;

