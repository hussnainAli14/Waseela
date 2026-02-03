import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Button, Checkbox, TextField } from '@/components/atoms';
import { Dropdown, CityDropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '@/navigation/types';
import { RouteProp, useRoute } from '@react-navigation/native';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const DocumentPicker = require('@react-native-documents/picker');
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createBusiness } from '@/store/slices/businessesSlice';
import { createService } from '@/store/slices/servicesSlice';
import type { BusinessFormData, ServiceFormData } from '@/types/firestore';

type ListingType = 'business' | 'service';

// Categories will be fetched from Redux

type SubmitListingRoute = RouteProp<MainStackParamList, 'SubmitListing'>;

type Navigation = NativeStackNavigationProp<MainStackParamList, 'SubmitListing'>;

const SubmitListing: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<SubmitListingRoute>();
  const initialType = route.params?.initialType || 'business';
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { isLoading: isBusinessLoading } = useAppSelector(state => state.businesses);
  const { isLoading: isServiceLoading } = useAppSelector(state => state.services);
  const { businessCategories, serviceCategories } = useAppSelector(state => state.categories);

  const [listingType, setListingType] = useState<ListingType>(initialType);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [logo, setLogo] = useState<Asset | null>(null);
  const [document, setDocument] = useState<DocumentPickerResponse | null>(null);
  const [areaInput, setAreaInput] = useState('');
  const [areas, setAreas] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isLoading = isBusinessLoading || isServiceLoading;

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

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = `Please enter ${listingType === 'business' ? 'a business name' : 'your name'}.`;
    }
    if (!category) {
      // Category is a dropdown, keep Alert or handle separately if Dropdown supports error
      // For now, let's keep Alert for non-TextField inputs or check Dropdown implementation later
    }
    if (!city) {
      // City is a dropdown
    }
    if (!description.trim()) {
      newErrors.description = 'Please enter a description.';
    }
    if (!contactPerson.trim()) {
      newErrors.contactPerson = 'Please enter the contact person name.';
    }

    // Validating email with regex
    if (!email.trim()) {
      newErrors.email = 'Please enter an email address.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);

    // Initial check for non-TextFields (can be improved later)
    if (!category) {
      Alert.alert('Validation Error', `Please select ${listingType === 'business' ? 'a category' : 'a service type'}.`);
      return false;
    }
    if (!city) {
      Alert.alert('Validation Error', 'Please select a city.');
      return false;
    }
    if (!confirm) {
      Alert.alert('Validation Error', 'Please confirm that all information is accurate.');
      return false;
    }
    if (!user?.uid) {
      Alert.alert('Authentication Error', 'You must be logged in to submit a listing.');
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Double-check user is authenticated
    if (!user?.uid) {
      Alert.alert('Authentication Error', 'You must be logged in to submit a listing.');
      return;
    }

    try {
      // Extract logo URI if selected, otherwise use empty array
      const logoUri = logo?.uri ? [logo.uri] : [];

      if (listingType === 'business') {
        // Map category to database format
        // Use the category name directly as it comes from the dynamic list
        const categoryValue = category;

        // Prepare business form data
        const formData: BusinessFormData = {
          name: name.trim(),
          category: categoryValue,
          description: description.trim(),
          city: city.trim(),
          contactPerson: contactPerson.trim(),
          email: email.trim(),
          tags: tags,
        };

        if (whatsapp.trim()) {
          formData.whatsapp = whatsapp.trim();
        }

        // Add optional fields only if they have values
        if (tagline.trim()) {
          formData.tagline = tagline.trim();
        }
        if (phone.trim()) {
          formData.phone = phone.trim();
        }
        if (website.trim()) {
          formData.website = website.trim();
        }
        if (instagram.trim()) {
          formData.instagram = instagram.trim();
        }
        if (openingHours.trim()) {
          formData.openingHours = openingHours.trim();
        }

        // Dispatch the create business action with actual logo (or empty array)
        const result = await dispatch(
          createBusiness({
            data: formData,
            userId: user.uid,
            images: logoUri, // Uses actual logo if selected, empty array if not
          })
        ).unwrap();

        if (result) {
          Alert.alert(
            'Success!',
            'Your business listing has been submitted for review. Our team will review it within 24-48 hours.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Reset form
                  setName('');
                  setTagline('');
                  setCategory('');
                  setCity('');
                  setDescription('');
                  setContactPerson('');
                  setWhatsapp('');
                  setEmail('');
                  setPhone('');
                  setWebsite('');
                  setInstagram('');
                  setOpeningHours('');
                  setTags([]);
                  setTagInput('');
                  setAreas([]);
                  setAreaInput('');
                  setConfirm(false);
                  setLogo(null);
                  setDocument(null);
                  navigation.goBack();
                },
              },
            ]
          );
        }
      } else {
        // Use service type directly
        const serviceTypeValue = category;

        // Prepare service form data
        const formData: ServiceFormData = {
          name: name.trim(),
          serviceType: serviceTypeValue,
          description: description.trim(),
          city: city.trim(),
          areasCovered: areas,
          email: email.trim(),
          tags: tags,
        };

        if (whatsapp.trim()) {
          formData.whatsapp = whatsapp.trim();
        }

        // Add optional fields only if they have values
        if (phone.trim()) {
          formData.phone = phone.trim();
        }
        if (website.trim()) {
          formData.website = website.trim();
        }
        if (instagram.trim()) {
          formData.instagram = instagram.trim();
        }
        if (openingHours.trim()) {
          formData.openingHours = openingHours.trim();
        }

        // Dispatch the create service action with actual logo (or empty array)
        const result = await dispatch(
          createService({
            data: formData,
            userId: user.uid,
            images: logoUri, // Uses actual logo if selected, empty array if not
          })
        ).unwrap();

        if (result) {
          Alert.alert(
            'Success!',
            'Your service listing has been submitted for review. Our team will review it within 24-48 hours.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Reset form
                  setName('');
                  setTagline('');
                  setCategory('');
                  setCity('');
                  setDescription('');
                  setContactPerson('');
                  setWhatsapp('');
                  setEmail('');
                  setPhone('');
                  setWebsite('');
                  setInstagram('');
                  setOpeningHours('');
                  setTags([]);
                  setTagInput('');
                  setAreas([]);
                  setAreaInput('');
                  setConfirm(false);
                  setLogo(null);
                  setDocument(null);
                  navigation.goBack();
                },
              },
            ]
          );
        }
      }
    } catch (error: any) {
      console.error('❌ Listing submission error:', {
        error: error.message,
        stack: error.stack,
        listingType,
        formData: {
          name,
          category,
          city,
          description: description.substring(0, 50) + '...',
          contactPerson,
          whatsapp,
          email,
          hasLogo: !!logo,
        },
      });
      Alert.alert(
        'Submission Failed',
        `Failed to submit ${listingType}: ${error.message || 'Unknown error'}. Please check all fields and try again.`,
      );
    }
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
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            error={errors.name}
            containerStyle={styles.inputSpacing}
          />
          {listingType === 'business' && (
            <>
              <TextField
                label="Short Tagline (Optional)"
                placeholder="e.g., Authentic Middle Eastern flavors"
                value={tagline}
                onChangeText={setTagline}
                containerStyle={styles.inputSpacing}
                maxLength={60}
              />
              <Text variant="sm-normal" style={styles.helperText}>
                Max 60 characters
              </Text>
            </>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text variant="md-semibold" style={styles.label}>
            {listingType === 'business' ? 'Category' : 'Service Type'}
          </Text>
          <Dropdown
            options={
              listingType === 'business'
                ? businessCategories.map(c => ({ label: c.name, value: c.name }))
                : serviceCategories.map(c => ({ label: c.name, value: c.name }))
            }
            selectedValue={category}
            onSelect={setCategory}
            placeholder="Select..."
            buttonStyle={styles.dropdownButton}
            buttonTextStyle={styles.dropdownText}
          />
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.inputSpacing}>
            <Text variant="sm-medium" style={{ marginBottom: 8, color: colors.text.secondary }}>
              City *
            </Text>
            <CityDropdown
              selectedValue={city}
              onSelect={setCity}
              placeholder="Select city"
              includeAllOption={false}
              valueFormat="capitalized"
            />
          </View>
          <TextField
            label="Description"
            placeholder="Describe what you offer, your experience, specialties, and what makes you unique..."
            containerStyle={styles.inputSpacing}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            error={errors.description}
          />
        </View>

        <View style={styles.fieldGroup}>
          <TextField
            label="Contact Person Name"
            placeholder="e.g., Ahmed Khan"
            value={contactPerson}
            onChangeText={(text) => {
              setContactPerson(text);
              if (errors.contactPerson) setErrors({ ...errors, contactPerson: '' });
            }}
            error={errors.contactPerson}
            containerStyle={styles.inputSpacing}
          />
          <Text variant="xl-semibold" style={styles.labelSpacing}>
            Contact Methods
          </Text>
          <TextField
            label="WhatsApp Number (Optional)"
            placeholder="+44 7XXX XXXXXX"
            keyboardType="phone-pad"
            value={whatsapp}
            onChangeText={setWhatsapp}
            containerStyle={styles.inputSpacing}
          />
          <TextField
            label="Email Address"
            placeholder="contact@example.com"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
            containerStyle={styles.inputSpacing}
          />
          <TextField
            label="Phone Number (Optional)"
            placeholder="+44 20 XXXX XXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.fieldGroup}>
          <TextField
            label="Website (Optional)"
            placeholder="https://www.example.com"
            keyboardType="url"
            value={website}
            onChangeText={setWebsite}
            containerStyle={styles.inputSpacing}
          />
          <TextField
            label="Instagram (Optional)"
            placeholder="@username"
            value={instagram}
            onChangeText={setInstagram}
            containerStyle={styles.inputSpacing}
          />
          <TextField
            label="Opening Hours (Optional)"
            placeholder="e.g., Mon-Fri: 9am - 5pm, Sat: 10am - 6pm"
            value={openingHours}
            onChangeText={setOpeningHours}
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
          {logo?.uri ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: logo.uri }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setLogo(null)}
                activeOpacity={0.8}>
                <Ionicons name="close-circle" size={28} color={colors.status.error} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickLogo}
                activeOpacity={0.85}>
                <Ionicons name="camera-outline" size={18} color={colors.primary[600]} />
                <Text variant="sm-medium" style={styles.changeImageText}>
                  Change Image
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
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
          title={isLoading ? 'Submitting...' : 'Submit for Review'}
          fullWidth
          onPress={handleSubmit}
          disabled={isLoading}
          containerStyle={styles.submitButton}
        />
        {isLoading && (
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <ActivityIndicator size="small" color={colors.primary[500]} />
          </View>
        )}

        <Text variant="sm-normal" style={styles.reviewNote}>
          Your listing will be reviewed within 24-48 hours
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubmitListing;


