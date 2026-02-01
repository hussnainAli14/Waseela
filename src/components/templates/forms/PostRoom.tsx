import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Button, Checkbox, TextField } from '@/components/atoms';
import { Dropdown, CityDropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './PostRoom.styles';
import {
  launchImageLibrary,
  type Asset,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createRoom } from '@/store/slices/roomsSlice';
import type { RoomFormData } from '@/types/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const roomTypes = [
  { label: 'Single Room', value: 'single' },
  { label: 'Double Room', value: 'double' },
  { label: 'Studio', value: 'studio' },
  { label: 'Shared Room', value: 'shared' },
];

const defaultAmenities = [
  'WiFi',
  'Kitchen',
  'Washing Machine',
  'Parking',
  'Garden',
  'Ensuite',
  'Prayer Room',
  'Study Room',
];

const PostRoom: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<any>>();
  const { user } = useAppSelector(state => state.auth);
  const { isLoading } = useAppSelector(state => state.rooms);

  const [photos, setPhotos] = useState<Asset[]>([]);
  const [roomType, setRoomType] = useState('');
  const [rent, setRent] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [nearUni, setNearUni] = useState('');
  const [postcode, setPostcode] = useState('');
  const [availableFrom, setAvailableFrom] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [billsIncluded, setBillsIncluded] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const [yourName, setYourName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [confirm, setConfirm] = useState(false);

  const handlePickPhotos = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 5,
    };
    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel || !result.assets?.length) {
        return;
      }
      setPhotos(result.assets.slice(0, 5));
    } catch {
      Alert.alert('Upload failed', 'Unable to select photos right now. Please try again.');
    }
  };

  const toggleAmenity = (label: string) => {
    setAmenities(prev =>
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label],
    );
  };

  const handleAddAmenity = () => {
    const value = customAmenity.trim();
    if (!value || amenities.includes(value)) {
      return;
    }
    setAmenities(prev => [...prev, value]);
    setCustomAmenity('');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setAvailableFrom(selectedDate);
      if (Platform.OS === 'ios') {
        // On iOS, keep the picker open until user confirms
      }
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const validateForm = (): boolean => {
    if (!roomTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter a room title.');
      return false;
    }
    if (!roomType) {
      Alert.alert('Validation Error', 'Please select a room type.');
      return false;
    }
    if (!rent.trim()) {
      Alert.alert('Validation Error', 'Please enter the monthly rent.');
      return false;
    }
    const rentNumber = parseFloat(rent);
    if (isNaN(rentNumber) || rentNumber <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid rent amount.');
      return false;
    }
    if (!city) {
      Alert.alert('Validation Error', 'Please select a city.');
      return false;
    }
    if (!area.trim()) {
      Alert.alert('Validation Error', 'Please enter the area.');
      return false;
    }
    if (!availableFrom) {
      Alert.alert('Validation Error', 'Please select the available from date.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description.');
      return false;
    }
    if (amenities.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one amenity.');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Please enter your contact number.');
      return false;
    }
    if (!confirm) {
      Alert.alert('Validation Error', 'Please confirm that all information is accurate.');
      return false;
    }
    if (!user?.uid) {
      Alert.alert('Authentication Error', 'You must be logged in to post a room.');
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
      Alert.alert('Authentication Error', 'You must be logged in to post a room.');
      return;
    }

    try {
      // Ensure availableFrom date is set
      if (!availableFrom) {
        Alert.alert('Validation Error', 'Please select the available from date.');
        return;
      }

      // Parse rent to number
      const rentNumber = parseFloat(rent);
      if (isNaN(rentNumber) || rentNumber <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid rent amount.');
        return;
      }

      // Capitalize city name to match database format
      const cityValue = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

      // Prepare form data
      const formData: RoomFormData = {
        title: roomTitle.trim(),
        type: roomType as any,
        price: rentNumber,
        city: cityValue,
        locationLine1: area.trim(),
        description: description.trim(),
        billsIncluded,
        availableFrom: availableFrom,
        amenities,
        whatsapp: phone.trim(),
      };

      // Add optional fields only if they have values
      if (nearUni.trim()) {
        formData.locationLine2 = nearUni.trim();
      }
      if (postcode.trim()) {
        formData.postcode = postcode.trim();
      }
      if (email.trim()) {
        formData.email = email.trim();
      }
      if (phone.trim()) {
        formData.phone = phone.trim();
      }

      // Extract image URIs from selected photos (if any)
      const imageUris = photos
        .map(photo => photo.uri)
        .filter((uri): uri is string => uri !== undefined);

      // Dispatch the create room action with actual images (or empty array)
      const result = await dispatch(
        createRoom({
          data: formData,
          posterId: user.uid,
          poster: {
            name: yourName.trim() || user.displayName || 'Waseela User',
            photo: user.photoURL,
          },
          images: imageUris, // Uses actual photos if selected, empty array if not
        })
      ).unwrap();

      if (result) {
        Alert.alert(
          'Success!',
          'Your room listing has been posted and will be visible to students looking for accommodation.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setPhotos([]);
                setRoomType('');
                setRent('');
                setCity('');
                setArea('');
                setNearUni('');
                setPostcode('');
                setAvailableFrom(null);
                setDescription('');
                setAmenities([]);
                setCustomAmenity('');
                setBillsIncluded(false);
                setRoomTitle('');
                setYourName('');
                setPhone('');
                setEmail('');
                setConfirm(false);
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Error creating room listing:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create room listing. Please try again.',
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
            Post a Room
          </Text>
        </TouchableOpacity>
          <View style={styles.card}>
            <TextField
              label="Room Title"
              placeholder="e.g., Cozy Single Room near UCL"
              value={roomTitle}
              onChangeText={setRoomTitle}
            />
            <Text variant="md-semibold" style={styles.label}>Room Type</Text>
            <Dropdown
              options={roomTypes}
              selectedValue={roomType}
              onSelect={setRoomType}
              placeholder="Select..."
              buttonStyle={styles.dropdownButton}
              buttonTextStyle={styles.dropdownText}
            />
          </View>

          <View style={[styles.card, { marginTop: 14 }]}>
            <TextField
              label="Monthly Rent (£)"
              placeholder="e.g., 650"
              keyboardType="decimal-pad"
              value={rent}
              onChangeText={setRent}
            />
            <View style={[styles.row, { marginTop: 8 }]}>
              <View style={styles.halfInput}>
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
              <View style={styles.halfInput}>
                <TextField
                  label="Area"
                  placeholder="e.g., Camden"
                  value={area}
                  onChangeText={setArea}
                />
              </View>
            </View>
            <TextField
              label="Near University (Optional)"
              placeholder="e.g., UCL, Imperial College"
              value={nearUni}
              onChangeText={setNearUni}
            />
            <TextField
              label="Postcode (Optional)"
              placeholder="e.g., E1 4NS"
              value={postcode}
              onChangeText={setPostcode}
            />
            <Text variant="md-semibold" style={styles.label}>Available From</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}>
              <Text
                variant="md-normal"
                style={[
                  styles.datePickerText,
                  !availableFrom && { color: colors.text.secondary },
                ]}>
                {availableFrom ? formatDate(availableFrom) : 'Select date'}
              </Text>
              <Ionicons name="calendar-outline" size={18} color={colors.text.secondary} />
            </TouchableOpacity>
            {showDatePicker && (
              <>
                {Platform.OS === 'ios' ? (
                  <Modal
                    visible={showDatePicker}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowDatePicker(false)}>
                    <View style={styles.datePickerModal}>
                      <View style={styles.datePickerModalContent}>
                        <View style={styles.datePickerHeader}>
                          <TouchableOpacity
                            onPress={() => setShowDatePicker(false)}
                            style={styles.datePickerCancelButton}>
                            <Text variant="md-medium" style={styles.datePickerCancelText}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                          <Text variant="md-semibold" style={styles.datePickerTitle}>
                            Select Date
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              setShowDatePicker(false);
                            }}
                            style={styles.datePickerDoneButton}>
                            <Text variant="md-medium" style={styles.datePickerDoneText}>
                              Done
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <DateTimePicker
                          value={availableFrom || new Date()}
                          mode="date"
                          display="spinner"
                          onChange={handleDateChange}
                          minimumDate={new Date()}
                        />
                      </View>
                    </View>
                  </Modal>
                ) : (
                  <DateTimePicker
                    value={availableFrom || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </>
            )}
            <TextField
              label="Description"
              placeholder="Describe the room, house environment, transport links, and any special features..."
              multiline
              numberOfLines={5}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.card}>
            <Text variant="md-semibold" style={styles.label}>Amenities</Text>
            <View style={styles.amenitiesWrap}>
              {defaultAmenities.map(label => {
                const active = amenities.includes(label);
                return (
                  <TouchableOpacity
                    key={label}
                    style={[styles.amenityPill, active && styles.amenityPillActive]}
                    activeOpacity={0.85}
                    onPress={() => toggleAmenity(label)}>
                    <Text variant="md-medium" style={styles.amenityText}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.addAmenityRow}>
              <TextInput
                style={styles.addAmenityInput}
                placeholder="Add custom amenity"
                placeholderTextColor={colors.text.secondary}
                value={customAmenity}
                onChangeText={setCustomAmenity}
                onSubmitEditing={handleAddAmenity}
                returnKeyType="done"
              />
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleAddAmenity}
                style={styles.addButton}>
                <Text variant="md-medium" style={styles.addButtonText}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox checked={billsIncluded} onPress={() => setBillsIncluded(!billsIncluded)} />
              <Text variant="sm-normal" style={styles.checkboxLabel}>
                Bills are included in the rent (electricity, water, gas, internet)
              </Text>
            </View>
          </View>

          <View style={[styles.card, { marginTop: 14 }]}>
            <TextField
              label="Your Name"
              placeholder="e.g., Fatima Khan"
              value={yourName}
              onChangeText={setYourName}
            />
            <TextField
              label="Contact Number"
              placeholder="+44 7XXX XXXXXX"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TextField
              label="Email Address (Optional)"
              placeholder="contact@example.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              rightIcon={<Ionicons name="mail-outline" size={18} color={colors.text.secondary} />}
            />
          </View>

          <View style={styles.card}>
            <Text variant="md-semibold" style={styles.label}>Upload Room Photos</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.uploadCard}
              onPress={handlePickPhotos}>
              <Ionicons name="cloud-upload-outline" size={32} color={colors.text.secondary} />
              <Text variant="md-medium" style={styles.uploadTitle}>
                Tap to upload photos
              </Text>
              <Text variant="sm-normal" style={styles.uploadSubtitle}>
                PNG, JPG up to 5MB each
              </Text>
            </TouchableOpacity>
            {photos.length > 0 && (
              <View style={styles.photoPreviewRow}>
                {photos.map((asset, index) => (
                  <Image
                    key={asset.uri ?? asset.fileName ?? index.toString()}
                    source={{ uri: asset.uri }}
                    resizeMode="cover"
                    style={styles.photoThumb}
                  />
                ))}
              </View>
            )}
            <View style={styles.checkboxRow}>
              <Checkbox checked={confirm} onPress={() => setConfirm(!confirm)} />
              <Text variant="sm-normal" style={styles.checkboxLabel}>
                I confirm that all information is accurate and I am authorized to advertise this room.
              </Text>
            </View>
            <Button
              title={isLoading ? 'Posting...' : 'Post Room Listing'}
              fullWidth
              onPress={handleSubmit}
              disabled={isLoading}
              containerStyle={styles.postButton}
            />
            {isLoading && (
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <ActivityIndicator size="small" color={colors.primary[500]} />
              </View>
            )}
            <Text variant="sm-normal" style={styles.infoText}>
              Your listing will be visible to students looking for accommodation
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PostRoom;


