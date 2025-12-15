import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, TextField, Button, Image } from '@/components/atoms';
import { ForgotPasswordScreenProps, ForgotPasswordFormData } from './types';
import { styles } from './styles';
import { images } from '@/assets/images/images';

const ForgotPassword: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});

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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendResetLink = () => {
    if (validateForm()) {
      // TODO: Implement send reset link logic
      console.log('Send reset link to:', formData.email);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
          title="Send Reset Link"
          variant="primary"
          size="large"
          fullWidth
          onPress={handleSendResetLink}
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
