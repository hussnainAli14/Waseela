import React, { useCallback, useMemo, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Text, Image } from '@/components/atoms';
import { Card } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { MainStackParamList, ProfessionalProfileItem } from '@/navigation/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserProfessionals } from '@/store/slices/professionalsSlice';
import type { ProfessionalProfile as FirestoreProfessional } from '@/types/firestore';
import { getListingImage } from '@/utils/placeholders';

// Helper function to convert Firestore Professional to ProfessionalProfileItem
const convertToProfileItem = (pro: FirestoreProfessional): ProfessionalProfileItem => {
  const yearsExperience = pro.experience
    ? parseInt(pro.experience.match(/\d+/)?.[0] || '0', 10)
    : 0;

  return {
    id: pro.id,
    name: pro.fullName,
    title: pro.profession,
    company: pro.company || '',
    industry: pro.industry,
    city: pro.location,
    yearsExperience,
    tags: pro.skills || [],
    avatar: getListingImage(pro.profilePhoto ? [pro.profilePhoto] : undefined, 'professional'),
    about: pro.bio,
    expertise: pro.skills,
    helpTitle: undefined,
    helpDescription: undefined,
    linkedinUrl: pro.linkedIn,
  };
};

const UserProfessionalProfiles = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { userProfessionals, isUserProfessionalsLoading } = useAppSelector(state => state.professionals);

  // Fetch user's professional profiles on mount
  useEffect(() => {
    if (!user?.uid) return;
    dispatch(fetchUserProfessionals(user.uid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const handleProfilePress = useCallback(
    (profile: ProfessionalProfileItem) => {
      navigation.navigate('ProfessionalProfile', { professional: profile });
    },
    [navigation],
  );

  const renderProfessionalCard = useCallback(
    ({ item }: { item: FirestoreProfessional }) => {
      const profileData = convertToProfileItem(item);

      return (
        <Card
          style={styles.professionalCard}
          backgroundColor={colors.background.light}
          padding={16}
          onPress={() => handleProfilePress(profileData)}>
          <View style={styles.cardHeader}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: profileData.avatar }}
                resizeMode="cover"
                containerStyle={styles.avatar}
                borderRadius={999}
              />
            </View>
            <View style={styles.cardHeaderText}>
              <Text variant="md-semibold" style={styles.nameText}>
                {profileData.name}
              </Text>
              <Text variant="sm-normal" style={styles.titleText}>
                {profileData.title}
              </Text>
              <Text variant="sm-normal" style={styles.companyText}>
                {profileData.company}
              </Text>
              <View style={styles.tagRow}>
                {profileData.tags.slice(0, 3).map((tag, index) => {
                  const isPrimary = index === 0;
                  return (
                    <View
                      key={tag}
                      style={[
                        styles.tagChip,
                        isPrimary ? styles.tagChipPrimary : styles.tagChipSecondary,
                      ]}>
                      <Text
                        variant="sm-medium"
                        style={[
                          styles.tagChipText,
                          isPrimary
                            ? styles.tagChipPrimaryText
                            : styles.tagChipSecondaryText,
                        ]}>
                        {tag}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={colors.text.secondary}
                  />
                  <Text variant="sm-medium" style={styles.metaText}>
                    {profileData.city}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="person-outline"
                    size={14}
                    color={colors.text.secondary}
                  />
                  <Text variant="sm-medium" style={styles.metaText}>
                    {profileData.yearsExperience} years exp.
                  </Text>
                </View>
              </View>
              <View style={styles.statusRow}>
                <View
                  style={
                    item.status === 'approved'
                      ? styles.statusPillApproved
                      : styles.statusPillPending
                  }>
                  <Text
                    variant="xs-medium"
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
        </Card>
      );
    },
    [handleProfilePress],
  );

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  if (isUserProfessionalsLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text variant="sm-normal" style={styles.loadingText}>
            Loading profiles...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text variant="xl-bold" style={styles.headerTitle}>
          My Professional Profiles
        </Text>
        <Text variant="sm-normal" style={styles.headerSubtitle}>
          {userProfessionals.length} profile{userProfessionals.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={userProfessionals}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderProfessionalCard}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={48} color={colors.text.secondary} />
            <Text variant="md-semibold" style={styles.emptyTitle}>
              No professional profiles
            </Text>
            <Text variant="sm-normal" style={styles.emptySubtitle}>
              Join the professional network to create your profile
            </Text>
            <TouchableOpacity
              style={styles.joinButton}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('JoinProfessionalNetwork')}>
              <Ionicons name="add" size={20} color={colors.common.white} />
              <Text variant="md-semibold" style={styles.joinButtonText}>
                Join Professional Network
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default UserProfessionalProfiles;
