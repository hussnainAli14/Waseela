import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Button, Checkbox, TextField } from '@/components/atoms';
import { Dropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './JoinProfessionalNetwork.styles';
import {
  launchImageLibrary,
  type Asset,
  type ImageLibraryOptions,
} from 'react-native-image-picker';

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
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [offerMentorship, setOfferMentorship] = useState(false);
  const [offerCareerAdvice, setOfferCareerAdvice] = useState(false);
  const [email, setEmail] = useState('');
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

  const handleSubmit = () => {
    Alert.alert(
      'Request sent',
      'Your profile will be visible to community members once approved.',
    );
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
            <TextField
              label="Location"
              placeholder="e.g., London"
              value={location}
              onChangeText={setLocation}
            />
            <TextField
              label="Years of Experience"
              placeholder="e.g., 10"
              keyboardType="number-pad"
              value={experience}
              onChangeText={setExperience}
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
              label="LinkedIn Profile (Optional)"
              placeholder="linkedin.com/in/yourprofile"
              value={linkedin}
              onChangeText={setLinkedin}
            />
            <Text variant="md-semibold" style={[styles.label, { marginTop: 6 }]}>
              Professional Photo
            </Text>
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
            {photo?.fileName && (
              <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Image
                  source={{ uri: photo.uri }}
                  style={{ width: 48, height: 48, borderRadius: 12 }}
                  resizeMode="cover"
                />
                <Text variant="sm-medium" style={{ color: colors.text.primary }}>
                  {photo.fileName}
                </Text>
              </View>
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
            title="Join Professional Network"
            fullWidth
            onPress={handleSubmit}
            containerStyle={[styles.buttonSpacing, styles.primaryButton]}
          />
          <Text variant="sm-normal" style={styles.bottomInfo}>
            Your profile will be visible to all community members
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default JoinProfessionalNetwork;


