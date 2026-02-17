/**
 * Main App Component
 * Sets up navigation and app-wide providers
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { RootNavigator, navigationRef } from '@/navigation';
import { colors } from '@/theme';
import { loadUser } from '@/store/slices/authSlice';
import { persistor, store } from '@/store';
import { firebaseAuth } from '@/config/firebase';

function App() {
  useEffect(() => {
    // Listen to auth state changes
    // Firebase should be initialized by now since we imported @react-native-firebase/app
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, load user data
        store.dispatch(loadUser(user));
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={colors.background.light}
            />
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
