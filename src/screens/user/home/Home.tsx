import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Header, SearchBar, ListingCard } from '@/components/molecules';
import { Text } from '@/components/atoms';
import { colors } from '@/theme';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { ListingItem } from '@/navigation/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFeaturedBusinesses } from '@/store/slices/businessesSlice';
import { fetchFeaturedServices } from '@/store/slices/servicesSlice';
import { getListingImage } from '@/utils/placeholders';

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

const Home = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Get featured data from Redux
  const { featuredBusinesses, isFeaturedLoading: isBusinessesLoading } = useAppSelector(
    state => state.businesses
  );
  const { featuredServices, isFeaturedLoading: isServicesLoading } = useAppSelector(
    state => state.services
  );

  // Fetch featured listings on mount
  useEffect(() => {
    dispatch(fetchFeaturedBusinesses(5));
    dispatch(fetchFeaturedServices(5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Combine featured businesses and services
  const featuredListings = useMemo(() => {
    const combined = [
      ...featuredBusinesses.map(business => ({
        id: business.id,
        name: business.name,
        category: business.category,
        location: business.city,
        rating: business.rating,
        reviews: business.reviewCount,
        verified: business.verified,
        image: getListingImage(business.images, 'business'),
      })),
      ...featuredServices.map(service => ({
        id: service.id,
        name: service.name,
        category: service.serviceType,
        location: service.city,
        rating: service.rating,
        reviews: service.reviewCount,
        verified: service.verified,
        image: getListingImage(service.images, 'service'),
      })),
    ];
    return combined.slice(0, 10); // Limit to 10 total
  }, [featuredBusinesses, featuredServices]);

  const isLoading = isBusinessesLoading || isServicesLoading;

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
                  <Ionicons name={item.icon} size={20} color={colors.common.white} />
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
                  size={24}
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

  const renderLoadingState = () => (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <Text variant="sm-normal" style={{ marginTop: 10, color: colors.text.secondary }}>
        Loading featured listings...
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <Ionicons name="business-outline" size={48} color={colors.text.secondary} />
      <Text variant="md-semibold" style={{ marginTop: 10, color: colors.text.primary }}>
        No featured listings yet
      </Text>
      <Text variant="sm-normal" style={{ marginTop: 5, color: colors.text.secondary }}>
        Check back soon for featured businesses and services
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.fixedHeader}>{renderFixedHeader}</View>
      <View style={styles.scrollArea}>
        <FlatList
          data={featuredListings}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={isLoading ? renderLoadingState : renderEmptyState}
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