import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, TouchableOpacity, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Text, Image } from '@/components/atoms';
import { Card, Dropdown, SearchBar } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './styles';
import { IndustryOption, Professional } from './types';
import { MainStackParamList, ProfessionalProfileItem } from '@/navigation/types';

const industryOptions: IndustryOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Education', value: 'education' },
];

const cityOptions = [
  { label: 'All Cities', value: 'all' },
  { label: 'London', value: 'London' },
  { label: 'Birmingham', value: 'Birmingham' },
  { label: 'Manchester', value: 'Manchester' },
  { label: 'Leeds', value: 'Leeds' },
];

const professionals: Professional[] = [
  {
    id: 'p1',
    name: 'Dr. Ahmed Hassan',
    title: 'Senior Software Engineer',
    company: 'Google',
    industry: 'technology',
    city: 'London',
    yearsExperience: 12,
    tags: ['Technology', 'Mentorship', 'Career Advice'],
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80',
    offeringMentorship: true,
  },
  {
    id: 'p2',
    name: 'Dr. Fatima Ali',
    title: 'Consultant Cardiologist',
    company: 'NHS - Royal London Hospital',
    industry: 'healthcare',
    city: 'London',
    yearsExperience: 15,
    tags: ['Healthcare', 'Mentorship', 'Career Advice'],
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb0b90c07c1?auto=format&fit=crop&w=300&q=80',
    offeringMentorship: true,
    about:
      'Healthcare professional with deep experience in cardiology, passionate about mentoring junior doctors and medical students.',
    expertise: [
      'Cardiology',
      'Clinical Training',
      'NHS Career Path',
      'Interview Preparation',
    ],
    helpTitle: 'Medical Career Guidance',
    helpDescription:
      'Advice on medical training, specialty applications, and work-life balance in healthcare.',
  },
  {
    id: 'p3',
    name: 'Zahra Hussain',
    title: 'Investment Banking Analyst',
    company: 'JPMorgan Chase',
    industry: 'finance',
    city: 'London',
    yearsExperience: 6,
    tags: ['Finance', 'Career Advice'],
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    offeringMentorship: true,
    about:
      'Finance professional with expertise in investment banking. Keen to help students interested in finance careers.',
    expertise: [
      'Investment Banking',
      'Financial Analysis',
      'Finance Career Path',
      'Interview Preparation',
    ],
    helpTitle: 'Career Advice',
    helpDescription:
      'General career guidance, CV reviews, and interview preparation.',
  },
  {
    id: 'p4',
    name: 'Mohammed Khan',
    title: 'Head of Mathematics',
    company: 'Sixth Form College',
    industry: 'education',
    city: 'Birmingham',
    yearsExperience: 10,
    tags: ['Education', 'Mentorship'],
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    offeringMentorship: false,
  },
];

const ProfessionalNetwork = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const [searchValue, setSearchValue] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [onlyMentors, setOnlyMentors] = useState(false);

  const filteredProfessionals = useMemo(() => {
    return professionals.filter(pro => {
      const matchesSearch =
        !searchValue ||
        pro.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        pro.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        pro.company.toLowerCase().includes(searchValue.toLowerCase());

      const matchesIndustry =
        selectedIndustry === 'all' || pro.industry === selectedIndustry;
      const matchesCity =
        selectedCity === 'all' ||
        pro.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesMentor = !onlyMentors || pro.offeringMentorship;

      return matchesSearch && matchesIndustry && matchesCity && matchesMentor;
    });
  }, [searchValue, selectedIndustry, selectedCity, onlyMentors]);

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
            onChangeText={setSearchValue}
          />
          <TouchableOpacity style={styles.joinButton} activeOpacity={0.9}>
            <Ionicons
              name="add"
              size={20}
              color={colors.accent.purple}
            />
            <Text variant="md-semibold" style={styles.joinButtonText}>
              Join Network as Professional
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [searchValue],
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
            onSelect={setSelectedIndustry}
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
            onSelect={setSelectedCity}
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
    [selectedIndustry, selectedCity, onlyMentors, filteredProfessionals.length],
  );

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
              name="time-outline"
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
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ProfessionalNetwork;


