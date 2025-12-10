import { TextProps as RNTextProps } from 'react-native';
export type TextProps = RNTextProps & {
    children: React.ReactNode;
    variant: FontVariants;
}

export type FontVariants =  'xs-normal' | 'xs-medium' | 'xs-semibold' | 'xs-bold' | 'sm-normal' | 'sm-medium' | 'sm-semibold' | 'sm-bold' | 'md-normal' | 'md-medium' | 'md-semibold' | 'md-bold' | 'lg-normal' | 'lg-medium' | 'lg-semibold' | 'lg-bold' | 'xl-normal' | 'xl-medium' | 'xl-semibold' | 'xl-bold' | '2xl-normal' | '2xl-medium' | '2xl-semibold' | '2xl-bold' | '3xl-normal' | '3xl-medium' | '3xl-semibold' | '3xl-bold'

