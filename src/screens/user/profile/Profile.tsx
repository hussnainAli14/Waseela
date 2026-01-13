import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity, FlatList, Image, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { ExpandableDashboardSection } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ListingItem, MarketItem, RoomItem } from '@/navigation/types';
import { useSignOut } from '@/hooks/useSignOut';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { createAllTestData } from '@/utils/createTestData';
import { fetchUserBusinesses } from '@/store/slices/businessesSlice';
import { fetchUserServices } from '@/store/slices/servicesSlice';
import { fetchUserProducts } from '@/store/slices/productsSlice';
import { fetchUserRooms } from '@/store/slices/roomsSlice';
import { fetchUserProfessional, fetchUserProfessionals } from '@/store/slices/professionalsSlice';
import { firebaseFirestore } from '@/config/firebase';
import type { Product, Room } from '@/types/firestore';
import { getSavedItems } from '@/services/firestore/savedListings';

type ListingStatus = 'approved' | 'pending';

type Listing = {
  id: string;
  title: string;
  category: string;
  status: ListingStatus;
  image?: string;
  type: 'business' | 'service';
};

type SavedListing = {
  id: string;
  title: string;
  category: string;
  location: string;
  image?: string;
};

type ProfileScreenNavigation = NativeStackNavigationProp<any>;

const ListingSeparator = () => <View style={styles.listingSeparator} />;

