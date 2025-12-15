import React, { useCallback, useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Header, SearchBar, ListingCard } from '@/components/molecules';
import { Text } from '@/components/atoms';
import { colors } from '@/theme';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { MainStackParamList, ListingItem } from '@/navigation/types';

const exploreItems = [
  {
    key: 'directory',
    title: 'Business Directory',
    icon: 'storefront-outline',
    background: colors.secondary[500],
  },
  {
    key: 'services',
    title: 'Service Marketplace',
    icon: 'briefcase-outline',
    background: colors.primary[500],
  },
  {
    key: 'buy-sell',
    title: 'Buy & Sell',
    icon: 'bag-outline',
    background: colors.accent.purple,
  },
  {
    key: 'rooms',
    title: 'Room Finder',
    icon: 'home-outline',
    background: colors.accent.orange,
  },
];

const featuredListings = [
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
    name: 'Fatima Ahmed',
    category: 'Quran Tutor',
    location: 'London',
    rating: 5,
    reviews: 42,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  },
];

const Home = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const handleExplorePress = useCallback(
    (key: string) => {
      if (key === 'directory') {
        navigation.navigate('Directory');
      } else if (key === 'services') {
        navigation.navigate('Services');
      } else if (key === 'buy-sell') {
        navigation.navigate('BuySell');
      } else if (key === 'rooms') {
        navigation.navigate('RoomFinder');
      }
    },
    [navigation],
  );

  const renderFixedHeader = useMemo(
    () => (
      <Header contentStyle={styles.headerContent}>
        <Text variant="xl-bold" style={styles.headerTitle}>
          Waseela
        </Text>
        <Text variant="lg-normal" style={styles.headerSubtitle}>
          Supporting our community
        </Text>
        <View style={styles.searchWrapper}>
          <SearchBar
            placeholder="Search businesses or services..."
            value={searchValue}
            onChangeText={setSearchValue}
            rightIcon={
              <Ionicons
                name="mic-outline"
                size={20}
                color={colors.text.secondary}
              />
            }
          />
        </View>
      </Header>
    ),
    [searchValue],
  );

  const renderListHeader = useMemo(
    () => (
      <View>
        <View style={styles.section}>
          <Text variant="lg-semibold" style={styles.sectionTitle}>
            Explore
          </Text>
          <FlatList
            data={exploreItems}
            keyExtractor={item => item.key}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.exploreListContent}
            columnWrapperStyle={styles.exploreRow}
            renderItem={({ item }) => (
              <Card
                style={[styles.exploreCard, { borderColor: colors.border.light }]}
                backgroundColor={colors.background.light}
                padding={16}
                contentStyle={styles.exploreContent}
                onPress={() => handleExplorePress(item.key)}>
                <View
                  style={[
                    styles.exploreIconWrapper,
                    { backgroundColor: item.background },
                  ]}>
                  <Ionicons name={item.icon} size={26} color={colors.common.white} />
                </View>
                <Text variant="md-semibold" style={styles.exploreLabel}>
                  {item.title}
                </Text>
              </Card>
            )}
          />
          <Card
            style={[styles.networkCard, { borderColor: colors.border.light }]}
            backgroundColor={colors.background.light}
            padding={18}
            onPress={() => navigation.navigate('ProfessionalNetwork')}>
            <View style={styles.networkContent}>
              <View
                style={[
                  styles.exploreIconWrapper,
                  {
                    backgroundColor: colors.primary[500],
                    ...styles.networkIconWrapper,
                  },
                ]}>
                <Ionicons
                  name="people-outline"
                  size={30}
                  color={colors.common.white}
                />
              </View>
              <Text variant="lg-semibold" style={styles.exploreLabel}>
                Shia Professionals Network
              </Text>
            </View>
          </Card>
        </View>

        <View style={styles.featuredSection}>
          <Text variant="lg-semibold" style={styles.sectionTitle}>
            Featured Listings
          </Text>
        </View>
      </View>
    ),
    [handleExplorePress, navigation],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.fixedHeader}>{renderFixedHeader}</View>
      <View style={styles.scrollArea}>
        <FlatList
          data={featuredListings}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderListHeader}
          renderItem={({ item }) => (
            <View style={styles.listItemContainer}>
              <ListingCard
                title={item.name}
                category={item.category}
                location={item.location}
                rating={item.rating}
                reviews={item.reviews}
                verified={item.verified}
                imageUri={item.image}
                onPress={() =>
                  navigation.navigate('Details', {
                    listing: item as ListingItem,
                  })
                }
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;