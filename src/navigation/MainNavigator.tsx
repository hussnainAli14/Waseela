/**
 * Main Navigator
 * Handles all authenticated user screens with bottom tab navigation
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MainStackParamList } from './types';
import { About, Home, Profile } from '@/screens';
import { colors } from '@/theme';

const Tab = createBottomTabNavigator<MainStackParamList>();

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

const renderAboutIcon = ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
  <Ionicons
    name={focused ? 'information-circle' : 'information-circle-outline'}
    size={size || 24}
    color={color}
  />
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#6366F1',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontFamily: 'Outfit-SemiBold',
        },
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.common.white,
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: 'Outfit-Medium',
          fontSize: 12,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
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
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: renderProfileIcon,
        }}
      />
      <Tab.Screen
        name="About"
        component={About}
        options={{
          title: 'About',
          tabBarLabel: 'About',
          tabBarIcon: renderAboutIcon,
        }}
      />
    </Tab.Navigator>
  );
};

