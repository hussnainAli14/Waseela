import React, { useMemo, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Text, Image } from '@/components/atoms';
import { Card, Dropdown, SearchBar } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { RoomItem } from '@/navigation/types';
import { MainStackParamList } from '@/navigation/types';

type RoomType = 'all' | 'single' | 'double' | 'studio' | 'shared';

const cityOptions = [
  { label: 'All Cities', value: 'all' },
  { label: 'London', value: 'London' },
  { label: 'Birmingham', value: 'Birmingham' },
  { label: 'Manchester', value: 'Manchester' },
  { label: 'Leeds', value: 'Leeds' },
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

const rooms: RoomItem[] = [
  {
    id: 'r1',
    title: 'Cozy Single Room near UCL',
    city: 'London',
    type: 'single',
    price: 650,
    priceLabel: '£650/mo',
    image:
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=600&q=80',
    billsIncluded: true,
    locationLine1: 'Camden, London',
    locationLine2: 'Near UCL',
    description:
      'Bright single room in a friendly shared house. Close to UCL campus, 5 min walk to tube station. Fully furnished with desk and wardrobe.',
    amenities: ['WiFi', 'Kitchen', 'Washing Machine', 'Garden'],
    availableFrom: '1st March 2025',
    landlordName: 'Fatima K.',
    postedAt: '2 days ago',
  },
  {
    id: 'r2',
    title: 'Double Room - University of Birmingham',
    city: 'Birmingham',
    type: 'double',
    price: 800,
    priceLabel: '£800/mo',
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80',
    billsIncluded: true,
    locationLine1: 'Selly Oak, Birmingham',
    locationLine2: 'Near University of Birmingham',
    description:
      'Spacious double room in a modern shared house. Perfect for students. Close to university campus and local amenities.',
    amenities: ['WiFi', 'Kitchen', 'Washing Machine'],
    availableFrom: '15th February 2025',
    landlordName: 'Ahmed M.',
    postedAt: '1 day ago',
  },
  {
    id: 'r3',
    title: 'Studio Apartment - Manchester City Centre',
    city: 'Manchester',
    type: 'studio',
    price: 950,
    priceLabel: '£950/mo',
    image:
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=600&q=80',
    billsIncluded: true,
    locationLine1: 'City Centre, Manchester',
    locationLine2: 'Near University of Manchester',
    description:
      'Modern studio apartment in the heart of Manchester. Fully furnished with all amenities. Perfect for professionals or students.',
    amenities: ['WiFi', 'Kitchen', 'Washing Machine', 'Garden'],
    availableFrom: '1st April 2025',
    landlordName: 'Sarah L.',
    postedAt: '3 days ago',
  },
  {
    id: 'r4',
    title: 'Shared Room - Leeds University',
    city: 'Leeds',
    type: 'shared',
    price: 400,
    priceLabel: '£400/mo',
    image:
      'https://images.unsplash.com/photo-1521783593447-5702f2b77f71?auto=format&fit=crop&w=600&q=80',
    billsIncluded: true,
    locationLine1: 'Hyde Park, Leeds',
    locationLine2: 'Near University of Leeds',
    description:
      'Affordable shared room in a friendly student house. Great location near university and public transport.',
    amenities: ['WiFi', 'Kitchen', 'Washing Machine'],
    availableFrom: '1st March 2025',
    landlordName: 'Mohammed A.',
    postedAt: '5 days ago',
  },
  {
    id: 'r5',
    title: 'Bright Double Room near City Campus',
    city: 'Birmingham',
    type: 'double',
    price: 720,
    priceLabel: '£720/mo',
    image:
      'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?auto=format&fit=crop&w=600&q=80',
    billsIncluded: true,
    locationLine1: 'City Centre, Birmingham',
    locationLine2: 'Close to amenities',
    description:
      'Bright and airy double room in a well-maintained property. Close to city center and all amenities.',
    amenities: ['WiFi', 'Kitchen', 'Washing Machine', 'Garden'],
    availableFrom: '20th February 2025',
    landlordName: 'Aisha K.',
    postedAt: '1 week ago',
  },
];

const RoomFinder = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedMaxRent, setSelectedMaxRent] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<RoomType>('all');
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesCity =
        selectedCity === 'all' || room.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesType = selectedType === 'all' || room.type === selectedType;
      const matchesRent =
        selectedMaxRent == null || room.price <= selectedMaxRent;
      const matchesSearch =
        !searchValue ||
        room.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        room.locationLine1.toLowerCase().includes(searchValue.toLowerCase());

      return matchesCity && matchesType && matchesRent && matchesSearch;
    });
  }, [selectedCity, selectedType, selectedMaxRent, searchValue]);

  const handleRoomPress = useCallback(
    (room: RoomItem) => {
      navigation.navigate('RoomDetails', { room });
    },
    [navigation],
  );

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
            onChangeText={setSearchValue}
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
        ListHeaderComponent={
          <View style={styles.filtersSection}>
            <View style={styles.filterBlock}>
              <Text variant="md-medium" style={styles.filterLabel}>
                City
              </Text>
              <Dropdown
                options={cityOptions}
                selectedValue={selectedCity}
                onSelect={setSelectedCity}
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
                      onPress={() =>
                        setSelectedMaxRent(prev =>
                          prev === option.value ? null : option.value,
                        )
                      }>
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
                      onPress={() => setSelectedType(filter.key)}>
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
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default RoomFinder;


