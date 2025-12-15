import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { Card } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';

const user = {
  name: 'Ali Hassan',
  location: 'London, UK',
};

const Profile = () => {
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
              </View>
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

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.9}>
            <Ionicons name="add" size={18} color={colors.common.white} />
            <Text variant="md-semibold" style={styles.primaryActionText}>
              Submit Business/Service Listing
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.secondaryActionCard}
            activeOpacity={0.9}>
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
            style={styles.secondaryActionCard}
            activeOpacity={0.9}>
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
            activeOpacity={0.9}>
            <Text variant="md-semibold" style={styles.joinNetworkButtonText}>
              Join Network
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Text variant="md-semibold" style={styles.sectionTitle}>
              Your Listings
            </Text>
            <View style={styles.sectionBadge}>
              <Text variant="sm-medium" style={styles.sectionBadgeText}>
                2
              </Text>
            </View>
          </View>

          <Card style={styles.listingCard} padding={0}>
            <View style={styles.listingImagePlaceholder} />
            <View style={styles.listingInfo}>
              <View style={styles.listingHeaderRow}>
                <Text variant="md-semibold" style={styles.listingTitle}>
                  My Halal Store
                </Text>
                <Text variant="sm-medium" style={styles.listingActionText}>
                  View
                </Text>
              </View>
              <Text variant="sm-normal" style={styles.listingSubtitle}>
                Retail
              </Text>
              <View style={styles.listingStatusRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={colors.status.success}
                />
                <View style={styles.statusPillApproved}>
                  <Text
                    variant="sm-medium"
                    style={styles.statusPillTextApproved}>
                    Approved
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          <Card style={styles.listingCard} padding={0}>
            <View style={styles.listingImagePlaceholder} />
            <View style={styles.listingInfo}>
              <Text variant="md-semibold" style={styles.listingTitle}>
                Ahmad Plumbing Services
              </Text>
              <Text variant="sm-normal" style={styles.listingSubtitle}>
                Plumber
              </Text>
              <View style={styles.listingStatusRow}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={colors.status.warning}
                />
                <View style={styles.statusPillPending}>
                  <Text
                    variant="sm-medium"
                    style={styles.statusPillTextPending}>
                    Pending
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeaderRow}>
            <Text variant="md-semibold" style={styles.sectionTitle}>
              Saved Listings
            </Text>
            <View style={styles.sectionBadge}>
              <Text variant="sm-medium" style={styles.sectionBadgeText}>
                2
              </Text>
            </View>
          </View>

          <Card style={styles.listingCard} padding={0}>
            <View style={styles.listingImagePlaceholder} />
            <View style={styles.listingInfo}>
              <Text variant="md-semibold" style={styles.listingTitle}>
                Al-Zahra Restaurant
              </Text>
              <Text variant="sm-normal" style={styles.listingSubtitle}>
                Food
              </Text>
              <View style={styles.listingMetaRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={colors.text.secondary}
                />
                <Text variant="sm-medium" style={styles.listingSubtitle}>
                  London
                </Text>
              </View>
            </View>
          </Card>

          <Card style={styles.listingCard} padding={0}>
            <View style={styles.listingImagePlaceholder} />
            <View style={styles.listingInfo}>
              <Text variant="md-semibold" style={styles.listingTitle}>
                Fatima Ahmed
              </Text>
              <Text variant="sm-normal" style={styles.listingSubtitle}>
                Quran Tutor
              </Text>
              <View style={styles.listingMetaRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={colors.text.secondary}
                />
                <Text variant="sm-medium" style={styles.listingSubtitle}>
                  London
                </Text>
              </View>
            </View>
          </Card>
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
