import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthScreenProps } from '@/navigation/types';
import { colors } from '@/theme';
import { navigationRef } from '@/navigation';
import { CommonActions } from '@react-navigation/native';

type LoginScreenProps = AuthScreenProps<'Login'>;

const Login = ({ navigation }: LoginScreenProps) => {
  const handleNavigateToHome = () => {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.navigate({
          name: 'Main',
          params: {
            screen: 'Home',
          },
        }),
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateToHome}>
        <Text style={styles.buttonText}>Go to Home Page</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.buttonText}>Go to Signup</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.secondaryButtonText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Outfit-Bold',
    color: colors.text.primary,
    marginBottom: 40,
  },
  button: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.common.white,
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: colors.primary[600],
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
  },
});

export default Login;