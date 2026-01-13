/**
 * Navigation type definitions
 * Provides type safety for navigation throughout the app
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack Param List
export type AuthStackParamList = {
  CommunityGuidelines: undefined;
  Login: undefined;
  AgeVerification: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

// Main/App Stack Param List (for authenticated users)
export type MainStackParamList = {
  Tabs: undefined;
  Home: undefined;
  Directory: undefined;
  Services: undefined;
  BuySell: undefined;
  RoomFinder: undefined;
  ProfessionalNetwork: undefined;
  Profile: undefined;
  EditProfile: undefined;
  SubmitListing: undefined;
  SellItem: undefined;
  PostRoom: undefined;
  JoinProfessionalNetwork: undefined;
  UserProfessionalProfiles: undefined;
  CommunityGuidelines: undefined;
  Details: {
    listing: ListingItem;
  };
  MarketItemDetails: {
    item: MarketItem;
  };
  RoomDetails: {
    room: RoomItem;
  };
  ProfessionalProfile: {
    professional: ProfessionalProfileItem;
  };
};

// Root Navigator Param List
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

export type ListingItem = {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  verified?: boolean;
  image: string;
  description?: string;
  address?: string;
  timings?: string;
  phone?: string;
  email?: string;
};

export type MarketItem = {
  id: string;
  title: string;
  price: string;
  location: string;
  condition: string;
  category: string;
  image: string;
  postedAt?: string;
  sellerName?: string;
  description?: string;
  safetyTips?: string[];
};

export type RoomItem = {
  id: string;
  title: string;
  city: string;
  type: 'single' | 'double' | 'studio' | 'shared';
  price: number;
  priceLabel: string;
  image: string;
  billsIncluded: boolean;
  locationLine1: string;
  locationLine2: string;
  description?: string;
  amenities?: string[];
  availableFrom?: string;
  landlordName?: string;
  postedAt?: string;
};

export type ProfessionalProfileItem = {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  city: string;
  yearsExperience: number;
  tags: string[];
  avatar: string;
  about?: string;
  expertise?: string[];
  helpTitle?: string;
  helpDescription?: string;
  linkedinUrl?: string;
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

