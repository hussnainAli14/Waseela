import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, TouchableOpacity, Switch, ActivityIndicator, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp, CommonActions } from '@react-navigation/native';
import { Text, Image } from '@/components/atoms';
import { Card, Dropdown, SearchBar } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { IndustryOption, Professional } from './types';
import { MainStackParamList, ProfessionalProfileItem } from '@/navigation/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProfessionals, resetProfessionals } from '@/store/slices/professionalsSlice';
import type { Professional as FirestoreProfessional } from '@/types/firestore';

const industryOptions: IndustryOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Education', value: 'education' },
];

const cityOptions = [
  { label: 'All Cities', value: 'all' },
  { label: 'London', value: 'london' },
  { label: 'Birmingham', value: 'birmingham' },
  { label: 'Manchester', value: 'manchester' },
  { label: 'Leeds', value: 'leeds' },
];

// Helper function to convert Firestore Professional to local Professional type
const convertFirestoreProfessional = (pro: FirestoreProfessional): Professional => {
  // Calculate years of experience from experience string or default to 0
  const yearsExperience = pro.experience 
    ? parseInt(pro.experience.match(/\d+/)?.[0] || '0', 10)
    : 0;

  return {
    id: pro.id,
    name: pro.fullName,
    title: pro.profession,
    company: pro.company || '',
    industry: (pro.industry.toLowerCase() as IndustryOption['value']) || 'other',
    city: pro.location,
    yearsExperience,
    tags: pro.skills || [],
    avatar: pro.profilePhoto || 'https://via.placeholder.com/300',
    offeringMentorship: false, // This field doesn't exist in Firestore Professional, default to false
    about: pro.bio,
    expertise: pro.skills,
    helpTitle: undefined,
    helpDescription: undefined,
    linkedinUrl: pro.linkedIn,
  };
};

