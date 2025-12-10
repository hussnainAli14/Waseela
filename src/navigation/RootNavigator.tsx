/**
 * Root Navigator
 * Manages the top-level navigation structure
 * Switches between Auth and Main navigators based on authentication state
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

// TODO: Replace with actual authentication state management
// This should come from your auth context/store
const isAuthenticated = false;

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none', // No animation when switching between auth/main
      }}
      initialRouteName={isAuthenticated ? 'Main' : 'Auth'}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  );
};

