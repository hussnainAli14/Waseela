import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthScreenProps } from '@/navigation/types';
import { colors } from '@/theme';

type ForgotPasswordScreenProps = AuthScreenProps<'ForgotPassword'>;

const ForgotPassword = ({ navigation }: ForgotPasswordScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Login</Text>
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
});

export default ForgotPassword;