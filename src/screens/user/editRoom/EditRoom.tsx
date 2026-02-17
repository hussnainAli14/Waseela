import React, { useState, useEffect } from 'react';
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
import { styles } from '@/components/templates/forms/PostRoom.styles';
import {
  launchImageLibrary,
  type Asset,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateRoom, fetchUserRooms } from '@/store/slices/roomsSlice';
import type { RoomFormData } from '@/types/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationProp, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { MainStackParamList } from '@/navigation/types';
import { toMilliseconds } from '@/utils/dateUtils';

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

type EditRoomRoute = RouteProp<MainStackParamList, 'EditRoom'>;

const EditRoom: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<EditRoomRoute>();
  const { room } = route.params;
  const { user } = useAppSelector(state => state.auth);
  const { isLoading } = useAppSelector(state => state.rooms);

  const [photos, setPhotos] = useState<Asset[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
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
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const [confirm, setConfirm] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isUploading, setIsUploading] = useState(false);

  // Get the actual room from Redux to get all fields including phone, whatsapp, email, and availableFrom
  const { userRooms } = useAppSelector(state => state.rooms);
  const actualRoom = userRooms.find(r => r.id === room.id);

  // Track if images have been initialized to prevent resetting after user removes them
  const [imagesInitialized, setImagesInitialized] = useState(false);

  // Initialize all fields from actual room or fallback to passed room
  useEffect(() => {
    // Use actual room if available, otherwise fallback to passed room
    const roomData = actualRoom || room;

    // Set images only on initial load, not when actualRoom updates after refresh
    if (!imagesInitialized) {
      if (actualRoom?.images && actualRoom.images.length > 0) {
        setExistingImages(actualRoom.images);
        setImagesInitialized(true);
      } else if (room.image) {
        if (typeof room.image === 'string') {
          setExistingImages([room.image]);
        } else if (Array.isArray(room.image)) {
          setExistingImages(room.image);
        }
        setImagesInitialized(true);
      }
    }

    // Set basic fields
    if (roomData.type) setRoomType(roomData.type);
    if (roomData.price) setRent(roomData.price.toString());
    if (roomData.city) setCity(roomData.city);
    if (roomData.locationLine1) setArea(roomData.locationLine1);
    if (roomData.locationLine2) setNearUni(roomData.locationLine2);
    if ((roomData as any).postcode) setPostcode((roomData as any).postcode);
    if (roomData.description) setDescription(roomData.description);
    if (roomData.amenities) setAmenities(roomData.amenities);
    if (roomData.billsIncluded !== undefined) setBillsIncluded(roomData.billsIncluded);
    if (roomData.title) setRoomTitle(roomData.title);

    // Set contact fields from actual room (RoomItem doesn't have these)
    if (actualRoom?.phone) {
      setPhone(actualRoom.phone);
    }
    if (actualRoom?.email) {
      setEmail(actualRoom.email);
    }
    if (actualRoom?.whatsapp) {
      setWhatsapp(actualRoom.whatsapp);
    }

    // Convert availableFrom to Date object from actual room
    if (actualRoom?.availableFrom) {
      const ms = toMilliseconds(actualRoom.availableFrom);
      if (ms > 0) {
        setAvailableFrom(new Date(ms));
      }
    } else if (room.availableFrom) {
      // Fallback: try to parse from RoomItem's formatted string
      const ms = toMilliseconds(room.availableFrom);
      if (ms > 0) {
        setAvailableFrom(new Date(ms));
      }
    }
  }, [room, actualRoom]);

  const handlePickPhotos = async () => {
    // Calculate how many more images can be selected (max 5 total including existing)
    const totalCurrentImages = existingImages.length + photos.length;
    const maxAllowed = 5;
    const remainingSlots = Math.max(0, maxAllowed - totalCurrentImages);
    
    if (remainingSlots === 0) {
      Alert.alert('Maximum Reached', 'You can only upload up to 5 photos. Please remove some existing photos first.');
      return;
    }

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: remainingSlots,
    };
    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel || !result.assets?.length) {
        return;
      }
      // Only add up to the remaining slots
      const newPhotos = result.assets.slice(0, remainingSlots);
      setPhotos(prev => [...prev, ...newPhotos].slice(0, remainingSlots));
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
    const newErrors: { [key: string]: string } = {};

    if (!roomTitle.trim()) {
      newErrors.roomTitle = 'Please enter a room title.';
    }
    if (!rent.trim()) {
      newErrors.rent = 'Please enter the monthly rent.';
    } else {
      const rentNumber = parseFloat(rent);
      if (isNaN(rentNumber) || rentNumber <= 0) {
        newErrors.rent = 'Please enter a valid rent amount.';
      }
    }
    if (!area.trim()) {
      newErrors.area = 'Please enter the area.';
    }
    if (!description.trim()) {
      newErrors.description = 'Please enter a description.';
    }
    if (!phone.trim() && !whatsapp.trim()) {
      newErrors.phone = 'Please enter at least one contact number.';
    }

    setErrors(newErrors);

    if (!roomType) {
      Alert.alert('Validation Error', 'Please select a room type.');
      return false;
    }
    if (!city) {
      Alert.alert('Validation Error', 'Please select a city.');
      return false;
    }
    if (!availableFrom) {
      Alert.alert('Validation Error', 'Please select the available from date.');
      return false;
    }
    if (amenities.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one amenity.');
      return false;
    }
    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    if (!confirm) {
      Alert.alert('Validation Error', 'Please confirm that all information is accurate.');
      return false;
    }
    if (!user?.uid) {
      Alert.alert('Authentication Error', 'You must be logged in to update a room.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.uid) {
      Alert.alert('Authentication Error', 'You must be logged in to update a room.');
      return;
    }

    // Set loading state immediately for instant UI feedback
    setIsUploading(true);

    try {
      if (!availableFrom) {
        setIsUploading(false);
        Alert.alert('Validation Error', 'Please select the available from date.');
        return;
      }

      const rentNumber = parseFloat(rent);
      if (isNaN(rentNumber) || rentNumber <= 0) {
        setIsUploading(false);
        Alert.alert('Validation Error', 'Please enter a valid rent amount.');
        return;
      }

      const cityValue = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

      // Convert availableFrom Date to a new Date object to avoid serialization issues
      // The service will convert it to ISO string
      const availableFromDate = availableFrom ? new Date(availableFrom.getTime()) : new Date();

      const formData: Partial<RoomFormData> = {
        title: roomTitle.trim(),
        type: roomType as any,
        price: rentNumber,
        city: cityValue,
        locationLine1: area.trim(),
        description: description.trim(),
        billsIncluded,
        availableFrom: availableFromDate,
        amenities,
        whatsapp: (phone.trim() || whatsapp.trim()) || '',
      };

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

      // Upload new photos first (if any) - this happens while loader is already showing
      let newImageUrls: string[] = [];
      const newImageUris = photos
        .map(photo => photo.uri)
        .filter((uri): uri is string => uri !== undefined);
      
      if (newImageUris.length > 0 && user?.uid) {
        // Upload new images to Firebase Storage
        const { uploadListingImages } = await import('@/services/storage/imageUpload');
        newImageUrls = await uploadListingImages(
          newImageUris,
          user.uid,
          room.id,
          'room'
        );
      }
      
      // Combine remaining existing images (after removals) with newly uploaded images
      // Always send array (even if empty) to ensure removed images are deleted from DB
      const allImages = [...existingImages, ...newImageUrls];

      await dispatch(
        updateRoom({
          roomId: room.id,
          data: formData,
          images: allImages, // Always send array, even if empty
        })
      ).unwrap();

      setIsUploading(false);

      Alert.alert(
        'Success!',
        'Your room listing has been updated.',
        [
          {
            text: 'OK',
            onPress: async () => {
              // Refresh the room data after navigation to avoid UI flicker
              if (user?.uid) {
                dispatch(fetchUserRooms(user.uid));
              }
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      setIsUploading(false);
      console.error('Error updating room listing:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update room listing. Please try again.',
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
              Edit Room Listing
            </Text>
          </TouchableOpacity>
          <View style={styles.card}>
            <TextField
              label="Room Title"
              placeholder="e.g., Cozy Single Room near UCL"
              value={roomTitle}
              onChangeText={(text) => {
                setRoomTitle(text);
                if (errors.roomTitle) setErrors(prev => ({ ...prev, roomTitle: '' }));
              }}
              error={errors.roomTitle}
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
              onChangeText={(text) => {
                setRent(text);
                if (errors.rent) setErrors(prev => ({ ...prev, rent: '' }));
              }}
              error={errors.rent}
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
                  onChangeText={(text) => {
                    setArea(text);
                    if (errors.area) setErrors(prev => ({ ...prev, area: '' }));
                  }}
                  error={errors.area}
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
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
              }}
              error={errors.description}
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
            {amenities.filter(a => !defaultAmenities.includes(a)).map(amenity => (
              <TouchableOpacity
                key={amenity}
                style={[styles.amenityPill, styles.amenityPillActive]}
                activeOpacity={0.85}
                onPress={() => toggleAmenity(amenity)}>
                <Text variant="md-medium" style={styles.amenityText}>
                  {amenity}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.checkboxRow}>
              <Checkbox checked={billsIncluded} onPress={() => setBillsIncluded(!billsIncluded)} />
              <Text variant="sm-normal" style={styles.checkboxLabel}>
                Bills are included in the rent (electricity, water, gas, internet)
              </Text>
            </View>
          </View>

          <View style={[styles.card, { marginTop: 14 }]}>
            <TextField
              label="Contact Number"
              placeholder="+44 7XXX XXXXXX"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
              }}
              error={errors.phone}
            />
            <TextField
              label="WhatsApp Number (Optional)"
              placeholder="+44 7XXX XXXXXX"
              keyboardType="phone-pad"
              value={whatsapp}
              onChangeText={setWhatsapp}
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
                {photos.length > 0 || existingImages.length > 0 ? 'Change photos' : 'Tap to upload photos'}
              </Text>
              <Text variant="sm-normal" style={styles.uploadSubtitle}>
                PNG, JPG up to 5MB each
              </Text>
            </TouchableOpacity>
            {(photos.length > 0 || existingImages.length > 0) && (
              <View style={styles.photoPreviewRow}>
                {photos.map((asset, index) => (
                  <View key={asset.uri ?? asset.fileName ?? index.toString()} style={{ position: 'relative' }}>
                    <Image
                      source={{ uri: asset.uri }}
                      resizeMode="cover"
                      style={styles.photoThumb}
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        backgroundColor: colors.status.error,
                        borderRadius: 12,
                        width: 24,
                        height: 24,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1,
                      }}
                      onPress={() => {
                        setPhotos(prev => prev.filter((_, i) => i !== index));
                      }}
                      activeOpacity={0.8}>
                      <Ionicons name="close" size={16} color={colors.common.white} />
                    </TouchableOpacity>
                  </View>
                ))}
                {existingImages.map((uri, index) => (
                  <View key={`existing-${index}`} style={{ position: 'relative' }}>
                    <Image
                      source={{ uri }}
                      resizeMode="cover"
                      style={styles.photoThumb}
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        backgroundColor: colors.status.error,
                        borderRadius: 12,
                        width: 24,
                        height: 24,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1,
                      }}
                      onPress={() => {
                        setExistingImages(prev => prev.filter((_, i) => i !== index));
                      }}
                      activeOpacity={0.8}>
                      <Ionicons name="close" size={16} color={colors.common.white} />
                    </TouchableOpacity>
                  </View>
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
              title={(isLoading || isUploading) ? 'Updating...' : 'Update Room Listing'}
              fullWidth
              onPress={handleSubmit}
              disabled={isLoading || isUploading}
              containerStyle={styles.postButton}
            />
            {(isLoading || isUploading) && (
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <ActivityIndicator size="small" color={colors.primary[500]} />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditRoom;
