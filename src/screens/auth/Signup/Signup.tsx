import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Text, TextField, Button, Image, Checkbox } from '@/components/atoms';
import { SignupScreenProps, SignupFormData } from './types';
import { styles } from './styles';
import { images } from '@/assets/images/images';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signUp, clearError } from '@/store/slices/authSlice';
import { RootStackParamList } from '@/navigation/types';

const Signup: React.FC<SignupScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);
  const rootNavigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    processing: false,
    guidelines: false,
    marketing: false,
  });
  const [agreementsError, setAgreementsError] = useState<string | null>(null);
  const [showDisclaimers, setShowDisclaimers] = useState(false);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Navigate to main screen when authenticated
    if (isAuthenticated) {
      rootNavigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  }, [isAuthenticated, rootNavigation]);

  useEffect(() => {
    // Show error alert if authentication fails
    if (error) {
      Alert.alert('Sign Up Failed', error);
    }
  }, [error]);

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

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dob);
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 16) {
        newErrors.dob = 'You must be at least 16 years old';
      }
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

    const { terms, privacy, processing, guidelines } = agreements;
    const allRequiredChecked = terms && privacy && processing && guidelines;

    if (!allRequiredChecked) {
      setAgreementsError('Please review and accept all required agreements.');
    } else {
      setAgreementsError(null);
    }

    return Object.keys(newErrors).length === 0 && allRequiredChecked;
  };

  const handleSignUp = async () => {
    if (validateForm()) {
      await dispatch(signUp({
        email: formData.email.trim(),
        password: formData.password,
        displayName: formData.fullName.trim(),
        dob: formData.dob,
      }));
    }
  };

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      const { terms, privacy, processing, guidelines } = updated;
      if (terms && privacy && processing && guidelines) {
        setAgreementsError(null);
      }
      return updated;
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('dob', selectedDate.toISOString());
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
            Join the Wasila community
          </Text>
        </View>

        <View style={styles.dataProtectionCard}>
          <View style={styles.dataProtectionHeader}>
            <View style={styles.dataProtectionIconWrapper}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={styles.dataProtectionIcon.color}
              />
            </View>
            <Text variant="md-semibold" style={styles.dataProtectionTitle}>
              Your Data Protection Rights
            </Text>
          </View>
          <Text variant="sm-normal" style={styles.dataProtectionText}>
            Under UK GDPR, you have the right to access, rectify, erase, restrict
            processing, data portability, and object to processing of your
            personal data.
          </Text>
          <TouchableOpacity>
            <Text variant="sm-semibold" style={styles.dataProtectionLink}>
              View full data protection notice
            </Text>
          </TouchableOpacity>
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

          <View style={{ marginBottom: 16 }}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
              <View pointerEvents="none">
                <TextField
                  label="Date of Birth (DD/MM/YYYY)"
                  placeholder="Select your date of birth"
                  value={formData.dob ? new Date(formData.dob).toLocaleDateString('en-GB') : ''}
                  editable={false}
                  error={errors.dob}
                  leftIcon={
                    <Ionicons name="calendar-outline" size={20} style={styles.icon} />
                  }
                />
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.dob ? new Date(formData.dob) : new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

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

        <View style={styles.agreementsSection}>
          <Text variant="md-semibold" style={styles.agreementsTitle}>
            Required Agreements *
          </Text>

          <View style={styles.checkboxGroup}>
            <Checkbox
              checked={agreements.terms}
              onPress={() => toggleAgreement('terms')}
              label="I agree to the Terms of Service and confirm I am at least 16 years old or have parental consent *"
            />
            <Checkbox
              checked={agreements.privacy}
              onPress={() => toggleAgreement('privacy')}
              label="I have read and accept the Privacy Policy and understand how my data will be processed *"
            />
            <Checkbox
              checked={agreements.processing}
              onPress={() => toggleAgreement('processing')}
              label="I consent to Wasila processing my personal data to provide community services, verify my age, and ensure platform safety in accordance with UK GDPR *"
            />
            <Checkbox
              checked={agreements.guidelines}
              onPress={() => toggleAgreement('guidelines')}
              label="I agree to follow the Community Guidelines and understand the safeguarding policies *"
            />
          </View>

          {agreementsError && (
            <Text variant="sm-normal" style={styles.agreementsError}>
              {agreementsError}
            </Text>
          )}

          <Text variant="md-semibold" style={styles.optionalTitle}>
            Optional (You can change this later)
          </Text>
          <Checkbox
            checked={agreements.marketing}
            onPress={() => toggleAgreement('marketing')}
            label="I consent to receive community updates, newsletters, and promotional emails from Wasila. You can unsubscribe at any time."
          />
        </View>

        <Button
          title={isLoading ? 'Creating Account...' : 'Create Account'}
          variant="primary"
          size="large"
          fullWidth
          onPress={handleSignUp}
          disabled={isLoading}
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

        <TouchableOpacity
          style={styles.disclaimerRow}
          onPress={() => setShowDisclaimers(prev => !prev)}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={styles.disclaimerIcon.color}
          />
          <Text variant="sm-normal" style={styles.disclaimerText}>
            {showDisclaimers ? 'Hide disclaimers' : 'View important disclaimers'}
          </Text>
        </TouchableOpacity>

        {showDisclaimers && (
          <View style={styles.legalDisclaimerCard}>
            <View style={styles.legalDisclaimerHeader}>
              <Ionicons
                name="warning-outline"
                size={18}
                color={styles.legalDisclaimerIcon.color}
              />
              <Text variant="md-semibold" style={styles.legalDisclaimerTitle}>
                Legal Disclaimer
              </Text>
            </View>

            <Text variant="sm-normal" style={styles.legalDisclaimerText}>
              Wasila is a community platform connecting Shia Muslims with local
              businesses and services. We are not responsible for the quality,
              legality, or safety of services provided by third parties listed on
              our platform. All transactions and interactions are between users
              and third-party providers at their own risk.
            </Text>

            <Text variant="sm-semibold" style={styles.legalSectionTitle}>
              Age Verification & Online Safety
            </Text>
            <Text variant="sm-normal" style={styles.legalDisclaimerText}>
              By creating an account, you confirm you are at least 16 years old.
              Users aged 13-15 must have explicit parental or guardian consent.
              We implement age-appropriate safeguarding measures in compliance
              with the UK Online Safety Act 2023 and Children's Code (Age
              Appropriate Design Code).
            </Text>

            <Text variant="sm-semibold" style={styles.legalSectionTitle}>
              Personal Information & Safety
            </Text>
            <Text variant="sm-normal" style={styles.legalDisclaimerText}>
              Never share sensitive personal information (home address, phone
              number, financial details) in public listings or messages. Always
              meet in public places for transactions. Report suspicious activity
              immediately. Wasila is not designed for the collection of sensitive
              personal data or children's data beyond age verification.
            </Text>

            <Text variant="sm-semibold" style={styles.legalSectionTitle}>
              Content Moderation
            </Text>
            <Text variant="sm-normal" style={styles.legalDisclaimerText}>
              All user-generated content is subject to moderation. We reserve the
              right to remove content or suspend accounts that violate our
              Community Guidelines. However, we cannot guarantee all content is
              monitored in real-time.
            </Text>

            <Text variant="sm-semibold" style={styles.legalSectionTitle}>
              Data Breach Notification
            </Text>
            <Text variant="sm-normal" style={styles.legalDisclaimerText}>
              In the event of a data breach affecting your personal data, we will
              notify you and the ICO within 72 hours as required by UK GDPR.
            </Text>

            <Text variant="sm-semibold" style={styles.legalSectionTitle}>
              Right to Withdraw Consent
            </Text>
            <Text variant="sm-normal" style={styles.legalDisclaimerText}>
              You can withdraw your consent and delete your account at any time
              through your profile settings. Your data will be permanently
              deleted within 30 days, except where we are legally required to
              retain it.
            </Text>

            <View style={styles.legalDivider} />

            <Text variant="sm-semibold" style={styles.legalSectionTitle}>
              Contact for Data Protection & Safeguarding Concerns:
            </Text>
            <Text variant="sm-normal" style={styles.legalDisclaimerText}>
              Email: dataprotection@wasila.uk{'\n'}
              Safeguarding: safeguarding@wasila.uk{'\n'}
              ICO Complaints: ico.org.uk
            </Text>
          </View>
        )}

        <View style={styles.verificationCard}>
          <View style={styles.verificationHeader}>
            <View style={styles.verificationIconWrapper}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={styles.verificationIcon.color}
              />
            </View>
            <Text variant="md-semibold" style={styles.verificationTitle}>
              Account Verification Required
            </Text>
          </View>
          <Text variant="sm-normal" style={styles.verificationText}>
            You'll receive a verification email. Your account and any submitted
            listings will be reviewed by our moderation team to ensure community
            safety.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
