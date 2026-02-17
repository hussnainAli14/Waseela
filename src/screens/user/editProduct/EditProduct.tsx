import React, { useState, useEffect } from 'react';
import { Alert, Image, ScrollView, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Button, TextField } from '@/components/atoms';
import { Dropdown, CityDropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from '@/components/templates/forms/SellItem.styles';
import {
  launchImageLibrary,
  type Asset,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProduct } from '@/store/slices/productsSlice';
import type { ProductFormData } from '@/types/firestore';
import { NavigationProp, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { MainStackParamList } from '@/navigation/types';

const conditionOptions = [
  { label: 'New', value: 'new' },
  { label: 'Like New', value: 'like-new' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Needs Repair', value: 'needs-repair' },
];

const conditionMap: Record<string, string> = {
  'New': 'new',
  'Like New': 'like-new',
  'Good': 'good',
  'Fair': 'fair',
  'Needs Repair': 'needs-repair',
};

type EditProductRoute = RouteProp<MainStackParamList, 'EditProduct'>;

const EditProduct: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<EditProductRoute>();
  const { item } = route.params;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { isLoading } = useAppSelector(state => state.products);
  const { marketplaceCategories } = useAppSelector(state => state.categories);

  const [photos, setPhotos] = useState<Asset[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [category, setCategory] = useState(item.category || '');
  const [condition, setCondition] = useState(
    conditionMap[item.condition] || item.condition || ''
  );
  const [price, setPrice] = useState(item.price?.replace('£', '').trim() || '');
  const [title, setTitle] = useState(item.title || '');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState(item.description || '');
  const [phone, setPhone] = useState(item.phone || '');
  const [whatsapp, setWhatsapp] = useState(item.whatsapp || '');
  const [email, setEmail] = useState(item.email || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Get the actual product from Redux to get both location and city fields separately
  const { userProducts } = useAppSelector(state => state.products);
  const actualProduct = userProducts.find(p => p.id === item.id);

  // Initialize existing images, location, and city
  useEffect(() => {
    if (item.image) {
      if (typeof item.image === 'string') {
        setExistingImages([item.image]);
      } else if (Array.isArray(item.image)) {
        setExistingImages(item.image);
      }
    }

    // Set location and city from actual product (they are separate fields)
    if (actualProduct) {
      if (actualProduct.location) {
        setLocation(actualProduct.location);
      }
      if (actualProduct.city) {
        setCity(actualProduct.city);
      }
    } else {
      // Fallback to item values if product not found
      if (item.location) {
        setLocation(item.location);
      }
      if ((item as any).city) {
        setCity((item as any).city);
      }
    }
  }, [item, actualProduct]);

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
    if (!description.trim()) {
      newErrors.description = 'Please enter a description.';
    }
    if (!whatsapp.trim()) {
      newErrors.whatsapp = 'Please enter your WhatsApp number.';
    }
    // Email is now optional
    // if (!email.trim()) {
    //   newErrors.email = 'Please enter your email address.';
    // }

    setErrors(newErrors);

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
      Alert.alert('Authentication Error', 'You must be logged in to update an item.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.uid) {
      Alert.alert('Authentication Error', 'You must be logged in to update an item.');
      return;
    }

    try {
      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber) || priceNumber <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid price.');
        return;
      }

      const formData: Partial<ProductFormData> = {
        title: title.trim(),
        description: description.trim(),
        category: category,
        condition: condition as any,
        price: priceNumber,
        location: location.trim(),
        city: city.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
      };

      if (phone.trim()) {
        formData.phone = phone.trim();
      }

      const imageUris = photos
        .map(photo => photo.uri)
        .filter((uri): uri is string => uri !== undefined);

      await dispatch(
        updateProduct({
          productId: item.id,
          data: formData,
          images: imageUris.length > 0 ? imageUris : undefined,
        })
      ).unwrap();

      Alert.alert(
        'Success!',
        'Your item has been updated.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error updating product:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update item. Please try again.',
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
              Edit Item
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
                {photos.length > 0 || existingImages.length > 0 ? 'Change photos' : 'Add photos of your item'}
              </Text>
              <Text variant="sm-normal" style={styles.uploadSubtitle}>
                Up to 5 photos
              </Text>
            </TouchableOpacity>

            {(photos.length > 0 || existingImages.length > 0) && (
              <View style={styles.photoPreviewRow}>
                {photos.map((asset, index) => (
                  <Image
                    key={asset.uri ?? asset.fileName ?? index.toString()}
                    source={{ uri: asset.uri }}
                    resizeMode="cover"
                    style={styles.photoThumb}
                  />
                ))}
                {existingImages.map((uri, index) => (
                  <Image
                    key={`existing-${index}`}
                    source={{ uri }}
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
              label="Email (Optional)"
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

          <Button
            title={isLoading ? 'Updating...' : 'Update Item'}
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

export default EditProduct;
