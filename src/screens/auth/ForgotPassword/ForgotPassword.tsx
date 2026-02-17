import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, TextField, Button, Image } from '@/components/atoms';
import { ForgotPasswordScreenProps, ForgotPasswordFormData } from './types';
import { styles } from './styles';
import { images } from '@/assets/images/images';
import { firebaseAuth } from '@/config/firebase';
import { colors } from '@/theme';

const ForgotPassword: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof ForgotPasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ForgotPasswordFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      // More robust email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Email is invalid';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendResetLink = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Normalize email: trim, lowercase, and ensure proper format
      const normalizedEmail = formData.email.trim().toLowerCase();
      
      // Additional validation before sending
      if (!normalizedEmail || !normalizedEmail.includes('@')) {
        Alert.alert('Error', 'Please enter a valid email address.');
        setIsLoading(false);
        return;
      }

      await firebaseAuth.sendPasswordResetEmail(normalizedEmail);
      
      Alert.alert(
        'Reset Link Sent',
        'We\'ve sent a password reset link to your email address. Please check your inbox and follow the instructions.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to send reset link. Please check your internet connection and try again.';
      
      // Handle specific Firebase Auth error codes
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check and try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.code === 'auth/unknown' || error.code === 'auth/internal-error') {
        errorMessage = 'An internal error occurred. Please try again in a moment. If the problem persists, contact support.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image
            source={images.mainLogo}
            width={80}
            height={80}
            resizeMode="contain"
            containerStyle={styles.logo}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text variant="3xl-bold" style={styles.title}>
            Forgot Password?
          </Text>
          <Text variant="md-normal" style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset
            your password.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextField
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={value => handleInputChange('email', value)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon={
              <Ionicons name="mail-outline" size={20} style={styles.icon} />
            }
          />
        </View>

        <Button
          title={isLoading ? 'Sending...' : 'Send Reset Link'}
          variant="primary"
          size="large"
          fullWidth
          onPress={handleSendResetLink}
          disabled={isLoading}
          containerStyle={styles.sendButton}
        />

        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back-outline"
            size={20}
            style={[styles.icon, styles.backIcon]}
          />
          <Text variant="md-normal" style={styles.backText}>
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
