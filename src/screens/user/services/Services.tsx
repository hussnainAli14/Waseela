import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
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
import { getListingImage } from '@/utils/placeholders';
import { PP } from '@/utils/responsive';

// Categories managed from Redux


const Services = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | undefined>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Get services from Redux
  const { services: allServices, isLoading, hasMore } = useAppSelector(state => state.services);
  const { serviceCategories } = useAppSelector(state => state.categories);

  // Fetch categories managed by global subscription

  const [refreshing, setRefreshing] = useState(false);

  // Helper function to apply filters and fetch services
  const applyFiltersAndFetch = useCallback(
    async (city: string | undefined, serviceType: string, searchTerm?: string) => {
      const filterObj: any = {
        status: 'approved', // Only show approved services
      };

      if (city && city !== 'all') {
        // Capitalize city name to match database format
        filterObj.city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
      }

      if (serviceType) {
        // Use the exact category name as it comes from the database
        filterObj.serviceType = serviceType;
      }

      // Add search term to filters if provided
      if (searchTerm && searchTerm.trim()) {
        filterObj.search = searchTerm.trim();
      }

      console.log('🔍 Services: Applying filters:', { city, serviceType, searchTerm, filterObj });
      dispatch(resetServices());
      await dispatch(fetchServices({ filters: filterObj, limit: 50 })); // Fetch more for client-side search
    },
    [dispatch],
  );

  // Fetch all services on initial mount
  useEffect(() => {
    console.log('🔍 Services: Initial fetch - loading all services');
    dispatch(resetServices());
    dispatch(fetchServices({ filters: { status: 'approved' }, limit: 20 }));
  }, [dispatch]);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Reset filters to current selection but force re-fetch
    await applyFiltersAndFetch(selectedCity, selectedServiceType, searchValue);
    setRefreshing(false);
  }, [selectedCity, selectedServiceType, searchValue, applyFiltersAndFetch]);

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

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        item.name === selectedServiceType && styles.categoryCardActive,
      ]}
      activeOpacity={0.85}
      onPress={() => handleServiceTypeChange(item.name)}>
      <View
        style={[
          styles.categoryIconWrapper,
          item.name === selectedServiceType && styles.categoryIconWrapperActive,
        ]}>
        <Ionicons
          name={item.icon as string}
          size={PP(22)}
          color={item.name === selectedServiceType ? colors.common.white : colors.text.primary}
        />
      </View>
      <Text
        variant="md-medium"
        style={[
          styles.categoryLabel,
          item.name === selectedServiceType && styles.categoryCardActive,
        ]}>
        {item.name}
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
      // Convert service to ListingItem format with all form fields for Details
      const listingItem: ListingItem = {
        id: item.id,
        name: item.name,
        category: item.serviceType,
        location: item.city,
        rating: item.rating,
        reviews: item.reviewCount,
        verified: item.verified,
        image: getListingImage(item.images, 'service'),
        description: item.description,
        phone: item.phone,
        email: item.email,
        ownerId: item.providerId,
        listingType: 'service',
        whatsapp: item.whatsapp,
        website: item.website,
        instagram: item.instagram,
        openingHours: item.openingHours,
        areasCovered: item.areasCovered,
        tags: item.tags,
      };
      navigation.navigate('Details', { listing: listingItem });
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.fixedHeader}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: PP(12),
          }}>
          <Text variant="xl-bold" style={[styles.headerTitle, { marginBottom: 0 }]}>
            Service Marketplace
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.primary[50],
              paddingVertical: PP(6),
              paddingHorizontal: PP(12),
              borderRadius: PP(20),
            }}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SubmitListing', { initialType: 'service' })}>
            <Ionicons name="add" size={PP(18)} color={colors.primary[700]} />
            <Text
              variant="sm-semibold"
              style={{ color: colors.primary[700], marginLeft: PP(4) }}>
              Post Service
            </Text>
          </TouchableOpacity>
        </View>
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
          data={serviceCategories}
          keyExtractor={item => item.id}
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
                imageUri={getListingImage(item.images, 'service')}
                onPress={() => handlePressListing(item)}
              />
            </View>
          )}
          ItemSeparatorComponent={renderSeparator}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary[500]]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? (
              <View style={{ padding: PP(20), alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.primary[500]} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !isLoading ? (
              <View style={{ padding: PP(20), alignItems: 'center' }}>
                <Ionicons
                  name="briefcase-outline"
                  size={PP(48)}
                  color={colors.text.secondary}
                />
                <Text
                  variant="md-semibold"
                  style={{ marginTop: PP(10), color: colors.text.primary }}>
                  No services found
                </Text>
                <Text
                  variant="sm-normal"
                  style={{ marginTop: PP(5), color: colors.text.secondary }}>
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

