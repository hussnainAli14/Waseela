/**
 * Navigation type definitions
 * Provides type safety for navigation throughout the app
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack Param List
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

// Main/App Stack Param List (for authenticated users)
export type MainStackParamList = {
  Home: undefined;
  Profile: undefined;
  About: undefined;
};

// Root Navigator Param List
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

// Navigation prop types for screens
export type AuthScreenProps<T extends keyof AuthStackParamList> = {
  navigation: import('@react-navigation/native-stack').NativeStackNavigationProp<
    AuthStackParamList,
    T
  >;
  route: import('@react-navigation/native').RouteProp<AuthStackParamList, T>;
};

export type MainScreenProps<T extends keyof MainStackParamList> = {
  navigation: import('@react-navigation/bottom-tabs').BottomTabNavigationProp<
    MainStackParamList,
    T
  >;
  route: import('@react-navigation/native').RouteProp<MainStackParamList, T>;
};

// Declare global types for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

