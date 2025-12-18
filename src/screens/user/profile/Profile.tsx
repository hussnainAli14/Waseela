import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { ExpandableDashboardSection } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ListingItem, MarketItem, RoomItem } from '@/navigation/types';

const user = {
  name: 'Ali Hassan',
  location: 'London, UK',
  isServiceProvider: true,
};

type ListingStatus = 'approved' | 'pending';

type Listing = {
  id: string;
  title: string;
  category: string;
  status: ListingStatus;
};

type SavedListing = {
  id: string;
  title: string;
  category: string;
  location: string;
  image?: string;
};

const listings: Listing[] = [
  {
    id: '1',
    title: 'My Halal Store',
    category: 'Retail',
    status: 'approved',
  },
  {
    id: '2',
    title: 'Ahmad Plumbing Services',
    category: 'Plumber',
    status: 'pending',
  },
];

const savedListings: SavedListing[] = [
  {
    id: '1',
    title: 'Al-Zahra Restaurant',
    category: 'Food',
    location: 'London',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: 'Fatima Ahmed',
    category: 'Quran Tutor',
    location: 'London',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  },
];

const buySellItems: MarketItem[] = [
  {
    id: 'bs1',
    title: 'Modern Dining Table Set',
    price: '£250',
    location: 'London',
    condition: 'Good',
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=600&q=80',
  },
];

const roomListings: RoomItem[] = [
  {
    id: 'r1',
    title: 'Cozy Single Room',
    city: 'London',
    type: 'single',
    price: 450,
    priceLabel: '£450/month',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    billsIncluded: true,
    locationLine1: 'Central London',
    locationLine2: 'Zone 1',
  },
];

type ProfileScreenNavigation = NativeStackNavigationProp<any>;

const ListingSeparator = () => <View style={styles.listingSeparator} />;

const Profile = () => {
  const navigation = useNavigation<ProfileScreenNavigation>();

  const buildListingItem = (item: Listing): ListingItem => ({
    id: item.id,
    name: item.title,
    category: item.category,
    location: 'London',
    rating: item.id === '1' ? 4.8 : 4.5,
    reviews: item.id === '1' ? 120 : 58,
    verified: item.id === '1',
    image:
      item.id === '1'
        ? 'https://images.unsplash.com/photo-1580915411954-282cb1c9c450?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&w=600&q=80',
  });

  const handleViewListing = (item: Listing) => {
    const listingForDetails = buildListingItem(item);
    navigation.navigate('Details', { listing: listingForDetails });
  };

  const renderListingItem = ({ item }: { item: Listing }) => (
    <View style={styles.listingCard}>
      <Image
        source={{ 
          uri: item.id === '1' 
            ? 'https://images.unsplash.com/photo-1580915411954-282cb1c9c450?auto=format&fit=crop&w=600&q=80'
            : 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&w=600&q=80'
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
            {user.name}
          </Text>
          {user.isServiceProvider && (
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
              {user.location}
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
              <View style={styles.pendingTag}>
                <Text variant="xs-medium" style={styles.pendingTagText}>
                  1 Pending
                </Text>
              </View>
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

          <TouchableOpacity
            style={styles.dashboardCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ProfessionalNetwork')}>
            <View style={[styles.dashboardCardIcon, { backgroundColor: colors.accent.purple + '20' }]}>
              <Ionicons
                name="briefcase-outline"
                size={20}
                color={colors.accent.purple}
              />
            </View>
            <View style={styles.dashboardCardContent}>
              <Text variant="md-semibold" style={styles.dashboardCardTitle}>
                Professional Profile
              </Text>
              <Text variant="sm-normal" style={styles.dashboardCardSubtitle}>
                45 connections
              </Text>
            </View>
            <View style={styles.dashboardCardRight}>
              <View style={styles.statusPillApproved}>
                <Text variant="xs-medium" style={styles.statusPillTextApproved}>
                  Approved
                </Text>
              </View>
              <Ionicons name="eye-outline" size={18} color={colors.text.secondary} />
            </View>
          </TouchableOpacity>
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

        <View style={styles.logoutButtonWrapper}>
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.9}>
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
