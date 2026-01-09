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
import { useAppSelector } from '@/store/hooks';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none', // No animation when switching between auth/main
      }}
      initialRouteName={isAuthenticated ? 'Main' : 'Auth'}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
};
