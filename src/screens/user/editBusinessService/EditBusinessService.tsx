import React, { useMemo, useState, useEffect } from 'react';
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
import { styles } from '@/components/templates/forms/styles';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '@/navigation/types';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateBusiness } from '@/store/slices/businessesSlice';
import { updateService } from '@/store/slices/servicesSlice';
import type { BusinessFormData, ServiceFormData } from '@/types/firestore';

type ListingType = 'business' | 'service';

type EditBusinessServiceRoute = RouteProp<MainStackParamList, 'EditBusinessService'>;
type Navigation = NativeStackNavigationProp<MainStackParamList, 'EditBusinessService'>;

const EditBusinessService: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<EditBusinessServiceRoute>();
  const { item, type } = route.params;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { isLoading: isBusinessLoading } = useAppSelector(state => state.businesses);
  const { isLoading: isServiceLoading } = useAppSelector(state => state.services);
  const { businessCategories, serviceCategories } = useAppSelector(state => state.categories);

  const [listingType, setListingType] = useState<ListingType>(type);
  const [name, setName] = useState(item.name || '');
  const [tagline, setTagline] = useState((item as any).tagline || '');
  const [category, setCategory] = useState(item.category || '');
  const [city, setCity] = useState((item as any).city || item.location || '');
  const [description, setDescription] = useState(item.description || '');
  const [contactPerson, setContactPerson] = useState((item as any).contactPerson || '');
  const [whatsapp, setWhatsapp] = useState((item as any).whatsapp || '');
  const [email, setEmail] = useState(item.email || '');
  const [phone, setPhone] = useState(item.phone || '');
  const [website, setWebsite] = useState((item as any).website || '');
  const [instagram, setInstagram] = useState((item as any).instagram || '');
  const [openingHours, setOpeningHours] = useState((item as any).openingHours || '');
  const [tags, setTags] = useState<string[]>((item as any).tags || []);
  const [tagInput, setTagInput] = useState('');
  const [areas, setAreas] = useState<string[]>((item as any).areasCovered || []);
  const [areaInput, setAreaInput] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [logo, setLogo] = useState<Asset | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isLoading = isBusinessLoading || isServiceLoading;

  // Initialize existing images from item
  useEffect(() => {
    if (item.image) {
      if (typeof item.image === 'string') {
        setExistingImages([item.image]);
      } else if (Array.isArray(item.image)) {
        setExistingImages(item.image);
      }
    }
  }, [item]);

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
    if (!description.trim()) {
      newErrors.description = 'Please enter a description.';
    }
    if (!contactPerson.trim()) {
      newErrors.contactPerson = 'Please enter the contact person name.';
    }
    if (!email.trim()) {
      newErrors.email = 'Please enter an email address.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);

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
      Alert.alert('Authentication Error', 'You must be logged in to update a listing.');
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.uid) {
      Alert.alert('Authentication Error', 'You must be logged in to update a listing.');
      return;
    }

    try {
      // Upload new logo/image first if selected (similar to EditRoom)
      let finalImageUrls: string[] | undefined = undefined;
      
      if (logo?.uri) {
        // Check if it's already a Firebase Storage URL or a local file URI
        const isLocalFile = logo.uri.startsWith('file://') || logo.uri.startsWith('/');
        const isFirebaseUrl = logo.uri.startsWith('https://firebasestorage.googleapis.com');
        
        if (isLocalFile) {
          // Upload new image to Firebase Storage
          const { uploadListingImages } = await import('@/services/storage/imageUpload');
          const uploadedUrls = await uploadListingImages(
            [logo.uri],
            user.uid,
            item.id,
            listingType === 'business' ? 'business' : 'service'
          );
          finalImageUrls = uploadedUrls;
        } else if (isFirebaseUrl) {
          // Already a Firebase URL, use it directly
          finalImageUrls = [logo.uri];
        } else {
          // Use existing images if logo is not set or invalid
          finalImageUrls = existingImages.length > 0 ? existingImages : undefined;
        }
      } else if (existingImages.length > 0) {
        // No new logo selected, keep existing images
        finalImageUrls = existingImages;
      }

      if (listingType === 'business') {
        const formData: Partial<BusinessFormData> = {
          name: name.trim(),
          category: category,
          description: description.trim(),
          city: city.trim(),
          contactPerson: contactPerson.trim(),
          email: email.trim(),
          tags: tags,
        };

        if (whatsapp.trim()) formData.whatsapp = whatsapp.trim();
        if (tagline.trim()) formData.tagline = tagline.trim();
        if (phone.trim()) formData.phone = phone.trim();
        if (website.trim()) formData.website = website.trim();
        if (instagram.trim()) formData.instagram = instagram.trim();
        if (openingHours.trim()) formData.openingHours = openingHours.trim();

        await dispatch(
          updateBusiness({
            businessId: item.id,
            data: formData,
            images: finalImageUrls,
          })
        ).unwrap();

        Alert.alert('Success!', 'Your business listing has been updated.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        const formData: Partial<ServiceFormData> = {
          name: name.trim(),
          serviceType: category,
          description: description.trim(),
          city: city.trim(),
          areasCovered: areas,
          email: email.trim(),
          tags: tags,
        };

        if (whatsapp.trim()) formData.whatsapp = whatsapp.trim();
        if (phone.trim()) formData.phone = phone.trim();
        if (website.trim()) formData.website = website.trim();
        if (instagram.trim()) formData.instagram = instagram.trim();
        if (openingHours.trim()) formData.openingHours = openingHours.trim();

        await dispatch(
          updateService({
            serviceId: item.id,
            data: formData,
            images: finalImageUrls,
          })
        ).unwrap();

        Alert.alert('Success!', 'Your service listing has been updated.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error: any) {
      console.error('❌ Listing update error:', error);
      Alert.alert('Update Failed', `Failed to update ${listingType}: ${error.message || 'Unknown error'}.`);
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
            Edit {listingType === 'business' ? 'Business' : 'Service'}
          </Text>
        </TouchableOpacity>

        <View style={styles.fieldGroup}>
          <Text variant="md-semibold" style={styles.label}>
            Listing Type
          </Text>
          <View style={styles.toggleRow}>
            {(['business', 'service'] as ListingType[]).map(typeOption => {
              const isActive = listingType === typeOption;
              return (
                <TouchableOpacity
                  key={typeOption}
                  activeOpacity={0.9}
                  style={[
                    styles.toggleButton,
                    typeOption === 'business' && styles.toggleButtonSpacing,
                    isActive && styles.toggleButtonActive,
                  ]}
                  onPress={() => setListingType(typeOption)}>
                  <Text
                    variant="md-semibold"
                    style={[
                      styles.toggleText,
                      isActive && styles.toggleTextActive,
                    ]}>
                    {typeOption === 'business' ? 'Business' : 'Service Provider'}
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
          {(logo?.uri || existingImages.length > 0) ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: logo?.uri || existingImages[0] }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => {
                  setLogo(null);
                  setExistingImages([]);
                }}
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

        <View style={styles.checkboxRow}>
          <Checkbox checked={confirm} onPress={() => setConfirm(!confirm)} />
          <Text variant="sm-normal" style={styles.checkboxText}>
            I confirm that all information provided is accurate and I have the
            right to list this business/service.
          </Text>
        </View>

        <Button
          title={isLoading ? 'Updating...' : 'Update Listing'}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditBusinessService;
