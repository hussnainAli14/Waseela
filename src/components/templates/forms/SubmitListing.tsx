import React, { useMemo, useState } from 'react';
import {
  Alert,
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
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '@/navigation/types';
import DocumentPicker, { type DocumentPickerResponse } from 'react-native-document-picker';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';

type ListingType = 'business' | 'service';

const listingCategories = [
  { label: 'Food', value: 'food' },
  { label: 'Retail', value: 'retail' },
  { label: 'Legal', value: 'legal' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Education', value: 'education' },
  { label: 'Trades', value: 'trades' },
  { label: 'Other', value: 'other' },
];

const serviceCategories = [
  { label: 'Tutor', value: 'tutor' },
  { label: 'Plumber', value: 'plumber' },
  { label: 'Electrician', value: 'electrician' },
  { label: 'Designer', value: 'designer' },
  { label: 'Caterer', value: 'caterer' },
  { label: 'Driver', value: 'driver' },
  { label: 'Tailor', value: 'tailor' },
  { label: 'Freelancer', value: 'freelancer' },
];

type Navigation = NativeStackNavigationProp<MainStackParamList, 'SubmitListing'>;

const SubmitListing: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const [listingType, setListingType] = useState<ListingType>('business');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [logo, setLogo] = useState<Asset | null>(null);
  const [document, setDocument] = useState<DocumentPickerResponse | null>(null);
  const [areaInput, setAreaInput] = useState('');
  const [areas, setAreas] = useState<string[]>([]);

  const tagsRemaining = useMemo(() => 5 - tags.length, [tags.length]);

  const handleAddTag = () => {
    const value = tagInput.trim();
    if (!value || tags.length >= 5 || tags.includes(value)) {
      return;
    }
    setTags(prev => [...prev, value]);
    setTagInput('');
  };

  const handleRemoveTag = (value: string) => {
    setTags(prev => prev.filter(tag => tag !== value));
  };

  const handleAddArea = () => {
    const value = areaInput.trim();
    if (!value || areas.includes(value)) {
      return;
    }
    setAreas(prev => [...prev, value]);
    setAreaInput('');
  };

  const handleRemoveArea = (value: string) => {
    setAreas(prev => prev.filter(area => area !== value));
  };

  const handleSubmit = () => {
    Alert.alert(
      'Submitted for review',
      'Thanks for sharing your listing. Our team will review it within 24-48 hours.',
    );
  };

  const pickLogo = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
    };
    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel || !result.assets?.length) {
        return;
      }
      setLogo(result.assets[0]);
    } catch {
      Alert.alert('Upload failed', 'Unable to select image right now. Please try again.');
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        presentationStyle: 'fullScreen',
      });
      setDocument(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        return;
      }
      Alert.alert('Upload failed', 'Unable to select document right now. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.headerRow}>
          <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          <Text variant="lg-semibold" style={styles.headerTitle}>
            Submit Listing
          </Text>
        </TouchableOpacity>

        <View style={styles.fieldGroup}>
          <Text variant="md-semibold" style={styles.label}>
            Listing Type
          </Text>
          <View style={styles.toggleRow}>
            {(['business', 'service'] as ListingType[]).map(type => {
              const isActive = listingType === type;
              return (
                <TouchableOpacity
                  key={type}
                  activeOpacity={0.9}
                  style={[
                    styles.toggleButton,
                    type === 'business' && styles.toggleButtonSpacing,
                    isActive && styles.toggleButtonActive,
                  ]}
                  onPress={() => setListingType(type)}>
                  <Text
                    variant="md-semibold"
                    style={[
                      styles.toggleText,
                      isActive && styles.toggleTextActive,
                    ]}>
                    {type === 'business' ? 'Business' : 'Service Provider'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <TextField
            label={listingType === 'business' ? 'Business Name' : 'Your Name'}
            placeholder={
              listingType === 'business'
                ? 'e.g., Al-Zahra Restaurant'
                : 'e.g., Fatima Ahmed'
            }
            containerStyle={styles.inputSpacing}
          />
          <TextField
            label="Short Tagline (Optional)"
            placeholder="e.g., Authentic Middle Eastern flavors"
            containerStyle={styles.inputSpacing}
            maxLength={60}
          />
          <Text variant="sm-normal" style={styles.helperText}>
            Max 60 characters
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text variant="md-semibold" style={styles.label}>
            {listingType === 'business' ? 'Category' : 'Service Type'}
          </Text>
          <Dropdown
            options={listingType === 'business' ? listingCategories : serviceCategories}
            selectedValue={category}
            onSelect={setCategory}
            placeholder="Select..."
            buttonStyle={styles.dropdownButton}
            buttonTextStyle={styles.dropdownText}
          />
        </View>

          <View style={styles.fieldGroup}>
            <TextField
              label="City"
              placeholder="e.g., London, Birmingham, Leicester"
              containerStyle={styles.inputSpacing}
              value={city}
              onChangeText={setCity}
            />
            <TextField
              label="Description"
              placeholder="Describe what you offer, your experience, specialties, and what makes you unique..."
              containerStyle={styles.inputSpacing}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

        <View style={styles.fieldGroup}>
          <TextField
            label="Contact Person Name"
            placeholder="e.g., Ahmed Khan"
            containerStyle={styles.inputSpacing}
          />
          <Text variant="xl-semibold" style={styles.labelSpacing}>
            Contact Methods
          </Text>
          <TextField
            label="WhatsApp Number"
            placeholder="+44 7XXX XXXXXX"
            keyboardType="phone-pad"
            containerStyle={styles.inputSpacing}
          />
          <TextField
            label="Email Address"
            placeholder="contact@example.com"
            keyboardType="email-address"
            containerStyle={styles.inputSpacing}
          />
          <TextField
            label="Phone Number (Optional)"
            placeholder="+44 20 XXXX XXXX"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <TextField
            label="Website (Optional)"
            placeholder="https://www.example.com"
            keyboardType="url"
            containerStyle={styles.inputSpacing}
          />
          <TextField
            label="Instagram (Optional)"
            placeholder="@username"
            containerStyle={styles.inputSpacing}
          />
          <TextField
            label="Opening Hours"
            placeholder="e.g., Mon-Fri: 9am - 5pm, Sat: 10am - 6pm"
            containerStyle={styles.inputSpacing}
          />
        </View>

        {listingType === 'service' && (
          <View style={styles.fieldGroup}>
            <Text variant="md-semibold" style={styles.label}>
              Areas Covered (Up to 5)
            </Text>
            <View style={styles.areaRow}>
              <TextInput
                value={areaInput}
                onChangeText={setAreaInput}
                placeholder="Add area (e.g., Greater London)"
                placeholderTextColor={colors.text.secondary}
                style={[styles.tagInput, styles.tagInputSpacing]}
                onSubmitEditing={handleAddArea}
                returnKeyType="done"
              />
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleAddArea}
                style={styles.addButton}
                disabled={!areaInput.trim() || areas.length >= 5}>
                <Text variant="md-semibold" style={styles.addButtonText}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
            <Text variant="sm-normal" style={styles.helperText}>
              {areas.length} area(s) added
            </Text>
            <View style={styles.tagList}>
              {areas.map(area => (
                <TouchableOpacity
                  key={area}
                  style={styles.tagPill}
                  activeOpacity={0.8}
                  onPress={() => handleRemoveArea(area)}>
                  <Text variant="sm-medium" style={styles.tagText}>
                    {area}
                  </Text>
                  <Ionicons
                    name="close"
                    size={14}
                    color={colors.text.secondary}
                    style={styles.tagIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.fieldGroup}>
          <Text variant="md-semibold" style={styles.label}>
            Tags/Keywords (Up to 5)
          </Text>
          <View style={styles.tagRow}>
            <TextInput
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add keyword (e.g., halal, organic)"
              placeholderTextColor={colors.text.secondary}
              style={[styles.tagInput, styles.tagInputSpacing]}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
            />
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleAddTag}
              style={styles.addButton}
              disabled={!tagInput.trim() || tags.length >= 5}>
              <Text variant="md-semibold" style={styles.addButtonText}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
          <Text variant="sm-normal" style={styles.helperText}>
            {tags.length}/5 tags · {tagsRemaining} remaining
          </Text>
          <View style={styles.tagList}>
            {tags.map(tag => (
              <TouchableOpacity
                key={tag}
                style={styles.tagPill}
                activeOpacity={0.8}
                onPress={() => handleRemoveTag(tag)}>
                <Text variant="sm-medium" style={styles.tagText}>
                  {tag}
                </Text>
                <Ionicons
                  name="close"
                  size={14}
                  color={colors.text.secondary}
                  style={styles.tagIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text variant="md-semibold" style={styles.label}>
            Upload Logo/Photo
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.uploadCard}
            onPress={pickLogo}>
            <Ionicons
              name="cloud-upload-outline"
              size={28}
              color={colors.text.secondary}
            />
            <Text variant="md-medium" style={styles.uploadTitle}>
              Tap to upload or select
            </Text>
            <Text variant="sm-normal" style={styles.uploadSubtitle}>
              PNG, JPG up to 5MB
            </Text>
          </TouchableOpacity>
          {logo?.fileName && (
            <View style={styles.fileRow}>
              <Ionicons name="image-outline" size={18} color={colors.text.secondary} />
              <Text variant="sm-medium" style={styles.fileName}>
                {logo.fileName}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text variant="md-semibold" style={styles.label}>
            Verification Document (Optional)
          </Text>
          <Text variant="sm-normal" style={styles.helperText}>
            Upload business registration or professional certification for faster
            verification
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.uploadCard}
            onPress={pickDocument}>
            <Ionicons
              name="document-attach-outline"
              size={28}
              color={colors.text.secondary}
            />
            <Text variant="md-medium" style={styles.uploadTitle}>
              Upload document (PDF, JPG, PNG)
            </Text>
          </TouchableOpacity>
          {document?.name && (
            <View style={styles.fileRow}>
              <Ionicons name="document-text-outline" size={18} color={colors.text.secondary} />
              <Text variant="sm-medium" style={styles.fileName}>
                {document.name}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.checkboxRow}>
          <Checkbox checked={confirm} onPress={() => setConfirm(!confirm)} />
          <Text variant="sm-normal" style={styles.checkboxText}>
            I confirm that all information provided is accurate and I have the
            right to list this business/service.
          </Text>
        </View>

        <Button
          title="Submit for Review"
          fullWidth
          onPress={handleSubmit}
          containerStyle={styles.submitButton}
        />

        <Text variant="sm-normal" style={styles.reviewNote}>
          Your listing will be reviewed within 24-48 hours
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubmitListing;


