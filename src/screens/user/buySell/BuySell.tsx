import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Text, Image } from '@/components/atoms';
import { Card, SearchBar } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { MainStackParamList, MarketItem } from '@/navigation/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts, resetProducts } from '@/store/slices/productsSlice';
import type { Product } from '@/types/firestore';
import { getListingImage } from '@/utils/placeholders';

// Categories managed from Redux


const BuySell = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector(state => state.products);
  const { marketplaceCategories } = useAppSelector(state => state.categories);

  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSold, setShowSold] = useState(false);
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  // Fetch products and categories on mount
  useEffect(() => {
    dispatch(fetchProducts({
      filters: {
        status: 'approved', // Only show approved products
      },
      limit: 50,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prepare categories for display (prepend 'All')
  const displayCategories = useMemo(() => {
    const allOption = { key: 'all', label: 'All' };
    const dynamicCats = marketplaceCategories.map(cat => ({
      key: cat.name,
      label: cat.name,
    }));
    return [allOption, ...dynamicCats];
  }, [marketplaceCategories]);

  // Convert Product to MarketItem format
  const convertProductToMarketItem = useCallback((product: Product): MarketItem => {
    // Format condition for display
    const conditionMap: Record<string, string> = {
      'new': 'New',
      'like-new': 'Like New',
      'good': 'Good',
      'fair': 'Fair',
      'needs-repair': 'Needs Repair',
    };

    return {
      id: product.id,
      title: product.title,
      price: `£${product.price}`,
      location: product.city,
      condition: conditionMap[product.condition] || product.condition,
      category: product.category,
      image: getListingImage(product.images, 'product'),
      description: product.description,
      safetyTips: [
        'Meet in a public place',
        'Check the item before paying',
        'Never share sensitive information',
      ],
    };
  }, []);

  const renderCategory = ({ item }: { item: { key: string; label: string } }) => (
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

  // Filter products based on category and search
  const filteredItems = useMemo(() => {
    let filtered = products
      .filter((product: Product) => product.status === 'approved') // Only show approved products
      .map(convertProductToMarketItem);

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item: MarketItem) => {
        const categoryLower = item.category.toLowerCase();
        const selectedLower = selectedCategory.toLowerCase();
        return categoryLower === selectedLower || categoryLower.includes(selectedLower);
      });
    }

    // Filter by search
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(
        (item: MarketItem) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.location.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchValue, convertProductToMarketItem]);

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
          <TouchableOpacity
            style={styles.sellButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SellItem')}>
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
          data={displayCategories}
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text variant="sm-normal" style={styles.loadingText}>
              Loading products...
            </Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-outline" size={48} color={colors.text.secondary} />
            <Text variant="md-semibold" style={styles.emptyTitle}>
              No products found
            </Text>
            <Text variant="sm-normal" style={styles.emptySubtitle}>
              {searchValue || selectedCategory !== 'all'
                ? 'Try adjusting your filters'
                : 'Be the first to list an item!'}
            </Text>
          </View>
        ) : (
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
        )}
      </View>
    </SafeAreaView>
  );
};

export default BuySell;
