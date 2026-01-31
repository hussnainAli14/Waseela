import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Text, Image } from '@/components/atoms';
import { colors } from '@/theme';
import { styles } from './styles';
import { MainStackParamList, ProfessionalProfileItem } from '@/navigation/types';

type ProfileRoute = RouteProp<MainStackParamList, 'ProfessionalProfile'>;

const ProfessionalProfile = () => {
  const { params } = useRoute<ProfileRoute>();
  const professional: ProfessionalProfileItem = params.professional;

  const handleEmail = () => {
    // You can add email to ProfessionalProfileItem type if needed
    const email = (professional as any).email || 'contact@example.com';
    const url = `mailto:${email}`;
    Linking.openURL(url).catch(() => {});
  };

  const handleLinkedIn = () => {
    if (professional.linkedinUrl) {
      Linking.openURL(professional.linkedinUrl).catch(() => {});
    }
  };

  const expertiseChips =
    professional.expertise ?? [
      'Investment Banking',
      'Financial Analysis',
      'Finance Career Path',
      'Interview Preparation',
    ];

  const aboutText =
    professional.about ??
    'Finance professional with expertise in investment banking. Keen to help students interested in finance careers.';

  const helpTitle = professional.helpTitle ?? 'Career Advice';
  const helpDescription =
    professional.helpDescription ??
    'General career guidance, CV reviews, and interview preparation';

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.avatarWrapper}>
            <Image
              source={typeof professional.avatar === 'string' ? { uri: professional.avatar } : professional.avatar}
              resizeMode="cover"
              containerStyle={styles.avatar}
              borderRadius={999}
            />
          </View>
          <Text variant="lg-semibold" style={styles.nameText}>
            {professional.name}
          </Text>
          <Text variant="md-normal" style={styles.titleText}>
            {professional.title}
          </Text>
          <Text variant="md-normal" style={styles.companyText}>
            {professional.company}
          </Text>
          {professional.tags && professional.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {professional.tags.map(tag => (
                <View key={tag} style={styles.tagBadge}>
                  <Text variant="sm-medium" style={styles.tagBadgeText}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.statsCardWrapper}>
          <View style={styles.statsCard}>
            <View style={styles.statsItem}>
              <Text variant="sm-normal" style={styles.statsLabel}>
                Industry
              </Text>
              <Text variant="md-medium" style={styles.statsValue}>
                {professional.industry ?? 'Finance'}
              </Text>
            </View>
            <View style={styles.statsItem}>
              <Text variant="sm-normal" style={styles.statsLabel}>
                Location
              </Text>
              <Text variant="md-medium" style={styles.statsValue}>
                {professional.city}
              </Text>
            </View>
            <View style={styles.statsItem}>
              <Text variant="sm-normal" style={styles.statsLabel}>
                Experience
              </Text>
              <Text variant="md-medium" style={styles.statsValue}>
                {professional.yearsExperience} yrs
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg-bold" style={styles.sectionTitle}>
            About
          </Text>
          <Text variant="md-normal" style={styles.bodyText}>
            {aboutText}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="lg-bold" style={styles.sectionTitle}>
            Areas of Expertise
          </Text>
          <View style={styles.chipRow}>
            {expertiseChips.map(chip => (
              <View key={chip} style={styles.chip}>
                <Text variant="sm-medium" style={styles.chipText}>
                  {chip}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg-bold" style={styles.sectionTitle}>
            What I Can Help With
          </Text>
          <View style={styles.helpCard}>
            <View style={styles.helpHeader}>
              <View style={styles.helpIconWrapper}>
                <Ionicons
                  name="book-outline"
                  size={18}
                  color={colors.primary[500]}
                />
              </View>
              <Text variant="md-semibold" style={styles.helpTitle}>
                {helpTitle}
              </Text>
            </View>
            <Text variant="md-normal" style={styles.helpBodyText}>
              {helpDescription}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.emailButton}
            activeOpacity={0.9}
            onPress={handleEmail}>
            <View style={styles.emailButtonContent}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={colors.common.white}
              />
              <Text variant="md-semibold" style={styles.emailButtonText}>
                Send Email
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            activeOpacity={0.9}
            onPress={handleLinkedIn}>
            <View style={styles.linkButtonContent}>
              <Ionicons
                name="logo-linkedin"
                size={18}
                color={colors.accent.purple}
              />
              <Text variant="md-semibold" style={styles.linkButtonText}>
                View LinkedIn Profile
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text variant="sm-normal" style={styles.noteText}>
            <Text variant="md-normal" style={styles.noteLabel}>Note: </Text>
            Please be respectful of the professional&apos;s time. When reaching
            out, be specific about what you&apos;re looking for help with and
            have clear questions ready.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfessionalProfile;


