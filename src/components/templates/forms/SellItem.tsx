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
import { NavigationProp, useNavigation } from '@react-navigation/native';

// Categories will be fetched from Redux

const conditionOptions = [
  { label: 'New', value: 'new' },
  { label: 'Like New', value: 'like-new' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Needs Repair', value: 'needs-repair' },
];

const SellItem: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
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
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a title for your item.';
    }
    if (!category) {
      // Dropdown
    }
    if (!condition) {
      // Dropdown
    }
    if (!price.trim()) {
      newErrors.price = 'Please enter the price.';
    } else {
      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber) || priceNumber <= 0) {
        newErrors.price = 'Please enter a valid price.';
      }
    }
    if (!location.trim()) {
      newErrors.location = 'Please enter the location.';
    }
    if (!city) {
      // Dropdown
    }
    if (!description.trim()) {
      newErrors.description = 'Please enter a description.';
    }
    // Phone is now optional
    // if (!phone.trim()) {
    //   newErrors.phone = 'Please enter your phone number.';
    // }
    if (!whatsapp.trim()) {
      newErrors.whatsapp = 'Please enter your WhatsApp number.';
    }
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    }

    setErrors(newErrors);

    // Alert for non-TextField errors
    if (!category) {
      Alert.alert('Validation Error', 'Please select a category.');
      return false;
    }
    if (!condition) {
      Alert.alert('Validation Error', 'Please select the condition.');
      return false;
    }
    if (!city) {
      Alert.alert('Validation Error', 'Please select a city.');
      return false;
    }
    if (Object.keys(newErrors).length > 0) {
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
        phone: phone.trim() || undefined, // Send undefined if empty
        whatsapp: whatsapp.trim(),
        email: email.trim(),
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
          seller: {
            name: user.displayName || 'Waseela User',
            photo: user.photoURL || undefined,
          },
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
                setPhone('');
                setWhatsapp('');
                setEmail('');
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
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.headerRow}>
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
            <Text variant="lg-semibold" style={styles.headerTitle}>
              Sell an Item
            </Text>
          </TouchableOpacity>
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
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
              }}
              containerStyle={{ marginBottom: 12 }}
              error={errors.title}
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
              onChangeText={(text) => {
                setPrice(text);
                if (errors.price) setErrors(prev => ({ ...prev, price: '' }));
              }}
              error={errors.price}
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
              onChangeText={(text) => {
                setLocation(text);
                if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
              }}
              containerStyle={{ marginBottom: 12 }}
              error={errors.location}
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
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
              }}
              inputContainerStyle={styles.descriptionInputContainer}
              inputStyle={styles.descriptionInput}
              error={errors.description}
            />
          </View>

          <View style={styles.card}>
            <Text variant="md-semibold" style={styles.sectionLabel}>
              Contact details
            </Text>
            <Text variant="sm-normal" style={{ color: colors.text.secondary, marginBottom: 12 }}>
              Buyers will use these to reach you.
            </Text>
            <TextField
              label="Phone number (Optional)"
              placeholder="e.g., +44 7XXX XXXXXX"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
              }}
              keyboardType="phone-pad"
              containerStyle={{ marginBottom: 12 }}
              error={errors.phone}
            />
            <TextField
              label="WhatsApp number"
              placeholder="e.g., +44 7XXX XXXXXX"
              value={whatsapp}
              onChangeText={(text) => {
                setWhatsapp(text);
                if (errors.whatsapp) setErrors(prev => ({ ...prev, whatsapp: '' }));
              }}
              keyboardType="phone-pad"
              containerStyle={{ marginBottom: 12 }}
              error={errors.whatsapp}
            />
            <TextField
              label="Email"
              placeholder="e.g., your.email@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
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


