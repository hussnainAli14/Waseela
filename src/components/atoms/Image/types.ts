import { ImageProps, ImageStyle, ViewStyle, StyleProp } from 'react-native';

export type ImageResizeMode = 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';

export interface ImageComponentProps extends Omit<ImageProps, 'style' | 'width' | 'height'> {
  source: ImageProps['source'];
  resizeMode?: ImageResizeMode;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}

