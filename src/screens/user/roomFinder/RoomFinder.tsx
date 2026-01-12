import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Text, Image } from '@/components/atoms';
import { Card, Dropdown, SearchBar } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { RoomItem } from '@/navigation/types';
import { MainStackParamList } from '@/navigation/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRooms, resetRooms } from '@/store/slices/roomsSlice';
import type { Room } from '@/types/firestore';

type RoomType = 'all' | 'single' | 'double' | 'studio' | 'shared';

const cityOptions = [
  { label: 'All Cities', value: 'all' },
  { label: 'London', value: 'london' },
  { label: 'Birmingham', value: 'birmingham' },
  { label: 'Manchester', value: 'manchester' },
  { label: 'Leeds', value: 'leeds' },
];

const rentOptions = [
  { label: '£500', value: 500 },
  { label: '£700', value: 700 },
  { label: '£900', value: 900 },
];

const roomTypeFilters: { key: RoomType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'single', label: 'Single' },
  { key: 'double', label: 'Double' },
  { key: 'studio', label: 'Studio' },
  { key: 'shared', label: 'Shared' },
];

// Helper function to convert Room to RoomItem
const convertRoomToRoomItem = (room: Room): RoomItem => {
  return {
    id: room.id,
    title: room.title,
    city: room.city,
    type: room.type,
    price: room.price,
    priceLabel: room.priceLabel,
    image: room.images[0] || 'https://via.placeholder.com/600',
    billsIncluded: room.billsIncluded,
    locationLine1: room.locationLine1,
    locationLine2: room.locationLine2 || '',
    description: room.description,
    amenities: room.amenities,
    availableFrom: typeof room.availableFrom === 'string' 
      ? new Date(room.availableFrom).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : room.availableFrom?.toDate?.().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) || '',
  };
};

