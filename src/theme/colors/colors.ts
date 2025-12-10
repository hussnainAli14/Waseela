/**
 * Color scheme for the app
 * Designed for accessibility and modern UI/UX
 */

export const colors = {
  // Primary Colors - Main brand color (Blue spectrum)
  primary: {
    50: '#F3F4F6',     // Very light gray-blue
    100: '#F3F3F5',    // Light gray
    200: '#4496FF',    // Light blue
    300: '#3B8CFF',    // Medium-light blue
    400: '#2B7FFF',    // Medium blue
    500: '#2B7FFF',    // Main primary color - vibrant blue
    600: '#3B8CFF',    // Medium-dark blue
    700: '#6262FD',    // Blue-purple
    800: '#2B7FFF',    // Dark blue
    900: '#000000',    // Deepest (black)
  },

  // Secondary Colors - Teal/Green spectrum
  secondary: {
    50: '#ECFDF5',     // Lightest green tint
    100: '#ECFDF5',    // Very light green
    200: '#00BA7E',    // Light teal-green
    300: '#00A984',    // Medium-light teal
    400: '#00A984',    // Medium teal
    500: '#00A984',    // Main secondary color - teal
    600: '#009989',    // Darker teal
    700: '#009989',    // Deep teal
    800: '#009989',    // Very deep teal
    900: '#000000',    // Deepest
  },

  // Accent Colors - For highlights and special elements
  accent: {
    // Blue variants
    blue: '#3B8CFF',
    blueLight: '#4496FF',
    blueDark: '#2B7FFF',
    
    // Purple variants
    purple: '#AC53FF',
    purpleBlue: '#6262FD',
    
    // Teal/Green variants
    teal: '#00A984',
    tealLight: '#00BA7E',
    tealDark: '#009989',
    tealBackground: '#ECFDF5',
    
    // Orange variants
    orange: '#FC6C00',
    orangeLight: '#FFB47F',
    orangeDark: '#F54A00',
    orangeBrown: '#A65F06',
  },

  // Status Colors - For feedback and states
  status: {
    success: '#00BA7E',
    successLight: '#ECFDF5',
    successDark: '#009989',
    
    error: '#F54A00',
    errorLight: '#FFB47F',
    errorDark: '#A65F06',
    
    warning: '#FC6C00',
    warningLight: '#FEF9C2',
    warningDark: '#A65F06',
    
    info: '#3B8CFF',
    infoLight: '#4496FF',
    infoDark: '#2B7FFF',
  },

  // Neutral Colors - Grays for text, borders, backgrounds
  neutral: {
    50: '#FFFFFF',     // Pure white
    100: '#F3F4F6',    // Very light gray
    200: '#F3F3F5',    // Light gray
    300: '#F3F3F5',    // Light-medium gray
    400: '#F3F4F6',    // Medium-light gray
    500: '#F3F3F5',    // Medium gray
    600: '#000000',    // Dark (black)
    700: '#000000',    // Darker
    800: '#000000',    // Very dark
    900: '#000000',    // Pure black
  },

  // Background Colors
  background: {
    light: '#FFFFFF',
    lightSecondary: '#F3F4F6',
    lightTertiary: '#F3F3F5',
    success: '#ECFDF5',
    warning: '#FEF9C2',
    dark: '#000000',
    darkSecondary: '#000000',
  },

  // Text Colors
  text: {
    primary: '#000000',      // Black text for light backgrounds
    secondary: '#000000',    // Dark text (use opacity for variation)
    tertiary: '#000000',     // Dark text with lower opacity
    inverse: '#FFFFFF',      // White text for dark backgrounds
    disabled: '#F3F3F5',     // Light gray for disabled text
  },

  // Border Colors
  border: {
    light: '#F3F4F6',
    medium: '#F3F3F5',
    dark: '#000000',
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.8)',
    lightSubtle: 'rgba(0, 0, 0, 0.1)',
  },

  // Common UI Colors
  common: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },
} as const;

// Type export for TypeScript
export type ColorScheme = typeof colors;
