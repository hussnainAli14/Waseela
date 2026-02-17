import React, { useState, useEffect } from 'react';
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
import { styles } from '@/components/templates/forms/JoinProfessionalNetwork.styles';
import {
  launchImageLibrary,
  type Asset,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProfessional } from '@/store/slices/professionalsSlice';
import type { ProfessionalFormData } from '@/types/firestore';
import { NavigationProp, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { MainStackParamList } from '@/navigation/types';

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

type EditProfessionalRoute = RouteProp<MainStackParamList, 'EditProfessional'>;

const EditProfessional: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<EditProfessionalRoute>();
  const { professional } = route.params;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { isLoading } = useAppSelector(state => state.professionals);

  const [fullName, setFullName] = useState(professional.name || '');
  const [jobTitle, setJobTitle] = useState(professional.title || '');
  const [company, setCompany] = useState(professional.company || '');
  const [industry, setIndustry] = useState(professional.industry || '');
  const [location, setLocation] = useState(professional.city || '');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [bio, setBio] = useState(professional.about || '');
  const [expertiseInput, setExpertiseInput] = useState('');
  const [expertise, setExpertise] = useState<string[]>(professional.tags || professional.expertise || []);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState(professional.linkedinUrl || '');
  const [photo, setPhoto] = useState<Asset | null>(null);
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null);

  const [confirm, setConfirm] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Get the actual professional from Redux to get email, phone, education, and location
  const { userProfessionals, userProfessional } = useAppSelector(state => state.professionals);
  const actualProfessional = userProfessionals.find(p => p.id === professional.id) || 
                             (userProfessional?.id === professional.id ? userProfessional : null);

  // Initialize existing photo, experience, email, phone, education, and location
  useEffect(() => {
    // Set existing photo from actual professional (it has profilePhoto field)
    if (actualProfessional?.profilePhoto) {
      setExistingPhoto(actualProfessional.profilePhoto);
    } else if (professional.avatar) {
      // Fallback to avatar from passed professional object
      if (typeof professional.avatar === 'string') {
        setExistingPhoto(professional.avatar);
      }
    }

    // Extract years from experience
    if (professional.yearsExperience) {
      setExperience(professional.yearsExperience.toString());
    } else if (actualProfessional?.experience) {
      const expStr = actualProfessional.experience;
      const match = expStr.match(/\d+/);
      if (match) {
        setExperience(match[0]);
      }
    }

    // Set email from actual professional (it has the email field)
    if (actualProfessional?.email) {
      setEmail(actualProfessional.email);
    } else if ((professional as any).email) {
      setEmail((professional as any).email);
    }

    // Set phone from actual professional
    if (actualProfessional?.phone) {
      setPhone(actualProfessional.phone);
    } else if ((professional as any).phone) {
      setPhone((professional as any).phone);
    }

    // Set education from actual professional
    if (actualProfessional?.education) {
      setEducation(actualProfessional.education);
    } else if ((professional as any).education) {
      setEducation((professional as any).education);
    }

    // Set location from actual professional (it's called 'location' in ProfessionalProfile, not 'city')
    if (actualProfessional?.location) {
      setLocation(actualProfessional.location);
    } else if (professional.city) {
      setLocation(professional.city);
    }
  }, [professional, actualProfessional]);

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
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }
    if (!jobTitle.trim()) {
      newErrors.jobTitle = 'Please enter your job title.';
    }
    if (!bio.trim()) {
      newErrors.bio = 'Please enter your professional bio.';
    }
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    setErrors(newErrors);

    if (!industry) {
      Alert.alert('Validation Error', 'Please select an industry.');
      return false;
    }
    if (!location) {
      Alert.alert('Validation Error', 'Please select your location.');
      return false;
    }
    if (expertise.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one area of expertise.');
      return false;
    }
    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    if (!confirm) {
      Alert.alert('Validation Error', 'Please confirm that you agree to the terms.');
      return false;
    }
    if (!user?.uid) {
      Alert.alert('Authentication Error', 'You must be logged in to update your professional profile.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.uid) {
      Alert.alert('Authentication Error', 'You must be logged in to update your professional profile.');
      return;
    }

    try {
      const experienceFormatted = experience.trim()
        ? `${experience.trim()} years`
        : undefined;

      const formData: Partial<ProfessionalFormData> = {
        fullName: fullName.trim(),
        profession: jobTitle.trim(),
        industry: industry,
        location: location.trim(),
        bio: bio.trim(),
        skills: expertise,
        email: email.trim(),
      };

      if (company.trim()) {
        formData.company = company.trim();
      }

      if (experienceFormatted) {
        formData.experience = experienceFormatted;
      }

      if (education.trim()) {
        formData.education = education.trim();
      }

      if (phone.trim()) {
        formData.phone = phone.trim();
      }

      if (linkedin.trim()) {
        formData.linkedIn = linkedin.trim();
      }

      const profilePhotoUri = photo?.uri || undefined;

      await dispatch(
        updateProfessional({
          professionalId: professional.id,
          data: formData,
          profilePhoto: profilePhotoUri,
        })
      ).unwrap();

      Alert.alert(
        'Success!',
        'Your professional profile has been updated.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error updating professional profile:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update professional profile. Please try again.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.headerRow}>
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
            <Text variant="lg-semibold" style={styles.headerTitle}>
              Edit Professional Profile
            </Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <TextField
              label="Full Name"
              placeholder="e.g., Dr. Ahmed Hassan"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
              }}
              error={errors.fullName}
            />
            <TextField
              label="Current Job Title"
              placeholder="e.g., Senior Software Engineer"
              value={jobTitle}
              onChangeText={(text) => {
                setJobTitle(text);
                if (errors.jobTitle) setErrors(prev => ({ ...prev, jobTitle: '' }));
              }}
              error={errors.jobTitle}
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
              onChangeText={(text) => {
                setBio(text);
                if (errors.bio) setErrors(prev => ({ ...prev, bio: '' }));
              }}
              inputContainerStyle={styles.textareaContainer}
              error={errors.bio}
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
            <TextField
              label="Email Address"
              placeholder="professional.email@example.com"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              rightIcon={<Ionicons name="mail-outline" size={18} color={colors.text.secondary} />}
              error={errors.email}
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
            {(photo?.uri || existingPhoto) ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: photo?.uri || existingPhoto || '' }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                  onError={(error) => {
                    console.error('Image load error:', error);
                    // If image fails to load, clear it
                    setExistingPhoto(null);
                  }}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => {
                    setPhoto(null);
                    setExistingPhoto(null);
                  }}
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

          <Button
            title={isLoading ? 'Updating...' : 'Update Professional Profile'}
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditProfessional;
