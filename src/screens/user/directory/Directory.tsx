import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { SearchBar, ListingCard, Dropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { MainStackParamList, ListingItem } from '@/navigation/types';

type CategoryItem = { key: string; label: string; icon: string };

const categoryItems: CategoryItem[] = [
  { key: 'food', label: 'Food', icon: 'restaurant' },
  { key: 'retail', label: 'Retail', icon: 'cart-outline' },
  { key: 'legal', label: 'Legal', icon: 'scales-outline' },
  { key: 'health', label: 'Healthcare', icon: 'medkit-outline' },
  { key: 'education', label: 'Education', icon: 'school-outline' },
  { key: 'services', label: 'Services', icon: 'construct-outline' },
];

const directoryListings = [
  {
    id: '1',
    name: 'Al-Zahra Restaurant',
    category: 'Food',
    location: 'London',
    rating: 4.8,
    reviews: 124,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1604908177520-4025a13da5b1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Noor Grocery',
    category: 'Retail',
    location: 'Birmingham',
    rating: 4.6,
    reviews: 89,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1515705576963-95cad62945b6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: 'Al-Hadi Legal Services',
    category: 'Legal',
    location: 'Manchester',
    rating: 4.9,
    reviews: 56,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: 'Hussainiya Pharmacy',
    category: 'Healthcare',
    location: 'Leeds',
    rating: 4.7,
    reviews: 72,
    verified: false,
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
  },
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
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

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
            {directoryListings.length} businesses found
          </Text>
        </View>
      </>
    ),
    [],
  );

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  const handlePressListing = useCallback(
    (item: typeof directoryListings[0]) => {
      navigation.navigate('Details', {
        listing: item as ListingItem,
      });
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
          data={directoryListings}
          keyExtractor={item => item.id}
          ListHeaderComponent={listHeader}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <ListingCard
                title={item.name}
                category={item.category}
                location={item.location}
                rating={item.rating}
                reviews={item.reviews}
                verified={item.verified}
                imageUri={item.image}
                onPress={() => handlePressListing(item)}
              />
            </View>
          )}
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </View>
    </SafeAreaView>
  );
};

export default Directory;

