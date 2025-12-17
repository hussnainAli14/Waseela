import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text as RNText,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Button, Checkbox } from '@/components/atoms';
import { AgeVerificationScreenProps } from './types';
import { styles } from './styles';
import { colors } from '@/theme';

type AgeCategory = 'unknown' | 'under13' | '13to15' | '16plus';

const AgeVerification: React.FC<AgeVerificationScreenProps> = ({
  navigation,
}) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [parentalConsent, setParentalConsent] = useState(false);
  const [parentEmail, setParentEmail] = useState('');
  const [errors, setErrors] = useState<{
    dateOfBirth?: string;
    consent?: string;
    parentEmail?: string;
  }>({});
  const [ageCategory, setAgeCategory] = useState<AgeCategory>('unknown');
  const [hasAttemptedVerify, setHasAttemptedVerify] = useState(false);

  const handleDayChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setDay(numericValue);
  };

  const handleMonthChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setMonth(numericValue);
  };

  const handleYearChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setYear(numericValue);
  };

  const calculateAge = (day: string, month: string, year: string): number | null => {
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (
      isNaN(dayNum) ||
      isNaN(monthNum) ||
      isNaN(yearNum) ||
      dayNum < 1 ||
      dayNum > 31 ||
      monthNum < 1 ||
      monthNum > 12 ||
      yearNum < 1900 ||
      yearNum > new Date().getFullYear()
    ) {
      return null;
    }

    const birthDate = new Date(yearNum, monthNum - 1, dayNum);
    const today = new Date();

    // Check if date is valid
    if (
      birthDate.getDate() !== dayNum ||
      birthDate.getMonth() !== monthNum - 1 ||
      birthDate.getFullYear() !== yearNum
    ) {
      return null;
    }

    let age = today.getFullYear() - yearNum;
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  const validateDate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!day.trim() || !month.trim() || !year.trim()) {
      newErrors.dateOfBirth = 'Please enter your complete date of birth';
      setErrors(newErrors);
      return false;
    }

    const age = calculateAge(day, month, year);

    if (age === null) {
      newErrors.dateOfBirth = 'Please enter a valid date of birth';
      setErrors(newErrors);
      return false;
    }

    if (age < 13) {
      setAgeCategory('under13');
    } else if (age >= 13 && age < 16) {
      setAgeCategory('13to15');
    } else {
      setAgeCategory('16plus');
    }

    setErrors({});
    return true;
  };

  const validateParentalConsent = (): boolean => {
    const newErrors: typeof errors = {};

    if (!parentalConsent) {
      newErrors.consent = 'Parental consent is required';
    }

    if (!parentEmail.trim()) {
      newErrors.parentEmail = 'Parent/Guardian email is required';
    } else if (!/\S+@\S+\.\S+/.test(parentEmail)) {
      newErrors.parentEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = () => {
    setHasAttemptedVerify(true);
    
    if (!validateDate()) {
      return;
    }

    if (ageCategory === 'under13') {
      return; // Cannot proceed
    }

    if (ageCategory === '13to15') {
      if (!validateParentalConsent()) {
        return;
      }
    }

    // Navigate to Signup
    navigation.navigate('Signup');
  };

  // Update age category when date changes
  React.useEffect(() => {
    if (!day || !month || !year) {
      setAgeCategory('unknown');
      return;
    }

    const age = calculateAge(day, month, year);
    if (age === null) {
      setAgeCategory('unknown');
      return;
    }

    if (age < 13) {
      setAgeCategory('under13');
    } else if (age >= 13 && age < 16) {
      setAgeCategory('13to15');
    } else {
      setAgeCategory('16plus');
    }

    if (!hasAttemptedVerify) {
      setErrors({});
    }
  }, [day, month, year, hasAttemptedVerify]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.iconContainer}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name="calendar-outline"
              size={32}
              color={colors.common.white}
            />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text variant="3xl-bold" style={styles.title}>
            Age Verification
          </Text>
          <Text variant="md-normal" style={styles.subtitle}>
            Please confirm your date of birth
          </Text>
        </View>

        <View style={styles.ageRequirementsBox}>
          <View style={styles.ageRequirementsHeader}>
            <View style={styles.infoIconContainer}>
              <Ionicons
                name="information"
                size={20}
                color={colors.primary[500]}
              />
            </View>
            <Text variant="md-semibold" style={styles.ageRequirementsTitle}>
              Age Requirements:
            </Text>
          </View>
          <View style={styles.bulletPoints}>
            <Text variant="sm-normal" style={styles.bulletPoint}>
              • <RNText style={styles.bulletPointBold}>16+:</RNText> Can use Wasila independently
            </Text>
            <Text variant="sm-normal" style={styles.bulletPoint}>
              • <RNText style={styles.bulletPointBold}>13-15:</RNText> Requires parental/guardian consent
            </Text>
            <Text variant="sm-normal" style={styles.bulletPoint}>
              • <RNText style={styles.bulletPointBold}>Under 13:</RNText> Not permitted to use the platform
            </Text>
          </View>
          <Text variant="xs-normal" style={styles.complianceText}>
            This complies with UK GDPR and the Children's Code (Age Appropriate
            Design Code)
          </Text>
        </View>

        <View style={styles.dateInputSection}>
          <Text variant="md-semibold" style={styles.dateLabel}>
            Date of Birth *
          </Text>
          <View style={styles.dateInputsContainer}>
            <View style={styles.dateInputWrapper}>
              <TextInput
                style={styles.dateInput}
                placeholder="DD"
                placeholderTextColor={colors.text.secondary}
                value={day}
                onChangeText={handleDayChange}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text variant="xs-normal" style={styles.dateInputLabel}>
                Day
              </Text>
            </View>
            <View style={styles.dateInputWrapper}>
              <TextInput
                style={styles.dateInput}
                placeholder="MM"
                placeholderTextColor={colors.text.secondary}
                value={month}
                onChangeText={handleMonthChange}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text variant="xs-normal" style={styles.dateInputLabel}>
                Month
              </Text>
            </View>
            <View style={styles.dateInputWrapper}>
              <TextInput
                style={styles.dateInput}
                placeholder="YYYY"
                placeholderTextColor={colors.text.secondary}
                value={year}
                onChangeText={handleYearChange}
                keyboardType="number-pad"
                maxLength={4}
              />
              <Text variant="xs-normal" style={styles.dateInputLabel}>
                Year
              </Text>
            </View>
          </View>
          {errors.dateOfBirth && (
            <Text variant="sm-normal" style={styles.errorText}>
              {errors.dateOfBirth}
            </Text>
          )}
        </View>

        {/* Parental consent form for 13-15 */}
        {ageCategory === '13to15' && (
          <View style={styles.consentBox}>
            <View style={styles.consentHeader}>
              <View style={styles.consentIconContainer}>
                <Ionicons
                  name="people-outline"
                  size={24}
                  color={colors.common.white}
                />
              </View>
              <Text variant="md-semibold" style={styles.consentTitle}>
                Parental Consent Required
              </Text>
            </View>
            <Text variant="sm-normal" style={styles.consentDescription}>
              As you are under 16, a parent or guardian must provide consent
              for you to use Wasila.
            </Text>
            <View style={styles.checkboxContainer}>
              <Checkbox
                checked={parentalConsent}
                onPress={() => setParentalConsent(!parentalConsent)}
                label="I confirm that my parent or legal guardian has given consent for me to create an account and use Wasila *"
                size="medium"
              />
            </View>
            {errors.consent && (
              <Text variant="sm-normal" style={styles.errorText}>
                {errors.consent}
              </Text>
            )}
            <View style={styles.parentEmailSection}>
              <Text variant="md-semibold" style={styles.parentEmailLabel}>
                Parent/Guardian Email *
              </Text>
              <TextInput
                style={[
                  styles.parentEmailInput,
                  errors.parentEmail && styles.parentEmailInputError,
                ]}
                placeholder="parent.email@example.com"
                placeholderTextColor={colors.text.secondary}
                value={parentEmail}
                onChangeText={value => {
                  setParentEmail(value);
                  if (errors.parentEmail) {
                    setErrors(prev => ({ ...prev, parentEmail: undefined }));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {errors.parentEmail && (
                <Text variant="sm-normal" style={styles.errorText}>
                  {errors.parentEmail}
                </Text>
              )}
              <Text variant="xs-normal" style={styles.helperText}>
                We'll send a consent verification email to this address
              </Text>
            </View>
            {errors.consent && !parentalConsent && (
              <View style={styles.consentErrorBox}>
                <Text variant="sm-normal" style={styles.consentErrorText}>
                  Users aged 13-15 require parental or guardian consent. Please
                  check the box and provide a parent/guardian email address.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Error message for under 13 */}
        {hasAttemptedVerify && ageCategory === 'under13' && (
          <View style={styles.errorBox}>
            <Text variant="sm-normal" style={styles.errorBoxText}>
              You must be at least 13 years old to use Wasila with parental
              consent, or 16 years old to use independently. For more
              information, please contact support@wasila.uk
            </Text>
          </View>
        )}

        <Button
          title="Verify Age & Continue"
          variant="primary"
          size="large"
          fullWidth
          onPress={handleVerify}
          containerStyle={styles.verifyButton}
        />

        <View style={styles.privacyNoticeBox}>
          <Text variant="md-semibold" style={styles.privacyNoticeTitle}>
            Privacy Notice:
          </Text>
          <Text variant="sm-normal" style={styles.privacyNoticeText}>
            Your date of birth is used solely for age verification and
            safeguarding compliance. It is processed in accordance with UK GDPR
            and stored securely. It will not be shared with third parties or
            displayed publicly.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AgeVerification;

