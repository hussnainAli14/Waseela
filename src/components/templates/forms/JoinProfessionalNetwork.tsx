import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Button, Checkbox, TextField } from '@/components/atoms';
import { Dropdown, CityDropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './JoinProfessionalNetwork.styles';
import {
  launchImageLibrary,
  type Asset,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createProfessional } from '@/store/slices/professionalsSlice';
import type { ProfessionalFormData } from '@/types/firestore';

const industryOptions = [
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Education', value: 'education' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Legal', value: 'legal' },
  { label: 'Business', value: 'business' },
  { label: 'Creative', value: 'creative' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Retail', value: 'retail' },
  { label: 'Other', value: 'other' },
];

const JoinProfessionalNetwork: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { isLoading } = useAppSelector(state => state.professionals);

  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [bio, setBio] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [offerMentorship, setOfferMentorship] = useState(false);
  const [offerCareerAdvice, setOfferCareerAdvice] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [photo, setPhoto] = useState<Asset | null>(null);
  const [confirm, setConfirm] = useState(false);

  const addExpertise = () => {
    const value = expertiseInput.trim();
    if (!value || expertise.includes(value) || expertise.length >= 6) {
      return;
    }
    setExpertise(prev => [...prev, value]);
    setExpertiseInput('');
  };

  const removeExpertise = (value: string) => {
    setExpertise(prev => prev.filter(item => item !== value));
  };

  const handlePickPhoto = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
    };
    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel || !result.assets?.length) {
        return;
      }
      setPhoto(result.assets[0]);
    } catch {
      Alert.alert('Upload failed', 'Unable to select photo right now. Please try again.');
    }
  };

  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return false;
    }
    if (!jobTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter your job title.');
      return false;
    }
    if (!industry) {
      Alert.alert('Validation Error', 'Please select an industry.');
      return false;
    }
    if (!location) {
      Alert.alert('Validation Error', 'Please select your location.');
      return false;
    }
    if (!bio.trim()) {
      Alert.alert('Validation Error', 'Please enter your professional bio.');
      return false;
    }
    if (expertise.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one area of expertise.');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address.');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }
    if (!confirm) {
      Alert.alert('Validation Error', 'Please confirm that you agree to the terms.');
      return false;
    }
    if (!user?.uid) {
      Alert.alert('Authentication Error', 'You must be logged in to join the professional network.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Double-check user is authenticated
    if (!user?.uid) {
      Alert.alert('Authentication Error', 'You must be logged in to join the professional network.');
      return;
    }

    try {
      // Format experience as "X years" if provided
      const experienceFormatted = experience.trim()
        ? `${experience.trim()} years`
        : undefined;

      // Prepare form data - only include fields with values (no undefined)
      const formData: ProfessionalFormData = {
        fullName: fullName.trim(),
        profession: jobTitle.trim(),
        industry: industry,
        location: location.trim(),
        bio: bio.trim(),
        skills: expertise,
        email: email.trim(),
      };

      // Add optional fields only if they have values
      const companyTrimmed = company.trim();
      if (companyTrimmed) {
        formData.company = companyTrimmed;
      }

      if (experienceFormatted) {
        formData.experience = experienceFormatted;
      }

      const educationTrimmed = education.trim();
      if (educationTrimmed) {
        formData.education = educationTrimmed;
      }

      const phoneTrimmed = phone.trim();
      if (phoneTrimmed) {
        formData.phone = phoneTrimmed;
      }

      const linkedinTrimmed = linkedin.trim();
      if (linkedinTrimmed) {
        formData.linkedIn = linkedinTrimmed;
      }

      // Extract profile photo URI if selected, otherwise use empty string
      const profilePhotoUri = photo?.uri || '';

      // Dispatch the create professional action with actual photo (or empty string)
      // user.uid is guaranteed to exist due to validation check above
      const result = await dispatch(
        createProfessional({
          data: formData,
          userId: user!.uid,
          profilePhoto: profilePhotoUri, // Uses actual photo if selected, empty string if not
        })
      ).unwrap();

      if (result) {
        Alert.alert(
          'Success!',
          'Your professional profile has been submitted. It will be visible to community members once approved.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFullName('');
                setJobTitle('');
                setCompany('');
                setIndustry('');
                setLocation('');
                setExperience('');
                setEducation('');
                setBio('');
                setExpertise([]);
                setExpertiseInput('');
                setEmail('');
                setPhone('');
                setLinkedin('');
                setPhoto(null);
                setConfirm(false);
                setOfferMentorship(false);
                setOfferCareerAdvice(false);
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Error creating professional profile:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create professional profile. Please try again.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <Text variant="md-semibold" style={styles.infoTitle}>
              About This Network
            </Text>
            <Text variant="sm-normal" style={styles.infoBody}>
              Join our community of Shia professionals offering mentorship and career guidance. Help
              fellow community members navigate their careers and professional development.
            </Text>
          </View>

          <View style={styles.card}>
            <TextField
              label="Full Name"
              placeholder="e.g., Dr. Ahmed Hassan"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextField
              label="Current Job Title"
              placeholder="e.g., Senior Software Engineer"
              value={jobTitle}
              onChangeText={setJobTitle}
            />
            <TextField
              label="Current Company/Organization"
              placeholder="e.g., Google, NHS, Self-Employed"
              value={company}
              onChangeText={setCompany}
            />
            <Text variant="md-semibold" style={styles.label}>
              Industry
            </Text>
            <Dropdown
              options={industryOptions}
              selectedValue={industry}
              onSelect={setIndustry}
              placeholder="Select..."
              buttonStyle={styles.dropdownButton}
              buttonTextStyle={styles.dropdownText}
            />
            <View style={{ marginBottom: 16 }}>
              <Text variant="sm-medium" style={{ marginBottom: 8, color: colors.text.secondary }}>
                Location *
              </Text>
              <CityDropdown
                selectedValue={location}
                onSelect={setLocation}
                placeholder="Select city"
                includeAllOption={false}
                valueFormat="capitalized"
              />
            </View>
            <TextField
              label="Years of Experience"
              placeholder="e.g., 10"
              keyboardType="number-pad"
              value={experience}
              onChangeText={setExperience}
            />
            <TextField
              label="Education (Optional)"
              placeholder="e.g., MBBS, MD Cardiology"
              value={education}
              onChangeText={setEducation}
            />
            <TextField
              label="Professional Bio"
              placeholder="Share your professional background, what you're passionate about, and how you'd like to help others in the community..."
              multiline
              numberOfLines={5}
              value={bio}
              onChangeText={setBio}
              inputContainerStyle={styles.textareaContainer}
              inputStyle={styles.textareaInput}
            />
            <Text variant="sm-normal" style={styles.helperText}>
              Be authentic and welcoming
            </Text>
          </View>

          <View style={styles.card}>
            <Text variant="md-semibold" style={styles.label}>
              Areas of Expertise (Up to 6)
            </Text>
            <View style={styles.chipsRow}>
              <TextInput
                style={styles.chipInput}
                placeholder="e.g., Software Engineering, Cloud Computing"
                placeholderTextColor={colors.text.secondary}
                value={expertiseInput}
                onChangeText={setExpertiseInput}
                onSubmitEditing={addExpertise}
                returnKeyType="done"
              />
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={addExpertise}
                style={styles.chipAddButton}>
                <Text variant="md-medium" style={styles.chipAddText}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
            <Text variant="sm-normal" style={styles.helperText}>
              {expertise.length}/6 areas
            </Text>
            <View style={styles.chipList}>
              {expertise.map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.chip}
                  activeOpacity={0.85}
                  onPress={() => removeExpertise(item)}>
                  <Text variant="sm-medium" style={styles.chipText}>
                    {item}
                  </Text>
                  <Ionicons
                    name="close"
                    size={14}
                    color={colors.text.secondary}
                    style={styles.chipIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text variant="md-semibold" style={styles.label}>
              What I Can Offer
            </Text>
            <View style={styles.checkboxRow}>
              <Checkbox checked={offerMentorship} onPress={() => setOfferMentorship(!offerMentorship)} />
              <Text variant="sm-normal" style={styles.checkboxText}>
                Mentorship — One-on-one guidance and long-term support for career development
              </Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox
                checked={offerCareerAdvice}
                onPress={() => setOfferCareerAdvice(!offerCareerAdvice)}
              />
              <Text variant="sm-normal" style={styles.checkboxText}>
                Career Advice — General career guidance, CV reviews, interview tips, and industry insights
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <TextField
              label="Email Address"
              placeholder="professional.email@example.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              rightIcon={<Ionicons name="mail-outline" size={18} color={colors.text.secondary} />}
            />
            <Text variant="sm-normal" style={styles.helperText}>
              This will be visible to those seeking guidance
            </Text>
            <TextField
              label="Phone Number (Optional)"
              placeholder="+447700900002"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TextField
              label="LinkedIn Profile (Optional)"
              placeholder="linkedin.com/in/yourprofile"
              value={linkedin}
              onChangeText={setLinkedin}
            />
            <Text variant="md-semibold" style={[styles.label, { marginTop: 6 }]}>
              Professional Photo
            </Text>
            {photo?.uri ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: photo.uri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setPhoto(null)}
                  activeOpacity={0.8}>
                  <Ionicons name="close-circle" size={28} color={colors.status.error} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={handlePickPhoto}
                  activeOpacity={0.85}>
                  <Ionicons name="camera-outline" size={18} color={colors.primary[600]} />
                  <Text variant="sm-medium" style={styles.changeImageText}>
                    Change Photo
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.uploadCard}
                onPress={handlePickPhoto}>
                <Ionicons name="cloud-upload-outline" size={32} color={colors.text.secondary} />
                <Text variant="md-medium" style={styles.uploadTitle}>
                  Upload a professional headshot
                </Text>
                <Text variant="sm-normal" style={styles.uploadSubtitle}>
                  PNG, JPG up to 5MB
                </Text>
              </TouchableOpacity>
            )}
            <View style={[styles.checkboxRow, { marginTop: 12 }]}>
              <Checkbox checked={confirm} onPress={() => setConfirm(!confirm)} />
              <Text variant="sm-normal" style={styles.checkboxText}>
                I confirm that I am willing to volunteer my time to help community members and that
                all information provided is accurate.
              </Text>
            </View>
          </View>

          <View style={styles.guidelinesCard}>
            <Text variant="md-semibold" style={[styles.label, { marginBottom: 8 }]}>
              Community Guidelines
            </Text>
            <Text variant="sm-normal" style={styles.guidelineItem}>
              • Be respectful and professional in all interactions
            </Text>
            <Text variant="sm-normal" style={styles.guidelineItem}>
              • Respond to messages within a reasonable timeframe
            </Text>
            <Text variant="sm-normal" style={styles.guidelineItem}>
              • Set clear boundaries about your availability
            </Text>
            <Text variant="sm-normal" style={[styles.guidelineItem, { marginBottom: 0 }]}>
              • Remember you're representing our community
            </Text>
          </View>

          <Button
            title={isLoading ? 'Submitting...' : 'Join Professional Network'}
            fullWidth
            onPress={handleSubmit}
            disabled={isLoading}
            containerStyle={[styles.buttonSpacing, styles.primaryButton]}
          />
          {isLoading && (
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <ActivityIndicator size="small" color={colors.primary[500]} />
            </View>
          )}
          <Text variant="sm-normal" style={styles.bottomInfo}>
            Your profile will be visible to all community members
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default JoinProfessionalNetwork;