const RoomFinder = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedMaxRent, setSelectedMaxRent] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<RoomType>('all');
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();

  // Get rooms from Redux
  const { rooms: allRooms, isLoading } = useAppSelector(state => state.rooms);
  const [refreshing, setRefreshing] = useState(false);

  // Helper function to apply filters and fetch rooms
  const applyFiltersAndFetch = useCallback(
    (city: string, roomType: RoomType, maxRent: number | null, searchTerm?: string) => {
      const filterObj: any = {};

      if (city && city !== 'all') {
        // Capitalize city name to match database format
        filterObj.city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
      }

      if (roomType && roomType !== 'all') {
        filterObj.type = roomType;
      }

      if (maxRent) {
        filterObj.maxPrice = maxRent;
      }

      // Add search term to filters if provided
      if (searchTerm && searchTerm.trim()) {
        filterObj.search = searchTerm.trim();
      }

      console.log('🔍 RoomFinder: Applying filters:', { city, roomType, maxRent, searchTerm, filterObj });
      dispatch(resetRooms());
      dispatch(fetchRooms({ filters: filterObj, limit: 50 })); // Fetch more for client-side search
    },
    [dispatch],
  );

  // Fetch all rooms on initial mount
  useEffect(() => {
    console.log('🔍 RoomFinder: Initial fetch - loading all rooms');
    dispatch(resetRooms());
    dispatch(fetchRooms({ filters: {}, limit: 20 }));
  }, [dispatch]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      console.log('🔄 RoomFinder: Refreshing data...');
      dispatch(resetRooms());
      const filterObj: any = {};

      if (selectedCity && selectedCity !== 'all') {
        filterObj.city = selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1).toLowerCase();
      }

      if (selectedType && selectedType !== 'all') {
        filterObj.type = selectedType;
      }

      if (selectedMaxRent) {
        filterObj.maxPrice = selectedMaxRent;
      }

      if (searchValue && searchValue.trim()) {
        filterObj.search = searchValue.trim();
      }

      await dispatch(fetchRooms({ filters: filterObj, limit: 50 })).unwrap();
    } catch (error) {
      console.error('Error refreshing rooms:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, selectedCity, selectedType, selectedMaxRent, searchValue]);

  // Handle search input change (debouncing is handled by SearchBar component)
  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchValue(text);
      applyFiltersAndFetch(selectedCity, selectedType, selectedMaxRent, text);
    },
    [selectedCity, selectedType, selectedMaxRent, applyFiltersAndFetch],
  );

  // Handle city selection change
  const handleCityChange = useCallback(
    (city: string | undefined) => {
      const cityValue = city || 'all';
      setSelectedCity(cityValue);
      applyFiltersAndFetch(cityValue, selectedType, selectedMaxRent, searchValue);
    },
    [selectedType, selectedMaxRent, searchValue, applyFiltersAndFetch],
  );

  // Handle room type selection change
  const handleTypeChange = useCallback(
    (type: RoomType) => {
      setSelectedType(type);
      applyFiltersAndFetch(selectedCity, type, selectedMaxRent, searchValue);
    },
    [selectedCity, selectedMaxRent, searchValue, applyFiltersAndFetch],
  );

  // Handle max rent selection change
  const handleMaxRentChange = useCallback(
    (maxRent: number | null) => {
      setSelectedMaxRent(maxRent);
      applyFiltersAndFetch(selectedCity, selectedType, maxRent, searchValue);
    },
    [selectedCity, selectedType, searchValue, applyFiltersAndFetch],
  );

  // Filter rooms by search term (client-side filtering)
  const filteredRooms = useMemo(() => {
    // Convert Room[] to RoomItem[]
    let roomItems = allRooms.map(convertRoomToRoomItem);

    // Apply client-side search filtering
    if (searchValue && searchValue.trim()) {
      const searchLower = searchValue.toLowerCase().trim();
      roomItems = roomItems.filter(room => {
        const nameMatch = room.title?.toLowerCase().includes(searchLower);
        const locationMatch = room.locationLine1?.toLowerCase().includes(searchLower);
        const descriptionMatch = room.description?.toLowerCase().includes(searchLower);
        
        return nameMatch || locationMatch || descriptionMatch;
      });
    }

    return roomItems;
  }, [allRooms, searchValue]);

  const handleRoomPress = useCallback(
    (room: RoomItem) => {
      navigation.navigate('RoomDetails', { room });
    },
    [navigation],
  );

  const renderSeparator = useCallback(() => <View style={styles.listSeparator} />, []);

  const renderRoomCard = useCallback(
    ({ item }: { item: RoomItem }) => (
      <Card
        style={styles.roomCard}
        backgroundColor={colors.background.light}
        padding={0}
        onPress={() => handleRoomPress(item)}>
        <View style={styles.roomCardContent}>
          <Image
            source={{ uri: item.image }}
            resizeMode="cover"
            containerStyle={styles.roomImage}
            borderRadius={18}
          />
          <View style={styles.roomInfo}>
            <Text variant="md-semibold" style={styles.roomTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text variant="sm-medium" style={styles.badgeText}>
                  {item.type === 'single'
                    ? 'Single'
                    : item.type === 'double'
                    ? 'Double'
                    : item.type === 'studio'
                    ? 'Studio'
                    : 'Shared'}
                </Text>
              </View>
              {item.billsIncluded && (
                <View style={[styles.badge, styles.billsBadge]}>
                  <Text variant="sm-medium" style={styles.billsBadgeText}>
                    Bills Inc.
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.priceRow}>
              <Text variant="lg-semibold" style={styles.priceText}>
                {item.priceLabel}
              </Text>
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={colors.text.secondary}
                />
                <Text variant="sm-medium" style={styles.locationText}>
                  {item.locationLine1}
                </Text>
              </View>
            </View>
            <Text variant="sm-medium" style={styles.subLocationText} numberOfLines={1}>
              {item.locationLine2}
            </Text>
          </View>
        </View>
      </Card>
    ),
    [handleRoomPress],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text variant="xl-bold" style={styles.headerTitle}>
          Room Finder
        </Text>
        <View style={styles.searchBlock}>
          <SearchBar
            placeholder="Search rooms or areas..."
            value={searchValue}
            onChangeText={handleSearchChange}
          />
          <TouchableOpacity
            style={styles.postButton}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('PostRoom')}>
            <Ionicons
              name="add"
              size={20}
              color={colors.accent.orange}
            />
            <Text variant="md-semibold" style={styles.postButtonText}>
              Post Your Room
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredRooms}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
        ListHeaderComponent={
          <View style={styles.filtersSection}>
            <View style={styles.filterBlock}>
              <Text variant="md-medium" style={styles.filterLabel}>
                City
              </Text>
              <Dropdown
                options={cityOptions}
                selectedValue={selectedCity}
                onSelect={handleCityChange}
                buttonStyle={styles.cityDropdown}
              />
            </View>

            <View style={styles.filterBlock}>
              <Text variant="md-medium" style={styles.filterLabel}>
                Max Monthly Rent
              </Text>
              <View style={styles.rentRow}>
                {rentOptions.map(option => {
                  const isActive = selectedMaxRent === option.value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.rentChip,
                        isActive && styles.rentChipActive,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => handleMaxRentChange(
                        selectedMaxRent === option.value ? null : option.value
                      )}>
                      <Text
                        variant="md-medium"
                        style={[
                          styles.rentChipText,
                          isActive && styles.rentChipTextActive,
                        ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.filterBlock}>
              <Text variant="md-medium" style={styles.filterLabel}>
                Room Type
              </Text>
              <View style={styles.roomTypeRow}>
                {roomTypeFilters.map(filter => {
                  const isActive = selectedType === filter.key;
                  return (
                    <TouchableOpacity
                      key={filter.key}
                      style={[
                        styles.typeChip,
                        isActive && styles.typeChipActive,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => handleTypeChange(filter.key)}>
                      <Text
                        variant="md-medium"
                        style={[
                          styles.typeChipText,
                          isActive && styles.typeChipTextActive,
                        ]}>
                        {filter.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Text variant="md-medium" style={styles.resultsText}>
              {filteredRooms.length} rooms available
            </Text>
          </View>
        }
        renderItem={renderRoomCard}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isLoading && !refreshing ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={colors.primary[500]} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading && !refreshing ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Ionicons name="home-outline" size={48} color={colors.text.secondary} />
              <Text variant="md-semibold" style={{ marginTop: 10, color: colors.text.primary }}>
                No rooms found
              </Text>
              <Text variant="sm-normal" style={{ marginTop: 5, color: colors.text.secondary }}>
                Try adjusting your filters
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default RoomFinder;


