import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, TextField, Button, Image } from '@/components/atoms';
import { SignupScreenProps, SignupFormData } from './types';
import { styles } from './styles';
import { images } from '@/assets/images/images';

const Signup: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (validateForm()) {
      // TODO: Implement sign up logic
      console.log('Sign up:', formData);
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
            Create Account
          </Text>
          <Text variant="md-normal" style={styles.subtitle}>
            Join us and start your journey
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextField
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={value => handleInputChange('fullName', value)}
            error={errors.fullName}
            autoCapitalize="words"
            autoComplete="name"
            leftIcon={
              <Ionicons name="person-outline" size={20} style={styles.icon} />
            }
          />

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

          <TextField
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={value => handleInputChange('password', value)}
            error={errors.password}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password-new"
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
            }
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  style={styles.icon}
                />
              </TouchableOpacity>
            }
          />

          <TextField
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={value => handleInputChange('confirmPassword', value)}
            error={errors.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoComplete="password-new"
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
            }
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  style={styles.icon}
                />
              </TouchableOpacity>
            }
          />
        </View>

        <Button
          title="Sign Up"
          variant="primary"
          size="large"
          fullWidth
          onPress={handleSignUp}
          containerStyle={styles.signUpButton}
        />

        <View style={styles.signInContainer}>
          <Text variant="md-normal" style={styles.signInText}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text variant="md-semibold" style={styles.signInLink}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
