import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { SearchBar, ListingCard, Dropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { ListingItem } from '@/navigation/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchServices, setFilters, resetServices } from '@/store/slices/servicesSlice';

type ServiceTypeItem = { key: string; label: string; icon: string };

const serviceTypeItems: ServiceTypeItem[] = [
  { key: 'tutor', label: 'Tutor', icon: 'book-outline' },
  { key: 'plumber', label: 'Plumber', icon: 'water-outline' },
  { key: 'electrician', label: 'Electrician', icon: 'flash-outline' },
  { key: 'designer', label: 'Designer', icon: 'color-palette-outline' },
  { key: 'cleaner', label: 'Cleaner', icon: 'sparkles-outline' },
  { key: 'driver', label: 'Driver', icon: 'car-outline' },
];

const cityOptions = [
  { label: 'All Cities', value: 'all' },
  { label: 'London', value: 'london' },
  { label: 'Birmingham', value: 'birmingham' },
  { label: 'Manchester', value: 'manchester' },
  { label: 'Leeds', value: 'leeds' },
];

const Services = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | undefined>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Get services from Redux
  const { services, isLoading, hasMore } = useAppSelector(state => state.services);

  // Fetch all services on initial mount
  useEffect(() => {
    console.log('🔍 Services: Initial fetch - loading all services');
    dispatch(resetServices());
    dispatch(fetchServices({ filters: {}, limit: 20 }));
  }, []);

  // Apply filters when user changes them
  useEffect(() => {
    // Skip if this is the initial render (both filters are default)
    if (selectedCity === 'all' && selectedServiceType === '') {
      return;
    }

    console.log('🔍 Services: Applying filters:', { selectedCity, selectedServiceType });

    const filterObj: any = {};

    if (selectedCity && selectedCity !== 'all') {
      filterObj.city = selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1);
    }

    if (selectedServiceType) {
      filterObj.serviceType = selectedServiceType.charAt(0).toUpperCase() + selectedServiceType.slice(1);
    }

    dispatch(resetServices());
    dispatch(fetchServices({ filters: filterObj, limit: 20 }));
  }, [selectedCity, selectedServiceType]);

  // Load more services
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      dispatch(fetchServices({}));
    }
  }, [dispatch, hasMore, isLoading]);

  const renderCategory = ({ item }: { item: ServiceTypeItem }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        item.key === selectedServiceType && styles.categoryCardActive,
      ]}
      activeOpacity={0.85}
      onPress={() => setSelectedServiceType(item.key)}>
      <View
        style={[
          styles.categoryIconWrapper,
          item.key === selectedServiceType && styles.categoryIconWrapperActive,
        ]}>
        <Ionicons
          name={item.icon as string}
          size={22}
          color={item.key === selectedServiceType ? colors.common.white : colors.text.primary}
        />
      </View>
      <Text
        variant="md-medium"
        style={[
          styles.categoryLabel,
          item.key === selectedServiceType && styles.categoryCardActive,
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
            {services.length} services founders found
          </Text>
        </View>
      </>
    ),
    [],
  );

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  const handlePressListing = useCallback(
    (item: typeof services[0]) => {
      const listingItem: ListingItem = {
        id: item.id,
        name: item.name,
        category: item.serviceType,
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
          Service Marketplace
        </Text>
        <View style={styles.searchBlock}>
          <SearchBar
            placeholder="Search service providers..."
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
          data={serviceTypeItems}
          keyExtractor={item => item.key}
          renderItem={renderCategory}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <View style={styles.listArea}>
        <FlatList
          data={services}
          keyExtractor={item => item.id}
          ListHeaderComponent={listHeader}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <ListingCard
                title={item.name}
                category={item.serviceType}
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
                <Ionicons name="briefcase-outline" size={48} color={colors.text.secondary} />
                <Text variant="md-semibold" style={{ marginTop: 10, color: colors.text.primary }}>
                  No services found
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

export default Services;