const Profile = () => {
  const navigation = useNavigation<ProfileScreenNavigation>();
  const { handleSignOut } = useSignOut();
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  // Redux state
  const { userBusinesses, isUserBusinessesLoading } = useAppSelector(state => state.businesses);
  const { userServices, isUserServicesLoading } = useAppSelector(state => state.services);
  const { userProducts, isUserProductsLoading } = useAppSelector(state => state.products);
  const { userRooms, isUserRoomsLoading } = useAppSelector(state => state.rooms);
  const {
    userProfessional,
    userProfessionals,
    isLoading: isProfessionalLoading,
    isUserProfessionalsLoading,
  } = useAppSelector(state => state.professionals);

  // Debug: Log Redux state
  useEffect(() => {
      console.log('📦 Profile: Redux state:', {
      userBusinesses: userBusinesses.length,
      userServices: userServices.length,
      userProducts: userProducts.length,
      userRooms: userRooms.length,
      userProfessional: userProfessional ? 'exists' : 'null',
      userProfessionals: userProfessionals.length,
      isLoading: {
        businesses: isUserBusinessesLoading,
        services: isUserServicesLoading,
        products: isUserProductsLoading,
        rooms: isUserRoomsLoading,
        professional: isProfessionalLoading,
        professionalProfiles: isUserProfessionalsLoading,
      },
    });
  }, [
    userBusinesses,
    userServices,
    userProducts,
    userRooms,
    userProfessional,
    userProfessionals,
    isUserBusinessesLoading,
    isUserServicesLoading,
    isUserProductsLoading,
    isUserRoomsLoading,
    isProfessionalLoading,
    isUserProfessionalsLoading,
  ]);

  // Local state
  const [userProfile, setUserProfile] = useState<{ location?: string; phone?: string }>({});
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isCreatingTestData, setIsCreatingTestData] = useState(false);

  // Use user data from Redux, fallback to default values
  const displayName = user?.displayName || 'User';
  const userLocation = userProfile.location || 'London, UK';

  // Fetch all user data function (reusable)
  const fetchAllData = useCallback(async () => {
    if (!user?.uid) {
      console.log('❌ Profile: No user UID available');
      return;
    }

    setIsLoadingProfile(true);
    console.log('🔍 Profile: Fetching data for user:', user.uid);
    try {
      // Fetch user businesses, services, marketplace items, rooms, and professional profiles
      const results = await Promise.allSettled([
        dispatch(fetchUserBusinesses(user.uid)),
        dispatch(fetchUserServices(user.uid)),
        dispatch(fetchUserProducts(user.uid)),
        dispatch(fetchUserRooms(user.uid)),
        dispatch(fetchUserProfessional(user.uid)),
        dispatch(fetchUserProfessionals(user.uid)),
      ]);
      
      console.log('✅ Profile: Fetch results:', {
        businesses: results[0].status === 'fulfilled' ? 'Success' : results[0].reason,
        services: results[1].status === 'fulfilled' ? 'Success' : results[1].reason,
        products: results[2].status === 'fulfilled' ? 'Success' : results[2].reason,
        rooms: results[3].status === 'fulfilled' ? 'Success' : results[3].reason,
        professional: results[4].status === 'fulfilled' ? 'Success' : results[4].reason,
        professionalProfiles: results[5].status === 'fulfilled' ? 'Success' : results[5].reason,
      });

      // Log any errors
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const names = ['businesses', 'services', 'products', 'rooms', 'professional', 'professionalProfiles'];
          console.error(`❌ Profile: Error fetching ${names[index]}:`, result.reason);
        }
      });

      // Fetch user profile data from Firestore
      try {
        const userDoc = await firebaseFirestore.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        if (userData) {
          setUserProfile({
            location: userData.location || '',
            phone: userData.phone || '',
          });
        }
      } catch (error) {
        console.warn('Error fetching user profile:', error);
      }

      // Fetch saved listings (simplified - just get count for now)
      try {
        await getSavedItems(user.uid);
        // For now, we'll just show the count. Full implementation would require fetching each item
        setSavedListings([]);
      } catch (error) {
        console.warn('Error fetching saved listings:', error);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user?.uid, dispatch]);

  // Fetch all user data on mount and when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, [fetchAllData])
  );

  // Combine businesses and services into listings
  const listings = useMemo(() => {
    console.log('📊 Profile: Building listings from:', {
      userBusinesses: userBusinesses.length,
      userServices: userServices.length,
      userBusinessesData: userBusinesses,
      userServicesData: userServices,
    });

    const businessListings: Listing[] = userBusinesses.map(business => ({
      id: business.id,
      title: business.name,
      category: business.category,
      status: business.status === 'approved' ? 'approved' : 'pending',
      image: business.images[0] || business.logoUrl || 'https://via.placeholder.com/150',
      type: 'business' as const,
    }));

    const serviceListings: Listing[] = userServices.map(service => ({
      id: service.id,
      title: service.name,
      category: service.serviceType || 'Service',
      status: service.status === 'approved' ? 'approved' : 'pending',
      image: service.images[0] || service.profilePhoto || 'https://via.placeholder.com/150',
      type: 'service' as const,
    }));

    const combined = [...businessListings, ...serviceListings];
    console.log('📋 Profile: Combined listings:', combined.length);
    return combined;
  }, [userBusinesses, userServices]);

  // Convert products to MarketItem format
  const buySellItems = useMemo(() => {
    const conditionMap: Record<string, string> = {
      'new': 'New',
      'like-new': 'Like New',
      'good': 'Good',
      'fair': 'Fair',
      'needs-repair': 'Needs Repair',
    };

    return userProducts.map((product: Product): MarketItem => ({
      id: product.id,
      title: product.title,
      price: `£${product.price}`,
      location: product.city,
      condition: conditionMap[product.condition] || product.condition,
      category: product.category,
      image: product.images[0] || 'https://via.placeholder.com/600',
      description: product.description,
      safetyTips: [
        'Meet in a public place',
        'Check the item before paying',
        'Never share sensitive information',
      ],
    }));
  }, [userProducts]);

  // Convert rooms to RoomItem format
  const roomListings = useMemo(() => {
    console.log('🏠 Profile: Converting rooms:', {
      userRoomsCount: userRooms.length,
      userRoomsData: userRooms,
    });

    const mapped = userRooms.map((room: Room): RoomItem => {
      const availableFromDate = typeof room.availableFrom === 'string'
        ? new Date(room.availableFrom)
        : (room.availableFrom && typeof room.availableFrom.toDate === 'function' ? room.availableFrom.toDate() : new Date());

      return {
        id: room.id,
        title: room.title,
        city: room.city,
        type: room.type,
        price: room.price,
        priceLabel: room.priceLabel || `£${room.price}/month`,
        image: room.images[0] || 'https://via.placeholder.com/600',
        billsIncluded: room.billsIncluded || false,
        locationLine1: room.locationLine1,
        locationLine2: room.locationLine2 || '',
        description: room.description,
        amenities: room.amenities || [],
        availableFrom: availableFromDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };
    });
    console.log('🏠 Profile: Mapped roomListings:', mapped.length);
    return mapped;
  }, [userRooms]);

  // Derived data: user's professional profiles (support multiple profiles)
  const professionalProfiles = useMemo(() => {
    if (userProfessionals && userProfessionals.length > 0) {
      return userProfessionals;
    }
    return userProfessional ? [userProfessional] : [];
  }, [userProfessional, userProfessionals]);

  // Check if data is loading
  const isLoading =
    isUserBusinessesLoading ||
    isUserServicesLoading ||
    isUserProductsLoading ||
    isUserRoomsLoading ||
    isProfessionalLoading ||
    isUserProfessionalsLoading ||
    isLoadingProfile;

  const handleCreateTestData = async () => {
    Alert.alert(
      '🧪 Create Test Data',
      'Add sample data to Firestore?\n\n• 5 Businesses\n• 4 Services\n• 2 Marketplace Items\n• 2 Rooms',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async () => {
            setIsCreatingTestData(true);
            try {
              await createAllTestData();
              Alert.alert('✅ Success!', 'Test data created! Check Home, Directory, and Services screens.');
            } catch (error: any) {
              Alert.alert('❌ Error', error.message || 'Failed to create test data');
            } finally {
              setIsCreatingTestData(false);
            }
          },
        },
      ]
    );
  };

  const buildListingItem = useCallback((item: Listing): ListingItem => {
    const originalBusiness = userBusinesses.find(b => b.id === item.id && item.type === 'business');
    const originalService = userServices.find(s => s.id === item.id && item.type === 'service');

    if (originalBusiness) {
      return {
        id: originalBusiness.id,
        name: originalBusiness.name,
        category: originalBusiness.category,
        location: originalBusiness.city,
        rating: originalBusiness.rating || 0,
        reviews: originalBusiness.reviewCount || 0,
        verified: originalBusiness.verified || false,
        image: originalBusiness.images[0] || originalBusiness.logoUrl || 'https://via.placeholder.com/600',
      };
    } else if (originalService) {
      return {
        id: originalService.id,
        name: originalService.name,
        category: originalService.serviceType || 'Service',
        location: originalService.city,
        rating: originalService.rating || 0,
        reviews: originalService.reviewCount || 0,
        verified: originalService.verified || false,
        image: originalService.images[0] || originalService.profilePhoto || 'https://via.placeholder.com/600',
      };
    }

    // Fallback
    return {
      id: item.id,
      name: item.title,
      category: item.category,
      location: 'London',
      rating: 0,
      reviews: 0,
      verified: false,
      image: item.image || 'https://via.placeholder.com/600',
    };
  }, [userBusinesses, userServices]);

  const handleViewListing = useCallback((item: Listing) => {
    const listingForDetails = buildListingItem(item);
    navigation.navigate('Details', { listing: listingForDetails });
  }, [navigation, buildListingItem]);

  const renderListingItem = ({ item }: { item: Listing }) => {
    return (
      <View style={styles.listingCard}>
        <Image
          source={{
            uri: item.image || 'https://via.placeholder.com/150'
          }}
          resizeMode="cover"
          style={styles.listingImagePlaceholder}
        />
        <View style={styles.listingInfo}>
          <View style={styles.listingHeaderRow}>
            <Text variant="md-semibold" style={styles.listingTitle}>
              {item.title}
            </Text>
            {item.status === 'approved' && (
              <TouchableOpacity onPress={() => handleViewListing(item)}>
                <Text variant="sm-medium" style={styles.listingActionText}>
                  View
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text variant="sm-normal" style={styles.listingSubtitle}>
            {item.category}
          </Text>
          <View style={styles.listingStatusRow}>
            <Ionicons
              name={item.status === 'approved' ? 'checkmark-circle' : 'time-outline'}
              size={14}
              color={
                item.status === 'approved'
                  ? colors.status.success
                  : colors.status.warning
              }
            />
            <View
              style={
                item.status === 'approved'
                  ? styles.statusPillApproved
                  : styles.statusPillPending
              }>
              <Text
                variant="sm-medium"
                style={
                  item.status === 'approved'
                    ? styles.statusPillTextApproved
                    : styles.statusPillTextPending
                }>
                {item.status === 'approved' ? 'Approved' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderSavedListingItem = ({ item }: { item: SavedListing }) => (
    <View style={styles.listingCard}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/150' }}
        resizeMode="cover"
        style={styles.listingImagePlaceholder}
      />
      <View style={styles.listingInfo}>
        <Text variant="md-semibold" style={styles.listingTitle}>
          {item.title}
        </Text>
        <Text variant="sm-normal" style={styles.listingSubtitle}>
          {item.category}
        </Text>
        <View style={styles.listingMetaRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.text.secondary}
          />
          <Text variant="sm-medium" style={styles.listingSubtitle}>
            {item.location}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderBuySellItem = ({ item }: { item: MarketItem }) => (
    <TouchableOpacity
      style={styles.listingCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('MarketItemDetails', { item })}>
      <Image
        source={{ uri: item.image }}
        resizeMode="cover"
        style={styles.listingImagePlaceholder}
      />
      <View style={styles.listingInfo}>
        <Text variant="md-semibold" style={styles.listingTitle}>
          {item.title}
        </Text>
        <Text variant="sm-normal" style={styles.listingSubtitle}>
          {item.category} • {item.condition}
        </Text>
        <View style={styles.listingMetaRow}>
          <Text variant="md-semibold" style={styles.listingPrice}>
            {item.price}
          </Text>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.text.secondary}
          />
          <Text variant="sm-medium" style={styles.listingSubtitle}>
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRoomItem = ({ item }: { item: RoomItem }) => (
    <TouchableOpacity
      style={styles.listingCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('RoomDetails', { room: item })}>
      <Image
        source={{ uri: item.image }}
        resizeMode="cover"
        style={styles.listingImagePlaceholder}
      />
      <View style={styles.listingInfo}>
        <Text variant="md-semibold" style={styles.listingTitle}>
          {item.title}
        </Text>
        <Text variant="sm-normal" style={styles.listingSubtitle}>
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.locationLine1}
        </Text>
        <View style={styles.listingMetaRow}>
          <Text variant="md-semibold" style={styles.listingPrice}>
            {item.priceLabel}
          </Text>
          {item.billsIncluded && (
            <View style={styles.billsIncludedTag}>
              <Text variant="xs-medium" style={styles.billsIncludedText}>
                Bills Included
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleViewProfessionalProfile = useCallback(
    (professional: any) => {
      const yearsExperience = professional.experience
        ? parseInt(professional.experience.match(/\d+/)?.[0] || '0', 10)
        : 0;

      const profileData = {
        id: professional.id,
        name: professional.fullName,
        title: professional.profession,
        company: professional.company || '',
        industry: professional.industry,
        city: professional.location,
        yearsExperience,
        tags: professional.skills || [],
        avatar: professional.profilePhoto || 'https://via.placeholder.com/300',
        about: professional.bio,
        expertise: professional.skills,
        helpTitle: undefined,
        helpDescription: undefined,
        linkedinUrl: professional.linkedIn,
      };

      navigation.navigate('ProfessionalProfile', { professional: profileData });
    },
    [navigation],
  );

  const renderProfessionalProfileItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.listingCard}
      activeOpacity={0.9}
      onPress={() => handleViewProfessionalProfile(item)}>
      <View style={styles.listingInfo}>
        <View style={styles.listingHeaderRow}>
          <Text variant="md-semibold" style={styles.listingTitle}>
            {item.fullName}
          </Text>
          <TouchableOpacity onPress={() => handleViewProfessionalProfile(item)}>
            <Text variant="sm-medium" style={styles.listingActionText}>
              View
            </Text>
          </TouchableOpacity>
        </View>
        <Text variant="sm-normal" style={styles.listingSubtitle}>
          {item.profession}
        </Text>
        <View style={styles.listingStatusRow}>
          <Ionicons
            name={item.status === 'approved' ? 'checkmark-circle' : 'time-outline'}
            size={14}
            color={
              item.status === 'approved'
                ? colors.status.success
                : colors.status.warning
            }
          />
          <View
            style={
              item.status === 'approved'
                ? styles.statusPillApproved
                : styles.statusPillPending
            }>
            <Text
              variant="sm-medium"
              style={
                item.status === 'approved'
                  ? styles.statusPillTextApproved
                  : styles.statusPillTextPending
              }>
              {item.status === 'approved' ? 'Approved' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && listings.length === 0 && buySellItems.length === 0 && roomListings.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text variant="sm-normal" style={{ marginTop: 10, color: colors.text.secondary }}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="xl-bold" style={styles.headerTitle}>
            Profile
          </Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarCircleLarge}>
            <Ionicons
              name="person-outline"
              size={40}
              color={colors.common.white}
            />
          </View>
          <Text variant="lg-semibold" style={styles.nameTextCentered}>
            {displayName}
          </Text>
          {user?.displayName && (
            <View style={styles.serviceProviderTag}>
              <Text variant="sm-medium" style={styles.serviceProviderText}>
                Service Provider
              </Text>
            </View>
          )}
          <View style={styles.locationRowCentered}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.text.secondary}
            />
            <Text variant="sm-medium" style={styles.locationText}>
              {userLocation}
            </Text>
          </View>
          <View style={styles.contactButtonsRow}>
            <TouchableOpacity style={styles.whatsappButton} activeOpacity={0.9}>
              <Ionicons name="logo-whatsapp" size={18} color={colors.common.white} />
              <Text variant="sm-medium" style={styles.contactButtonText}>
                WhatsApp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emailButton} activeOpacity={0.9}>
              <Ionicons name="mail-outline" size={18} color={colors.common.white} />
              <Text variant="sm-medium" style={styles.contactButtonText}>
                Email
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.editButtonCentered}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons
              name="create-outline"
              size={14}
              color={colors.text.primary}
            />
            <Text variant="sm-medium" style={styles.editButtonText}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={colors.text.primary}
            />
            <Text variant="md-semibold" style={styles.sectionTitle}>
              My Dashboard
            </Text>
          </View>

          <ExpandableDashboardSection
            title="Businesses & Services"
            subtitle={`${listings.length} listings`}
            iconName="business-outline"
            iconColor={colors.secondary[500]}
            iconBackgroundColor={colors.secondary[50]}
            data={listings}
            renderItem={renderListingItem}
            keyExtractor={item => item.id}
            rightContent={
              listings.filter(l => l.status === 'pending').length > 0 ? (
                <View style={styles.pendingTag}>
                  <Text variant="xs-medium" style={styles.pendingTagText}>
                    {listings.filter(l => l.status === 'pending').length} Pending
                  </Text>
                </View>
              ) : null
            }
            emptyMessage="No business listings found"
          />

          <ExpandableDashboardSection
            title="Buy & Sell Items"
            subtitle={`${buySellItems.length} item${buySellItems.length !== 1 ? 's' : ''}`}
            iconName="bag-outline"
            iconColor={colors.accent.purple}
            iconBackgroundColor={colors.accent.purple + '20'}
            data={buySellItems}
            renderItem={renderBuySellItem}
            keyExtractor={item => item.id}
            emptyMessage="No items for sale"
          />

          <ExpandableDashboardSection
            title="Room Listings"
            subtitle={`${roomListings.length} room${roomListings.length !== 1 ? 's' : ''}`}
            iconName="home-outline"
            iconColor={colors.accent.orange}
            iconBackgroundColor={colors.accent.orange + '20'}
            data={roomListings}
            renderItem={renderRoomItem}
            keyExtractor={item => item.id}
            emptyMessage="No room listings found"
          />

          <ExpandableDashboardSection
            title="Professional Profiles"
            subtitle={`${professionalProfiles.length} profile${professionalProfiles.length !== 1 ? 's' : ''}`}
            iconName="briefcase-outline"
            iconColor={colors.accent.purple}
            iconBackgroundColor={colors.accent.purple + '20'}
            data={professionalProfiles}
            renderItem={renderProfessionalProfileItem}
            keyExtractor={item => item.id}
            emptyMessage="No professional profiles found"
          />
        </View>
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={colors.secondary[500]}
            />
            <Text variant="md-semibold" style={styles.sectionTitle}>
              Quick Actions
            </Text>
          </View>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionButton}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('SubmitListing')}>
              <View style={[styles.quickActionIconContainer, { backgroundColor: colors.secondary[50] }]}>
                <Ionicons
                  name="business-outline"
                  size={24}
                  color={colors.secondary[500]}
                />
              </View>
              <Text variant="sm-medium" style={styles.quickActionLabel}>
                Add Business
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionButton}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Services', { screen: 'SellItem' })}>
              <View style={[styles.quickActionIconContainer, { backgroundColor: colors.accent.purple + '20' }]}>
                <Ionicons
                  name="bag-outline"
                  size={24}
                  color={colors.accent.purple}
                />
              </View>
              <Text variant="sm-medium" style={styles.quickActionLabel}>
                Sell Item
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionButton}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Services', { screen: 'PostRoom' })}>
              <View style={[styles.quickActionIconContainer, { backgroundColor: colors.accent.orange + '20' }]}>
                <Ionicons
                  name="home-outline"
                  size={24}
                  color={colors.accent.orange}
                />
              </View>
              <Text variant="sm-medium" style={styles.quickActionLabel}>
                Post Room
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionButton}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('JoinProfessionalNetwork')}>
              <View style={[styles.quickActionIconContainer, { backgroundColor: colors.accent.blue + '20' }]}>
                <Ionicons
                  name="people-outline"
                  size={24}
                  color={colors.accent.blue}
                />
              </View>
              <Text variant="sm-medium" style={styles.quickActionLabel}>
                Join Network
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons
              name="heart-outline"
              size={18}
              color={colors.accent.purple}
            />
            <Text variant="md-semibold" style={styles.sectionTitle}>
              Saved Listings
            </Text>
            <Text variant="md-medium" style={styles.sectionBadgeText}>
              {savedListings.length}
            </Text>
          </View>

          <FlatList
            data={savedListings}
            keyExtractor={item => item.id}
            renderItem={renderSavedListingItem}
            scrollEnabled={false}
            ItemSeparatorComponent={ListingSeparator}
          />
        </View>

        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color={colors.accent.blue}
            />
            <Text variant="md-semibold" style={styles.sectionTitle}>
              Safety & Legal
            </Text>
          </View>
          <TouchableOpacity
            style={styles.safetyItem}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('CommunityGuidelines')}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color={colors.accent.blue}
            />
            <Text variant="sm-medium" style={styles.safetyItemText}>
              Community Guidelines
            </Text>
            <Ionicons name="eye-outline" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.safetyItem} activeOpacity={0.9}>
            <Ionicons
              name="shield-outline"
              size={18}
              color={colors.secondary[500]}
            />
            <Text variant="sm-medium" style={styles.safetyItemText}>
              Safety Policies
            </Text>
            <Ionicons name="eye-outline" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.safetyItem} activeOpacity={0.9}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={colors.accent.purple}
            />
            <Text variant="sm-medium" style={styles.safetyItemText}>
              Privacy Policy
            </Text>
            <Ionicons name="eye-outline" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.safetyItem} activeOpacity={0.9}>
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={colors.status.error}
            />
            <Text variant="sm-medium" style={styles.safetyItemText}>
              Report a User / Listing
            </Text>
            <Ionicons name="eye-outline" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* DEV: Create Test Data Button */}
        <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.accent.purple,
              padding: 16,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isCreatingTestData ? 0.6 : 1,
            }}
            onPress={handleCreateTestData}
            disabled={isCreatingTestData}
            activeOpacity={0.7}>
            {isCreatingTestData ? (
              <>
                <ActivityIndicator size="small" color={colors.common.white} />
                <Text
                  variant="md-semibold"
                  style={{ color: colors.common.white, marginLeft: 10 }}>
                  Creating...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="flask" size={20} color={colors.common.white} />
                <Text
                  variant="md-semibold"
                  style={{ color: colors.common.white, marginLeft: 10 }}>
                  🧪 DEV: Create Test Data
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.logoutButtonWrapper}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.9}
            onPress={handleSignOut}>
            <Ionicons
              name="arrow-forward-outline"
              size={18}
              color={colors.status.error}
            />
            <Text variant="md-semibold" style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
