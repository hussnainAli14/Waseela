import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Text, Image } from '@/components/atoms';
import { Card, SearchBar } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { MainStackParamList, MarketItem } from '@/navigation/types';

type CategoryItem = { key: string; label: string };

const categoryItems: CategoryItem[] = [
  { key: 'all', label: 'All' },
  { key: 'furniture', label: 'Furniture' },
  { key: 'electronics', label: 'Electronics' },
  { key: 'clothing', label: 'Clothing' },
  { key: 'books', label: 'Books' },
];

const itemsForSale: MarketItem[] = [
  {
    id: 'm1',
    title: 'Modern Dining Table Set',
    price: '£250',
    location: 'London',
    condition: 'Good',
    category: 'Furniture',
    image:
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=600&q=80',
    safetyTips: [
      'Meet in a public place',
      'Check the item before paying',
      'Never share sensitive information',
    ],
  },
  {
    id: 'm2',
    title: 'iPhone 13 Pro - 256GB',
    price: '£450',
    location: 'Birmingham',
    condition: 'Like New',
    category: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    safetyTips: [
      'Meet in a public place',
      'Check the phone’s IMEI and condition before paying',
      'Never share sensitive information',
    ],
  },
  {
    id: 'm3',
    title: 'Designer Abaya Collection',
    price: '£80',
    location: 'Manchester',
    condition: 'New',
    category: 'Clothing',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    safetyTips: [
      'Meet in a public place',
      'Check sizes and quality before paying',
      'Never share sensitive information',
    ],
  },
  {
    id: 'm4',
    title: 'Islamic Books Collection',
    price: '£40',
    location: 'Leeds',
    condition: 'Good',
    category: 'Books',
    image:
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
    safetyTips: [
      'Meet in a public place',
      'Check book condition before paying',
      'Never share sensitive information',
    ],
  },
  {
    id: 'm5',
    title: 'Prayer Mat Set',
    price: '£25',
    location: 'London',
    condition: 'New',
    category: 'Home',
    image:
      'https://images.unsplash.com/photo-1611074679981-2b8eab0f5f75?auto=format&fit=crop&w=600&q=80',
    safetyTips: [
      'Meet in a public place',
      'Check fabric quality before paying',
      'Never share sensitive information',
    ],
  },
  {
    id: 'm6',
    title: 'Kids Study Desk',
    price: '£60',
    location: 'Birmingham',
    condition: 'Good',
    category: 'Furniture',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    safetyTips: [
      'Meet in a public place',
      'Check for any damages before paying',
      'Never share sensitive information',
    ],
  },
];

const BuySell = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSold, setShowSold] = useState(false);
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const renderCategory = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        item.key === selectedCategory && styles.categoryChipActive,
      ]}
      activeOpacity={0.85}
      onPress={() => setSelectedCategory(item.key)}>
      <Text
        variant="md-medium"
        style={[
          styles.categoryChipLabel,
          item.key === selectedCategory && styles.categoryChipLabelActive,
        ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const filteredItems = useMemo(() => itemsForSale, []);

  const handlePressItem = useCallback(
    (item: MarketItem) => {
      navigation.navigate('MarketItemDetails', { item });
    },
    [navigation],
  );

  const renderItemCard = ({ item }: { item: MarketItem }) => {
    const conditionStyle =
      item.condition === 'Like New'
        ? styles.conditionLikeNew
        : item.condition === 'New'
        ? styles.conditionNew
        : styles.conditionGood;

    return (
      <Card
        style={styles.itemCard}
        backgroundColor={colors.background.light}
        padding={0}
        onPress={() => handlePressItem(item)}>
        <View style={styles.itemImageWrapper}>
          <Image
            source={{ uri: item.image }}
            resizeMode="cover"
            containerStyle={styles.itemImage}
            borderRadius={18}
          />
          <View style={[styles.conditionPill, conditionStyle]}>
            <Text variant="sm-medium" style={styles.conditionText}>
              {item.condition}
            </Text>
          </View>
        </View>
        <View style={styles.itemContent}>
          <Text variant="lg-semibold" style={styles.priceText}>
            {item.price}
          </Text>
          <Text variant="md-normal" style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.text.secondary}
            />
            <Text variant="sm-medium" style={styles.locationText}>
              {item.location}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderSeparator = useCallback(
    () => <View style={styles.gridSeparator} />,
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.fixedHeader}>
        <Text variant="xl-bold" style={styles.headerTitle}>
          Community Marketplace
        </Text>
        <View style={styles.searchBlock}>
          <SearchBar
            placeholder="Search items for sale..."
            value={searchValue}
            onChangeText={setSearchValue}
          />
          <TouchableOpacity style={styles.sellButton} activeOpacity={0.85}>
            <Ionicons
              name="add"
              size={20}
              color={colors.accent.purple}
            />
            <Text variant="md-semibold" style={styles.sellButtonText}>
              Sell Something
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoryBar}>
        <FlatList
          data={categoryItems}
          keyExtractor={item => item.key}
          renderItem={renderCategory}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
        <TouchableOpacity
          style={[
            styles.showSoldButton,
            showSold && styles.showSoldButtonActive,
          ]}
          activeOpacity={0.85}
          onPress={() => setShowSold(prev => !prev)}>
          <Text variant="md-medium" style={styles.showSoldText}>
            {showSold ? 'Hide sold items' : 'Show sold items'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listArea}>
        <View style={styles.sectionHeader}>
          <Text variant="lg-semibold" style={styles.sectionTitle}>
            {filteredItems.length} items for sale
          </Text>
        </View>
        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          renderItem={renderItemCard}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

export default BuySell;



