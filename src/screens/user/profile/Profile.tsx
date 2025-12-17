import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { colors } from '@/theme';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ListingItem } from '@/navigation/types';

const user = {
  name: 'Ali Hassan',
  location: 'London, UK',
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
  },
  {
    id: '2',
    title: 'Fatima Ahmed',
    category: 'Quran Tutor',
    location: 'London',
  },
];

type ProfileScreenNavigation = NativeStackNavigationProp<any>;

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
        source={{ uri: 'https://via.placeholder.com/150' }}
        resizeMode="cover"
        style={styles.listingImagePlaceholder}
        borderRadius={12}
      />
      <View style={styles.listingInfo}>
        <View style={styles.listingHeaderRow}>
          <Text variant="md-semibold" style={styles.listingTitle}>
            {item.title}
          </Text>
          <TouchableOpacity onPress={() => handleViewListing(item)}>
            <Text variant="sm-medium" style={styles.listingActionText}>
              View
            </Text>
          </TouchableOpacity>
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
      <View style={styles.listingImagePlaceholder} />
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="xl-bold" style={styles.headerTitle}>
            Profile
          </Text>
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarCircle}>
                <Ionicons
                  name="person-outline"
                  size={28}
                  color={colors.common.white}
                />
              </View>
              <View style={styles.profileTextBlock}>
                <Text variant="md-semibold" style={styles.nameText}>
                  {user.name}
                </Text>
                <View style={styles.locationRow}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={colors.text.secondary}
                  />
                  <Text variant="sm-medium" style={styles.locationText}>
                    {user.location}
                  </Text>
                </View>
                <TouchableOpacity style={styles.editButton} activeOpacity={0.85}>
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
            </View>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.primaryActionButton}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('SubmitListing')}>
            <Ionicons name="add" size={18} color={colors.common.white} />
            <Text variant="md-semibold" style={styles.primaryActionText}>
              Submit Business/Service Listing
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemsRow}>
          <TouchableOpacity
            style={[styles.secondaryActionCard,{borderWidth:1, borderColor:colors.accent.purple}]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Services', { screen: 'SellItem' })}>
            <Ionicons
              name="bag-outline"
              size={20}
              color={colors.accent.purple}
            />
            <Text variant="md-medium" style={styles.secondaryActionLabel}>
              Sell Item
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryActionCard,{borderWidth:1, borderColor:colors.accent.orange}]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Services', { screen: 'PostRoom' })}>
            <Ionicons
              name="home-outline"
              size={20}
              color={colors.accent.orange}
            />
            <Text variant="md-medium" style={styles.secondaryActionLabel}>
              Post Room
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.networkCard}>
          <Text variant="md-semibold" style={styles.networkTitle}>
            Shia Professionals Network
          </Text>
          <Text variant="sm-normal" style={styles.networkSubtitle}>
            Share your expertise and help community members with mentorship and
            career advice
          </Text>
          <TouchableOpacity
            style={styles.joinNetworkButton}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('JoinProfessionalNetwork')}>
            <Text variant="md-semibold" style={styles.joinNetworkButtonText}>
              Join Network
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
              Your Listings
            </Text>
            <Text variant="md-medium" style={styles.sectionBadgeText}>
              {listings.length}
            </Text>
          </View>

          <FlatList
            data={listings}
            keyExtractor={item => item.id}
            renderItem={renderListingItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        </View>

        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons
              name="heart-outline"
              size={18}
              color={colors.text.primary}
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
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        </View>

        <View style={styles.logoutButtonWrapper}>
          <TouchableOpacity
            style={styles.guidelinesButton}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('CommunityGuidelines')}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color={colors.primary[800]}
            />
            <Text variant="md-bold" style={styles.guidelinesText}>
              Community Guidelines & Safety
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoutButtonWrapper}>
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.9}>
            <Ionicons
              name="log-out-outline"
              size={18}
              color={colors.status.error ?? colors.accent.orange}
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
