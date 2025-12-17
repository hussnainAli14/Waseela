import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Text, TextField, Button, Image } from '@/components/atoms';
import { LoginScreenProps, LoginFormData } from './types';
import { styles } from './styles';
import { images } from '@/assets/images/images';
import { RootStackParamList } from '@/navigation/types';

const Login: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const rootNavigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSignIn = () => {
    if (validateForm()) {
      rootNavigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
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

        <View style={styles.welcomeContainer}>
          <Text variant="3xl-bold" style={styles.welcomeTitle}>
            Welcome Back
          </Text>
          <Text variant="md-normal" style={styles.welcomeSubtitle}>
            Sign in to continue to your community
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextField
            label="Email Address"
            placeholder="your.email@example.com"
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
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={value => handleInputChange('password', value)}
            error={errors.password}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
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
        </View>

        <Button
          title="Sign In"
          variant="primary"
          size="large"
          fullWidth
          onPress={handleSignIn}
          containerStyle={styles.signInButton}
        />

        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text variant="md-medium" style={styles.forgotPasswordText}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text variant="md-normal" style={styles.dividerText}>
            Don't have an account?
          </Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          title="Create Account"
          variant="outline"
          size="large"
          fullWidth
          onPress={() => navigation.navigate('AgeVerification')}
          containerStyle={styles.createAccountButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
