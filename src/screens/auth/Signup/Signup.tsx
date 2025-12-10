import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthScreenProps } from '@/navigation/types';
import { colors } from '@/theme';

type SignupScreenProps = AuthScreenProps<'Signup'>;

const Signup = ({ navigation }: SignupScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Go to Login</Text>
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
    backgroundColor: colors.secondary[500],
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

export default Signup;