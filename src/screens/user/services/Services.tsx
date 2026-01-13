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
import { fetchServices, resetServices } from '@/store/slices/servicesSlice';

type ServiceTypeItem = { key: string; label: string; icon: string };

const serviceTypeItems: ServiceTypeItem[] = [
  { key: 'tutor', label: 'Tutor', icon: 'book-outline' },
  { key: 'plumber', label: 'Plumber', icon: 'water-outline' },
  { key: 'electrician', label: 'Electrician', icon: 'flash-outline' },
  { key: 'designer', label: 'Designer', icon: 'color-palette-outline' },
  { key: 'cleaner', label: 'Cleaner', icon: 'sparkles-outline' },
  { key: 'driver', label: 'Driver', icon: 'car-outline' },
];

const Services = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | undefined>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Get services from Redux
  const { services: allServices, isLoading, hasMore } = useAppSelector(state => state.services);

  // Helper function to apply filters and fetch services
  const applyFiltersAndFetch = useCallback(
    (city: string | undefined, serviceType: string, searchTerm?: string) => {
      const filterObj: any = {};

      if (city && city !== 'all') {
        // Capitalize city name to match database format
        filterObj.city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
      }

      if (serviceType) {
        // Capitalize service type to match database format
        filterObj.serviceType = serviceType.charAt(0).toUpperCase() + serviceType.slice(1).toLowerCase();
      }

      // Add search term to filters if provided
      if (searchTerm && searchTerm.trim()) {
        filterObj.search = searchTerm.trim();
      }

      console.log('🔍 Services: Applying filters:', { city, serviceType, searchTerm, filterObj });
      dispatch(resetServices());
      dispatch(fetchServices({ filters: filterObj, limit: 50 })); // Fetch more for client-side search
    },
    [dispatch],
  );

  // Fetch all services on initial mount
  useEffect(() => {
    console.log('🔍 Services: Initial fetch - loading all services');
    dispatch(resetServices());
    dispatch(fetchServices({ filters: {}, limit: 20 }));
  }, [dispatch]);

  // Handle search input change (debouncing is handled by SearchBar component)
  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchValue(text);
      applyFiltersAndFetch(selectedCity, selectedServiceType, text);
    },
    [selectedCity, selectedServiceType, applyFiltersAndFetch],
  );

  // Handle city selection change
  const handleCityChange = useCallback(
    (city: string | undefined) => {
      setSelectedCity(city);
      applyFiltersAndFetch(city, selectedServiceType, searchValue);
    },
    [selectedServiceType, searchValue, applyFiltersAndFetch],
  );

  // Handle service type selection change (toggle if same type clicked)
  const handleServiceTypeChange = useCallback(
    (serviceType: string) => {
      const newServiceType = selectedServiceType === serviceType ? '' : serviceType;
      setSelectedServiceType(newServiceType);
      applyFiltersAndFetch(selectedCity, newServiceType, searchValue);
    },
    [selectedCity, selectedServiceType, searchValue, applyFiltersAndFetch],
  );

  // Filter services by search term (client-side filtering)
  const services = useMemo(() => {
    if (!searchValue || !searchValue.trim()) {
      return allServices;
    }

    const searchLower = searchValue.toLowerCase().trim();
    return allServices.filter(service => {
      const nameMatch = service.name?.toLowerCase().includes(searchLower);
      const serviceTypeMatch = service.serviceType?.toLowerCase().includes(searchLower);
      const descriptionMatch = service.description?.toLowerCase().includes(searchLower);
      const cityMatch = service.city?.toLowerCase().includes(searchLower);
      
      return nameMatch || serviceTypeMatch || descriptionMatch || cityMatch;
    });
  }, [allServices, searchValue]);

  // Load more services
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading && allServices.length > 0) {
      dispatch(fetchServices({}));
    }
  }, [dispatch, hasMore, isLoading, allServices.length]);

  const renderCategory = ({ item }: { item: ServiceTypeItem }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        item.key === selectedServiceType && styles.categoryCardActive,
      ]}
      activeOpacity={0.85}
      onPress={() => handleServiceTypeChange(item.key)}>
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
            {services.length} services found
          </Text>
        </View>
      </>
    ),
    [services.length],
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

