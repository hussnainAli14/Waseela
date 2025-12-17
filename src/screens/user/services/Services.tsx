import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, TouchableOpacity, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { SearchBar, ListingCard, Dropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { ListingItem } from '@/navigation/types';

type CategoryItem = { key: string; label: string; icon: string };

const categoryItems: CategoryItem[] = [
  { key: 'tutor', label: 'Tutor', icon: 'school-outline' },
  { key: 'plumber', label: 'Plumber', icon: 'construct-outline' },
  { key: 'electrician', label: 'Electrician', icon: 'flash-outline' },
  { key: 'designer', label: 'Designer', icon: 'color-palette-outline' },
  { key: 'caterer', label: 'Caterer', icon: 'restaurant' },
];

const serviceListings = [
  {
    id: 's1',
    name: 'Fatima Ahmed',
    category: 'Quran Tutor',
    location: 'London',
    rating: 5,
    reviews: 42,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 's2',
    name: 'Hassan Ali',
    category: 'Plumber',
    location: 'Birmingham',
    rating: 4.8,
    reviews: 67,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 's3',
    name: 'Zahra Hussain',
    category: 'Graphic Designer',
    location: 'Manchester',
    rating: 4.9,
    reviews: 38,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  },
];

const cityOptions = [
  { label: 'All Cities', value: 'all' },
  { label: 'London', value: 'london' },
  { label: 'Birmingham', value: 'birmingham' },
  { label: 'Manchester', value: 'manchester' },
];

const Services = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | undefined>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const navigation = useNavigation<NavigationProp<any>>();

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
            {serviceListings.length} service providers found
          </Text>
        </View>
      </>
    ),
    [],
  );

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  const handlePressListing = useCallback(
    (item: typeof serviceListings[0]) => {
      navigation.navigate('Details', {
        listing: item as ListingItem,
      });
    },
    [navigation],
  );

  const handleContact = useCallback((item: typeof serviceListings[0]) => {
    const phone = (item as any).phone || '0000000000';
    const url = `https://wa.me/${phone}`;
    Linking.openURL(url).catch(() => {});
  }, []);

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
          data={serviceListings}
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
                variant="cta"
                ctaLabel="Contact"
                onPress={() => handlePressListing(item)}
                onPressCta={() => handleContact(item)}
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

export default Services;

