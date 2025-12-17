/**
 * Main Navigator
 * Handles all authenticated user screens with bottom tab navigation
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MainStackParamList } from './types';
import {
  Home,
  Profile,
  Directory,
  Services,
  Details,
  BuySell,
  RoomFinder,
  MarketItemDetails,
  RoomDetails,
  ProfessionalNetwork,
  ProfessionalProfile,
  ProfileCommunityGuidelines,
  SubmitListing,
  SellItem,
  PostRoom,
  JoinProfessionalNetwork,
} from '@/screens';
import { colors } from '@/theme';
import { BottomNavigator } from '@/components';

const Tab = createBottomTabNavigator<MainStackParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

// Icon renderer functions
const renderHomeIcon = ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
  <Ionicons
    name={focused ? 'home' : 'home-outline'}
    size={size || 24}
    color={color}
  />
);

const renderProfileIcon = ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
  <Ionicons
    name={focused ? 'person' : 'person-outline'}
    size={size || 24}
    color={color}
  />
);

const renderDirectoryIcon = ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
  <Ionicons
    name={focused ? 'storefront' : 'storefront-outline'}
    size={size || 24}
    color={color}
  />
);

const renderServicesIcon = ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
  <Ionicons
    name={focused ? 'briefcase' : 'briefcase-outline'}
    size={size || 24}
    color={color}
  />
);

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Tabs" options={{ headerShown: false }}>
        {() => (
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: colors.primary[600],
              tabBarInactiveTintColor: colors.text.secondary,
            }}
            tabBar={props => <BottomNavigator {...props} />}
            initialRouteName="Home">
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                title: 'Home',
                tabBarLabel: 'Home',
                tabBarIcon: renderHomeIcon,
              }}
            />
            <Tab.Screen
              name="Directory"
              component={Directory}
              options={{
                title: 'Directory',
                tabBarLabel: 'Directory',
                tabBarIcon: renderDirectoryIcon,
              }}
            />
            <Tab.Screen
              name="Services"
              component={Services}
              options={{
                title: 'Services',
                tabBarLabel: 'Services',
                tabBarIcon: renderServicesIcon,
              }}
            />
            <Tab.Screen
              name="Profile"
              component={Profile}
              options={{
                title: 'Profile',
                tabBarLabel: 'Profile',
                tabBarIcon: renderProfileIcon,
              }}
            />
            {/* Hidden tabs for Buy & Sell, Room Finder and Professionals so they share bottom bar */}
            <Tab.Screen
              name="BuySell"
              component={BuySell}
              options={{
                headerShown: false,
                tabBarButton: () => null,
              }}
            />
            <Tab.Screen
              name="RoomFinder"
              component={RoomFinder}
              options={{
                headerShown: false,
                tabBarButton: () => null,
              }}
            />
            <Tab.Screen
              name="ProfessionalNetwork"
              component={ProfessionalNetwork}
              options={{
                headerShown: false,
                tabBarButton: () => null,
              }}
            />
          </Tab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="MarketItemDetails" component={MarketItemDetails} />
      <Stack.Screen name="RoomDetails" component={RoomDetails} />
      <Stack.Screen name="ProfessionalProfile" component={ProfessionalProfile} />
      <Stack.Screen
        name="CommunityGuidelines"
        component={ProfileCommunityGuidelines}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SubmitListing" component={SubmitListing} />
      <Stack.Screen name="SellItem" component={SellItem} />
      <Stack.Screen name="PostRoom" component={PostRoom} />
      <Stack.Screen name="JoinProfessionalNetwork" component={JoinProfessionalNetwork} />
    </Stack.Navigator>
  );
};

