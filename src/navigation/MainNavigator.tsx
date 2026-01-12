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
  EditProfile,
  Directory,
  Services,
  Details,
  RoomFinder,
  MarketItemDetails,
  RoomDetails,
  ProfessionalProfile,
  ProfileCommunityGuidelines,
  SubmitListing,
  SellItem,
  PostRoom,
  JoinProfessionalNetwork,
  ProfessionalNetwork,
  BuySell,
} from '@/screens';
import { colors } from '@/theme';
import { BottomNavigator } from '@/components/organisms/BottomNavigator';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<MainStackParamList>();
const HomeStack = createNativeStackNavigator<MainStackParamList>();
const DirectoryStack = createNativeStackNavigator<MainStackParamList>();
const ServicesStack = createNativeStackNavigator<MainStackParamList>();
const ProfileStack = createNativeStackNavigator<MainStackParamList>();

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={Home} />
    <HomeStack.Screen name="Details" component={Details} />
    <HomeStack.Screen name="ProfessionalNetwork" component={ProfessionalNetwork} />
    <HomeStack.Screen name="BuySell" component={BuySell} />
    <HomeStack.Screen
      name="SellItem"
      component={SellItem}
      options={{ headerShown: true, title: 'Sell an Item' }}
    />
    <HomeStack.Screen name="SubmitListing" component={SubmitListing} />
    <HomeStack.Screen
      name="ProfessionalProfile"
      component={ProfessionalProfile}
      options={{
        headerShown: true,
        title: 'Professional Profile',
        headerTitleStyle: {
          fontFamily: 'Outfit-Semibold',
        },
      }}
    />
  </HomeStack.Navigator>
);

const DirectoryStackNavigator = () => (
  <DirectoryStack.Navigator screenOptions={{ headerShown: false }}>
    <DirectoryStack.Screen name="Directory" component={Directory} />
    <DirectoryStack.Screen name="Details" component={Details} />
  </DirectoryStack.Navigator>
);

const ServicesStackNavigator = () => (
  <ServicesStack.Navigator
    screenOptions={{
      headerShown: false,
      headerTitleStyle: {
        fontFamily: 'Outfit-Semibold',
      },
    }}>
    <ServicesStack.Screen name="Services" component={Services} />
    <ServicesStack.Screen
      name="SellItem"
      component={SellItem}
      options={{ headerShown: true, title: 'Sell an Item' }}
    />
    <ServicesStack.Screen name="RoomFinder" component={RoomFinder} />
    <ServicesStack.Screen
      name="PostRoom"
      component={PostRoom}
      options={{ headerShown: true, title: 'Post a Room' }}
    />
    <ServicesStack.Screen name="Details" component={Details} />
  </ServicesStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerShown: false,
      headerTitleStyle: {
        fontFamily: 'Outfit-Semibold',
      },
    }}>
    <ProfileStack.Screen name="Profile" component={Profile} />
    <ProfileStack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="JoinProfessionalNetwork"
      component={JoinProfessionalNetwork}
      options={{ headerShown: true, title: 'Join Professional Network' }}
    />
    <ProfileStack.Screen
      name="ProfessionalNetwork"
      component={ProfessionalNetwork}
      options={{ headerShown: true, title: 'Professional Network' }}
    />
    <ProfileStack.Screen
      name="CommunityGuidelines"
      component={ProfileCommunityGuidelines}
      options={{ headerShown: true, title: 'Community Guidelines' }}
    />
    <ProfileStack.Screen name="SubmitListing" component={SubmitListing} />
    <ProfileStack.Screen name="Details" component={Details} />
  </ProfileStack.Navigator>
);

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
              component={HomeStackNavigator}
              options={{
                title: 'Home',
                tabBarLabel: 'Home',
                tabBarIcon: renderHomeIcon,
              }}
            />
            <Tab.Screen
              name="Directory"
              component={DirectoryStackNavigator}
              options={{
                title: 'Directory',
                tabBarLabel: 'Directory',
                tabBarIcon: renderDirectoryIcon,
              }}
            />
            <Tab.Screen
              name="Services"
              component={ServicesStackNavigator}
              options={{
                title: 'Services',
                tabBarLabel: 'Services',
                tabBarIcon: renderServicesIcon,
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileStackNavigator}
              options={{
                title: 'Profile',
                tabBarLabel: 'Profile',
                tabBarIcon: renderProfileIcon,
              }}
            />
          </Tab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen name="MarketItemDetails" component={MarketItemDetails} />
      <Stack.Screen name="RoomDetails" component={RoomDetails} />
    </Stack.Navigator>
  );
};

