import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { SearchBar, ListingCard, Dropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { ListingItem } from '@/navigation/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBusinesses, setFilters, resetBusinesses } from '@/store/slices/businessesSlice';

type CategoryItem = { key: string; label: string; icon: string };

const categoryItems: CategoryItem[] = [
  { key: 'food', label: 'Food', icon: 'restaurant' },
  { key: 'retail', label: 'Retail', icon: 'cart-outline' },
  { key: 'legal', label: 'Legal', icon: 'scales-outline' },
  { key: 'health', label: 'Healthcare', icon: 'medkit-outline' },
  { key: 'education', label: 'Education', icon: 'school-outline' },
  { key: 'services', label: 'Services', icon: 'construct-outline' },
];

const cityOptions = [
  { label: 'All Cities', value: 'all' },
  { label: 'London', value: 'london' },
  { label: 'Birmingham', value: 'birmingham' },
  { label: 'Manchester', value: 'manchester' },
  { label: 'Leeds', value: 'leeds' },
];

const Directory = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | undefined>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Get businesses from Redux
  const { businesses, isLoading, hasMore, filters } = useAppSelector(state => state.businesses);

  // Fetch all businesses on initial mount
  useEffect(() => {
    console.log('🔍 Directory: Initial fetch - loading all businesses');
    dispatch(resetBusinesses());
    dispatch(fetchBusinesses({ filters: {}, limit: 20 }));
  }, []);

  // Apply filters when user changes them
  useEffect(() => {
    // Skip if this is the initial render (both filters are default)
    if (selectedCity === 'all' && selectedCategory === '') {
      return;
    }

    console.log('🔍 Directory: Applying filters:', { selectedCity, selectedCategory });

    const filterObj: any = {};

    if (selectedCity && selectedCity !== 'all') {
      filterObj.city = selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1);
    }

    if (selectedCategory) {
      filterObj.category = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
    }

    dispatch(resetBusinesses());
    dispatch(fetchBusinesses({ filters: filterObj, limit: 20 }));
  }, [selectedCity, selectedCategory]);

  // Load more businesses
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      dispatch(fetchBusinesses({}));
    }
  }, [dispatch, hasMore, isLoading]);

  const renderCategory = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        item.key === selectedCategory && styles.categoryCardActive,
      ]}
      activeOpacity={0.85}
      onPress={() => setSelectedCategory(item.key)}>
      <View
        style={[
          styles.categoryIconWrapper,
          item.key === selectedCategory && styles.categoryIconWrapperActive,
        ]}>
        <Ionicons
          name={item.icon as string}
          size={22}
          color={item.key === selectedCategory ? colors.secondary[500] : colors.text.secondary}
        />
      </View>
      <Text
        variant="md-medium"
        style={[
          styles.categoryLabel,
          item.key === selectedCategory && styles.categoryLabelActive,
        ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const listHeader = useMemo(
    () => (
      <>
        <View style={styles.sectionHeader}>
          <Text variant="lg-semibold" style={styles.sectionTitle}>
            {businesses.length} businesses found
          </Text>
        </View>
      </>
    ),
    [businesses.length],
  );

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  const handlePressListing = useCallback(
    (item: typeof businesses[0]) => {
      // Convert business to ListingItem format
      const listingItem: ListingItem = {
        id: item.id,
        name: item.name,
        category: item.category,
        location: item.city,
        rating: item.rating,
        reviews: item.reviewCount,
        verified: item.verified,
        image: item.images[0] || 'https://via.placeholder.com/600',
      };
      navigation.navigate('Details', { listing: listingItem });
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.fixedHeader}>
        <Text variant="xl-bold" style={styles.headerTitle}>
          Business Directory
        </Text>
        <View style={styles.searchBlock}>
          <SearchBar
            placeholder="Search businesses..."
            value={searchValue}
            onChangeText={setSearchValue}
          />
          <Dropdown
            options={cityOptions}
            selectedValue={selectedCity}
            onSelect={setSelectedCity}
            placeholder="All Cities"
            buttonStyle={styles.citySelector}
            buttonTextStyle={styles.citySelectorText}
          />
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
      </View>

      <View style={styles.listArea}>
        <FlatList
          data={businesses}
          keyExtractor={item => item.id}
          ListHeaderComponent={listHeader}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <ListingCard
                title={item.name}
                category={item.category}
                location={item.city}
                rating={item.rating}
                reviews={item.reviewCount}
                verified={item.verified}
                imageUri={item.images[0] || 'https://via.placeholder.com/600'}
                onPress={() => handlePressListing(item)}
              />
            </View>
          )}
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.primary[500]} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !isLoading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Ionicons name="business-outline" size={48} color={colors.text.secondary} />
                <Text variant="md-semibold" style={{ marginTop: 10, color: colors.text.primary }}>
                  No businesses found
                </Text>
                <Text variant="sm-normal" style={{ marginTop: 5, color: colors.text.secondary }}>
                  Try adjusting your filters
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Directory;

