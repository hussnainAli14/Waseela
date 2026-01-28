import React, { useState } from 'react';
import { Alert, Image, ScrollView, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Button, TextField } from '@/components/atoms';
import { Dropdown, CityDropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './SellItem.styles';
import {
  launchImageLibrary,
  type Asset,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createProduct } from '@/store/slices/productsSlice';
import type { ProductFormData } from '@/types/firestore';

// Categories will be fetched from Redux

const conditionOptions = [
  { label: 'New', value: 'new' },
  { label: 'Like New', value: 'like-new' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Needs Repair', value: 'needs-repair' },
];

const SellItem: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { isLoading } = useAppSelector(state => state.products);
  const { marketplaceCategories } = useAppSelector(state => state.categories);

  const [photos, setPhotos] = useState<Asset[]>([]);
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');

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

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title for your item.');
      return false;
    }
    if (!category) {
      Alert.alert('Validation Error', 'Please select a category.');
      return false;
    }
    if (!condition) {
      Alert.alert('Validation Error', 'Please select the condition.');
      return false;
    }
    if (!price.trim()) {
      Alert.alert('Validation Error', 'Please enter the price.');
      return false;
    }
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price.');
      return false;
    }
    if (!location.trim()) {
      Alert.alert('Validation Error', 'Please enter the location.');
      return false;
    }
    if (!city) {
      Alert.alert('Validation Error', 'Please select a city.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description.');
      return false;
    }
    if (!user?.uid) {
      Alert.alert('Authentication Error', 'You must be logged in to post an item.');
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
      Alert.alert('Authentication Error', 'You must be logged in to post an item.');
      return;
    }

    try {
      // Parse price to number
      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber) || priceNumber <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid price.');
        return;
      }

      // Prepare form data
      const formData: ProductFormData = {
        title: title.trim(),
        description: description.trim(),
        category: category,
        condition: condition as any,
        price: priceNumber,
        location: location.trim(),
        city: city.trim(),
      };

      // Extract image URIs from selected photos (if any)
      const imageUris = photos
        .map(photo => photo.uri)
        .filter((uri): uri is string => uri !== undefined);

      // Dispatch the create product action with actual images (or empty array)
      const result = await dispatch(
        createProduct({
          data: formData,
          sellerId: user.uid,
          images: imageUris, // Uses actual photos if selected, empty array if not
        })
      ).unwrap();

      if (result) {
        Alert.alert(
          'Success!',
          'Your item has been posted and will be reviewed. Interested buyers will be able to contact you soon.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setPhotos([]);
                setCategory('');
                setCondition('');
                setPrice('');
                setTitle('');
                setLocation('');
                setCity('');
                setDescription('');
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to post item. Please try again.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text variant="md-semibold" style={styles.sectionLabel}>
              Photos
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.uploadCard}
              onPress={handlePickPhotos}>
              <Ionicons name="camera-outline" size={32} color={colors.text.secondary} />
              <Text variant="md-medium" style={styles.uploadTitle}>
                Add photos of your item
              </Text>
              <Text variant="sm-normal" style={styles.uploadSubtitle}>
                Up to 5 photos
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
          </View>

          <View style={styles.card}>
            <TextField
              label="Title"
              placeholder="e.g., iPhone 13 Pro - 256GB"
              value={title}
              onChangeText={setTitle}
              containerStyle={{ marginBottom: 12 }}
            />

            <Text variant="md-semibold" style={styles.dropdownLabel}>
              Category
            </Text>
            <Dropdown
              options={marketplaceCategories.map(c => ({ label: c.name, value: c.name }))}
              selectedValue={category}
              onSelect={setCategory}
              placeholder="Select category..."
              buttonStyle={styles.dropdownButton}
              buttonTextStyle={styles.dropdownText}
            />
          </View>

          <View style={styles.card}>
            <TextField
              label="Price (£)"
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
            // containerStyle={{ marginBottom: 12 }}
            />

            <Text variant="md-semibold" style={styles.dropdownLabel}>
              Condition
            </Text>
            <Dropdown
              options={conditionOptions}
              selectedValue={condition}
              onSelect={setCondition}
              placeholder="Select condition..."
              buttonStyle={styles.dropdownButton}
              buttonTextStyle={styles.dropdownText}
            />
          </View>

          <View style={styles.card}>
            <TextField
              label="Location"
              placeholder="e.g., East London, Zone 2"
              value={location}
              onChangeText={setLocation}
              containerStyle={{ marginBottom: 12 }}
            />
            <View style={{ marginBottom: 12 }}>
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
              placeholder="Describe your item, its condition, and any other relevant details..."
              multiline
              numberOfLines={5}
              value={description}
              onChangeText={setDescription}
              inputContainerStyle={styles.descriptionInputContainer}
              inputStyle={styles.descriptionInput}
            />
          </View>

          <View style={[styles.card, styles.guidelinesCard]}>
            <Text variant="md-semibold" style={styles.guidelinesTitle}>
              Posting Guidelines
            </Text>
            <Text variant="sm-normal" style={styles.guidelineItem}>
              • Be honest about the item's condition
            </Text>
            <Text variant="sm-normal" style={styles.guidelineItem}>
              • Set a fair price
            </Text>
            <Text variant="sm-normal" style={styles.guidelineItem}>
              • Respond promptly to messages
            </Text>
            <Text variant="sm-normal" style={[styles.guidelineItem, { marginBottom: 0 }]}>
              • No prohibited or illegal items
            </Text>
          </View>

          <Button
            title={isLoading ? 'Posting...' : 'Post Item'}
            fullWidth
            onPress={handleSubmit}
            disabled={isLoading}
            containerStyle={[styles.buttonSpacing, styles.postButton]}
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

export default SellItem;