const ProfessionalNetwork = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [onlyMentors, setOnlyMentors] = useState(false);

  // Get professionals from Redux
  const { professionals: allProfessionals, isLoading } = useAppSelector(state => state.professionals);
  const [refreshing, setRefreshing] = useState(false);

  // Helper function to apply filters and fetch professionals
  const applyFiltersAndFetch = useCallback(
    (industry: string, location: string, searchTerm?: string) => {
      const filterObj: any = {};

      if (industry && industry !== 'all') {
        filterObj.industry = industry;
      }

      if (location && location !== 'all') {
        // Capitalize location to match database format
        filterObj.location = location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
      }

      // Add search term to filters if provided
      if (searchTerm && searchTerm.trim()) {
        filterObj.search = searchTerm.trim();
      }

      console.log('🔍 ProfessionalNetwork: Applying filters:', { industry, location, searchTerm, filterObj });
      dispatch(resetProfessionals());
      dispatch(fetchProfessionals({ filters: filterObj, limit: 50 })); // Fetch more for client-side search
    },
    [dispatch],
  );

  // Fetch all professionals on initial mount
  useEffect(() => {
    console.log('🔍 ProfessionalNetwork: Initial fetch - loading all professionals');
    dispatch(resetProfessionals());
    dispatch(fetchProfessionals({ filters: {}, limit: 20 }));
  }, [dispatch]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      console.log('🔄 ProfessionalNetwork: Refreshing data...');
      dispatch(resetProfessionals());
      await dispatch(
        fetchProfessionals({
          filters: {
            industry: selectedIndustry !== 'all' ? selectedIndustry : undefined,
            location: selectedCity !== 'all' ? selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1).toLowerCase() : undefined,
          },
          limit: 50,
        })
      ).unwrap();
    } catch (error) {
      console.error('Error refreshing professionals:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, selectedIndustry, selectedCity]);

  // Handle search input change (debouncing is handled by SearchBar component)
  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchValue(text);
      applyFiltersAndFetch(selectedIndustry, selectedCity, text);
    },
    [selectedIndustry, selectedCity, applyFiltersAndFetch],
  );

  // Handle industry selection change
  const handleIndustryChange = useCallback(
    (industry: string | undefined) => {
      const industryValue = industry || 'all';
      setSelectedIndustry(industryValue);
      applyFiltersAndFetch(industryValue, selectedCity, searchValue);
    },
    [selectedCity, searchValue, applyFiltersAndFetch],
  );

  // Handle city selection change
  const handleCityChange = useCallback(
    (city: string | undefined) => {
      const cityValue = city || 'all';
      setSelectedCity(cityValue);
      applyFiltersAndFetch(selectedIndustry, cityValue, searchValue);
    },
    [selectedIndustry, searchValue, applyFiltersAndFetch],
  );

  // Filter professionals by search term and mentor filter (client-side filtering)
  const filteredProfessionals = useMemo(() => {
    // Convert Firestore Professional[] to local Professional[]
    let professionalItems = allProfessionals.map(convertFirestoreProfessional);

    // Apply client-side search filtering
    if (searchValue && searchValue.trim()) {
      const searchLower = searchValue.toLowerCase().trim();
      professionalItems = professionalItems.filter(pro => {
        const nameMatch = pro.name?.toLowerCase().includes(searchLower);
        const titleMatch = pro.title?.toLowerCase().includes(searchLower);
        const companyMatch = pro.company?.toLowerCase().includes(searchLower);
        const bioMatch = pro.about?.toLowerCase().includes(searchLower);
        const skillsMatch = pro.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        
        return nameMatch || titleMatch || companyMatch || bioMatch || skillsMatch;
      });
    }

    // Apply mentor filter (client-side since it's not in Firestore)
    if (onlyMentors) {
      // Note: Since offeringMentorship doesn't exist in Firestore, we can't filter by it
      // This filter will be applied but won't work until the field is added to Firestore
      // For now, we'll skip this filter or show all when enabled
    }

    return professionalItems;
  }, [allProfessionals, searchValue, onlyMentors]);

  const handleJoinNetwork = useCallback(() => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Profile',
        params: {
          screen: 'JoinProfessionalNetwork',
        },
      }),
    );
  }, [navigation]);

  const renderHeader = useMemo(
    () => (
      <View style={styles.header}>
        <Text variant="lg-semibold" style={styles.headerTitle}>
          Shia Professionals Network
        </Text>
        <Text variant="md-normal" style={styles.headerSubtitle}>
          Connect with mentors for career guidance
        </Text>
        <View style={styles.searchBlock}>
          <SearchBar
            placeholder="Search by name, title, or expertise..."
            value={searchValue}
            onChangeText={handleSearchChange}
            style={styles.searchBar}
          />
          <TouchableOpacity
            style={styles.joinButton}
            activeOpacity={0.9}
            onPress={handleJoinNetwork}>
            <Ionicons
              name="add"
              size={20}
              color={colors.accent.blueDark}
            />
            <Text variant="md-semibold" style={styles.joinButtonText}>
              Join Network as Professional
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [searchValue, handleJoinNetwork, handleSearchChange],
  );

  const renderListHeader = useMemo(
    () => (
      <View style={styles.filtersSection}>
        <View style={styles.filterBlock}>
          <Text variant="md-medium" style={styles.filterLabel}>
            Industry
          </Text>
          <Dropdown
            options={industryOptions}
            selectedValue={selectedIndustry}
            onSelect={handleIndustryChange}
            buttonStyle={styles.dropdownButton}
          />
        </View>
        <View style={styles.filterBlock}>
          <Text variant="md-medium" style={styles.filterLabel}>
            Location
          </Text>
          <Dropdown
            options={cityOptions}
            selectedValue={selectedCity}
            onSelect={handleCityChange}
            buttonStyle={styles.dropdownButton}
          />
        </View>
        <View style={styles.mentorToggleRow}>
          <View style={styles.mentorToggleLeft}>
            <View style={styles.mentorIconWrapper}>
              <Ionicons
                name="people-outline"
                size={20}
                color={colors.text.secondary}
              />
            </View>
            <View>
              <Text variant="md-medium" style={styles.filterLabel}>
                Offering Mentorship
              </Text>
              <Text variant="xs-normal" style={styles.toggleSubtitle}>
                Show only professionals offering mentorship
              </Text>
            </View>
          </View>
          <Switch
            value={onlyMentors}
            onValueChange={setOnlyMentors}
            trackColor={{ false: colors.border.light, true: colors.primary[200] }}
            thumbColor={onlyMentors ? colors.primary[500] : colors.common.white}
          />
        </View>
        <Text variant="md-medium" style={styles.resultsText}>
          {filteredProfessionals.length} professionals found
        </Text>
      </View>
    ),
    [selectedIndustry, selectedCity, onlyMentors, filteredProfessionals.length, handleCityChange, handleIndustryChange],
  );

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  const renderProfessionalCard = useCallback(
    ({ item }: { item: Professional }) => {
      const profileData: ProfessionalProfileItem = {
        id: item.id,
        name: item.name,
        title: item.title,
        company: item.company,
        industry: item.industry,
        city: item.city,
        yearsExperience: item.yearsExperience,
        tags: item.tags,
        avatar: item.avatar,
        about: item.about,
        expertise: item.expertise,
        helpTitle: item.helpTitle,
        helpDescription: item.helpDescription,
        linkedinUrl: item.linkedinUrl,
      };

      return (
        <Card
          style={styles.professionalCard}
          backgroundColor={colors.background.light}
          padding={16}
          onPress={() =>
            navigation.navigate('ProfessionalProfile', { professional: profileData })
          }>
        <View style={styles.cardHeader}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: item.avatar }}
              resizeMode="cover"
              containerStyle={styles.avatar}
              borderRadius={999}
            />
          </View>
          <View style={styles.cardHeaderText}>
            <Text variant="md-semibold" style={styles.nameText}>
              {item.name}
            </Text>
            <Text variant="sm-normal" style={styles.titleText}>
              {item.title}
            </Text>
            <Text variant="sm-normal" style={styles.companyText}>
              {item.company}
            </Text>
            <View style={styles.tagRow}>
          {item.tags.map((tag, index) => {
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
              {item.city}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons
              name="person-outline"
              size={14}
              color={colors.text.secondary}
            />
            <Text variant="sm-medium" style={styles.metaText}>
              {item.yearsExperience} years exp.
            </Text>
          </View>
        </View>
          </View>
        </View>
      </Card>
      );
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {renderHeader}
      <FlatList
        data={filteredProfessionals}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderListHeader}
        renderItem={renderProfessionalCard}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
        ListFooterComponent={
          isLoading && !refreshing ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={colors.primary[500]} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading && !refreshing ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Ionicons name="people-outline" size={48} color={colors.text.secondary} />
              <Text variant="md-semibold" style={{ marginTop: 10, color: colors.text.primary }}>
                No professionals found
              </Text>
              <Text variant="sm-normal" style={{ marginTop: 5, color: colors.text.secondary }}>
                Try adjusting your filters
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default ProfessionalNetwork;


