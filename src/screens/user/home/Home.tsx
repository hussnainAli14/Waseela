import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Header, SearchBar } from '@/components/molecules';
import { Text } from '@/components/atoms';
import { colors } from '@/theme';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { useAppDispatch } from '@/store/hooks';
import { fetchFeaturedBusinesses } from '@/store/slices/businessesSlice';
import { fetchFeaturedServices } from '@/store/slices/servicesSlice';

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

  // Fetch featured listings on mount
  useEffect(() => {
    dispatch(fetchFeaturedBusinesses(5));
    dispatch(fetchFeaturedServices(5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
      </View>
    ),
    [handleExplorePress, navigation],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.fixedHeader}>{renderFixedHeader}</View>
      <View style={styles.scrollArea}>
        {renderListHeader}
      </View>
    </SafeAreaView>
  );
};

export default Home;