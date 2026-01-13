import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { SearchBar, ListingCard, CityDropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { ListingItem } from '@/navigation/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBusinesses, resetBusinesses } from '@/store/slices/businessesSlice';

type CategoryItem = { key: string; label: string; icon: string };

const categoryItems: CategoryItem[] = [
  { key: 'food', label: 'Food', icon: 'restaurant' },
  { key: 'retail', label: 'Retail', icon: 'cart-outline' },
  { key: 'legal', label: 'Legal', icon: 'scales-outline' },
  { key: 'health', label: 'Healthcare', icon: 'medkit-outline' },
  { key: 'education', label: 'Education', icon: 'school-outline' },
  { key: 'services', label: 'Services', icon: 'construct-outline' },
];

// Map UI category keys to database category values
const categoryMap: Record<string, string> = {
  food: 'Food',
  retail: 'Retail',
  legal: 'Legal',
  health: 'Healthcare', // Map 'health' key to 'Healthcare' in database
  education: 'Education',
  services: 'Services',
};

const Directory = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | undefined>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Get businesses from Redux
  const { businesses: allBusinesses, isLoading, hasMore } = useAppSelector(state => state.businesses);

  // Helper function to apply filters and fetch businesses
  const applyFiltersAndFetch = useCallback(
    (city: string | undefined, category: string, searchTerm?: string) => {
      const filterObj: any = {};

      if (city && city !== 'all') {
        // Capitalize city name to match database format
        filterObj.city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
      }

      if (category) {
        // Use category map to get the correct database value
        filterObj.category = categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
      }

      // Add search term to filters if provided
      if (searchTerm && searchTerm.trim()) {
        filterObj.search = searchTerm.trim();
      }

      console.log('🔍 Directory: Applying filters:', { city, category, searchTerm, filterObj });
      dispatch(resetBusinesses());
      dispatch(fetchBusinesses({ filters: filterObj, limit: 50 })); // Fetch more for client-side search
    },
    [dispatch],
  );

  // Fetch all businesses on initial mount
  useEffect(() => {
    console.log('🔍 Directory: Initial fetch - loading all businesses');
    dispatch(resetBusinesses());
    dispatch(fetchBusinesses({ filters: {}, limit: 20 }));
  }, [dispatch]);

  // Handle search input change (debouncing is handled by SearchBar component)
  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchValue(text);
      applyFiltersAndFetch(selectedCity, selectedCategory, text);
    },
    [selectedCity, selectedCategory, applyFiltersAndFetch],
  );

  // Handle city selection change
  const handleCityChange = useCallback(
    (city: string | undefined) => {
      setSelectedCity(city);
      applyFiltersAndFetch(city, selectedCategory, searchValue);
    },
    [selectedCategory, searchValue, applyFiltersAndFetch],
  );

  // Handle category selection change (toggle if same category clicked)
  const handleCategoryChange = useCallback(
    (category: string) => {
      const newCategory = selectedCategory === category ? '' : category;
      setSelectedCategory(newCategory);
      applyFiltersAndFetch(selectedCity, newCategory, searchValue);
    },
    [selectedCity, selectedCategory, searchValue, applyFiltersAndFetch],
  );

  // Filter businesses by search term (client-side filtering)
  const businesses = useMemo(() => {
    if (!searchValue || !searchValue.trim()) {
      return allBusinesses;
    }

    const searchLower = searchValue.toLowerCase().trim();
    return allBusinesses.filter(business => {
      const nameMatch = business.name?.toLowerCase().includes(searchLower);
      const categoryMatch = business.category?.toLowerCase().includes(searchLower);
      const descriptionMatch = business.description?.toLowerCase().includes(searchLower);
      const cityMatch = business.city?.toLowerCase().includes(searchLower);
      
      return nameMatch || categoryMatch || descriptionMatch || cityMatch;
    });
  }, [allBusinesses, searchValue]);

  // Load more businesses
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading && allBusinesses.length > 0) {
      dispatch(fetchBusinesses({}));
    }
  }, [dispatch, hasMore, isLoading, allBusinesses.length]);

  const renderCategory = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        item.key === selectedCategory && styles.categoryCardActive,
      ]}
      activeOpacity={0.85}
      onPress={() => handleCategoryChange(item.key)}>
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
            onChangeText={handleSearchChange}
          />
          <CityDropdown
            selectedValue={selectedCity}
            onSelect={handleCityChange}
            placeholder="All Cities"
            includeAllOption={true}
            valueFormat="lowercase"
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

