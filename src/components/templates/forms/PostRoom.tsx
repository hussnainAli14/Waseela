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
import { styles } from './PostRoom.styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '@/navigation/types';
import {
  launchImageLibrary,
  type Asset,
  type ImageLibraryOptions,
} from 'react-native-image-picker';

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

type Navigation = NativeStackNavigationProp<MainStackParamList, 'PostRoom'>;

const PostRoom: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const [photos, setPhotos] = useState<Asset[]>([]);
  const [roomType, setRoomType] = useState('');
  const [rent, setRent] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [nearUni, setNearUni] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [billsIncluded, setBillsIncluded] = useState(false);
  const [name, setName] = useState('');
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

  const handleSubmit = () => {
    Alert.alert(
      'Listing posted',
      'Your listing will be visible to students looking for accommodation.',
    );
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
            Post Your Room
          </Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <TextField
            label="Room Title"
            placeholder="e.g., Cozy Single Room near UCL"
            value={name}
            onChangeText={setName}
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
              <TextField
                label="City"
                placeholder="e.g., London"
                value={city}
                onChangeText={setCity}
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
            label="Available From"
            placeholder="mm/dd/yyyy"
            value={availableFrom}
            onChangeText={setAvailableFrom}
            rightIcon={<Ionicons name="calendar-outline" size={18} color={colors.text.secondary} />}
          />
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
            value={name}
            onChangeText={setName}
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
            title="Post Room Listing"
            fullWidth
            onPress={handleSubmit}
            containerStyle={styles.postButton}
          />
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


