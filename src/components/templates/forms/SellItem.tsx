import React, { useState } from 'react';
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Button, TextField } from '@/components/atoms';
import { Dropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './SellItem.styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '@/navigation/types';
import {
  launchImageLibrary,
  type Asset,
  type ImageLibraryOptions,
} from 'react-native-image-picker';

const categoryOptions = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Home & Garden', value: 'home-garden' },
  { label: 'Books', value: 'books' },
  { label: 'Sports & Outdoors', value: 'sports' },
  { label: 'Health & Beauty', value: 'health-beauty' },
  { label: 'Toys', value: 'toys' },
  { label: 'Other', value: 'other' },
];

const conditionOptions = [
  { label: 'New', value: 'new' },
  { label: 'Like New', value: 'like-new' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Needs Repair', value: 'needs-repair' },
];

type Navigation = NativeStackNavigationProp<MainStackParamList, 'SellItem'>;

const SellItem: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const [photos, setPhotos] = useState<Asset[]>([]);
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
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

  const handleSubmit = () => {
    Alert.alert(
      'Item posted',
      'Your item has been posted. Interested buyers will be able to contact you soon.',
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
            onChangeText={setTitle}
            containerStyle={{ marginBottom: 12 }}
          />

          <Text variant="md-semibold" style={styles.dropdownLabel}>
            Category
          </Text>
          <Dropdown
            options={categoryOptions}
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
            placeholder="e.g., London"
            value={location}
            onChangeText={setLocation}
            containerStyle={{ marginBottom: 12 }}
          />
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
          title="Post Item"
          fullWidth
          onPress={handleSubmit}
          containerStyle={[styles.buttonSpacing, styles.postButton]}
        />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SellItem;


