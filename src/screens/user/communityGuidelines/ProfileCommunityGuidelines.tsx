import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '@/components/atoms';
import { colors } from '@/theme';
import type { MainStackParamList } from '@/navigation/types';
import { styles } from './styles';

type Navigation = NativeStackNavigationProp<MainStackParamList, 'CommunityGuidelines'>;

type Bullet = {
  text: string;
  type?: 'check' | 'alert';
};

type Section = {
  number: string;
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  bullets: Bullet[];
  note?: string;
  reservedBox?: string[];
  prohibited?: string[];
  infoBox?: {
    title: string;
    bullets: string[];
    highlight?: string;
  };
};

const sectionData: Section[] = [
  {
    number: '1.',
    title: 'Respect & Conduct',
    subtitle: 'Building a respectful community',
    icon: 'person-circle-outline',
    iconColor: colors.accent.blueDark,
    iconBg: '#e9f2ff',
    bullets: [
      { text: 'Treat others with respect, dignity, and courtesy' },
      { text: 'Communicate politely and professionally' },
      {
        text: 'Avoid abusive, threatening, harassing, discriminatory, or offensive language',
      },
      {
        text: 'Respect differences of opinion and background within the community',
      },
    ],
    note:
      'Wasila is a space built on trust and khidmat. Any behaviour that undermines this will not be tolerated.',
  },
  {
    number: '2.',
    title: 'Appropriate Use of the Platform',
    subtitle: 'Permitted and prohibited activities',
    icon: 'briefcase-outline',
    iconColor: colors.accent.orange,
    iconBg: '#fff4e6',
    bullets: [
      { text: 'Legitimate community purposes' },
      { text: 'Listing genuine businesses or services' },
      { text: 'Buying or selling lawful items' },
      { text: 'Finding accommodation' },
      { text: 'Seeking or offering professional guidance or mentorship' },
    ],
    prohibited: [
      'Post false, misleading, or deceptive information',
      'Impersonate another person or business',
      'Use the platform for scams, fraud, or illegal activity',
      'Spam users or misuse contact details',
      'Use Wasila for dating, matchmaking, or inappropriate personal contact',
    ],
  },
  {
    number: '3.',
    title: 'Listings & Content Rules',
    subtitle: 'Requirements for all content',
    icon: 'document-text-outline',
    iconColor: colors.accent.orange,
    iconBg: '#fff4e6',
    bullets: [
      { text: 'Be accurate and honest' },
      { text: 'Clearly describe services or offerings' },
      { text: 'Not contain misleading pricing or claims' },
      { text: 'Not promote unlawful or unethical services' },
    ],
    infoBox: {
      title: 'Wasila reserves the right to:',
      bullets: [
        'Review, approve, edit, or remove any listing',
        'Reject content that does not meet community standards',
        'Suspend or remove accounts that repeatedly violate guidelines',
      ],
    },
  },
  {
    number: '4.',
    title: 'Safety & Personal Information',
    subtitle: 'Protecting yourself and others',
    icon: 'shield-checkmark-outline',
    iconColor: colors.secondary[600],
    iconBg: '#e8f6f0',
    bullets: [
      {
        text: 'Do not share sensitive personal information publicly (e.g. home address, ID documents, bank details)',
        type: 'alert',
      },
      {
        text: 'Communicate responsibly with service providers or buyers',
      },
      { text: 'Meet in safe, public places where applicable' },
      { text: 'Use your own judgement when engaging with others' },
    ],
    infoBox: {
      title:
        'Important: Wasila does not guarantee services, transactions, or outcomes and is not responsible for disputes between users.',
      bullets: [],
    },
  },
  {
    number: '5.',
    title: 'Age Requirements & Safeguarding',
    subtitle: 'Protecting young users',
    icon: 'eye-outline',
    iconColor: colors.accent.purple,
    iconBg: '#f1eafb',
    bullets: [
      { text: 'Users must be at least 16 years old to use Wasila independently' },
      {
        text: 'Users aged 13–15 may only register with parental/guardian consent',
      },
      {
        text: 'Users under 13 are not permitted to register',
        type: 'alert',
      },
    ],
    infoBox: {
      title:
        'Wasila takes online safeguarding seriously and actively moderates content to maintain a safe environment. Any concerns involving minors, inappropriate contact, abuse or exploitation should be reported immediately to: safeguarding@wasila.uk',
      bullets: [],
    },
  },
  {
    number: '6.',
    title: 'Moderation & Enforcement',
    subtitle: 'Maintaining community standards',
    icon: 'alert-circle-outline',
    iconColor: colors.status.error,
    iconBg: '#ffecec',
    bullets: [
      { text: 'Monitor content and activity' },
      { text: 'Investigate reports or complaints' },
      { text: 'Temporarily suspend or permanently ban users' },
      { text: 'Remove content without prior notice if it poses risk or violates guidelines' },
    ],
    infoBox: {
      title:
        'Important: Serious violations may be reported to relevant authorities where required by law.',
      bullets: [],
    },
  },
  {
    number: '7.',
    title: 'Data Protection & Privacy',
    subtitle: 'Your data rights',
    icon: 'lock-closed-outline',
    iconColor: colors.accent.teal ?? colors.primary[600],
    iconBg: '#e7f7f4',
    bullets: [
      { text: 'Data is used only for platform functionality and safety' },
      { text: 'You retain rights over your personal data (access, correction, deletion)' },
      { text: 'Data is not sold to third parties' },
    ],
    infoBox: {
      title: 'For privacy-related enquiries, contact: dataprotection@wasila.uk',
      bullets: [],
    },
  },
  {
    number: '8.',
    title: 'Disclaimer',
    subtitle: 'Platform limitations',
    icon: 'warning-outline',
    iconColor: colors.text.secondary,
    iconBg: '#f5f6f7',
    bullets: [
      { text: 'Wasila does not act as an employer, agent, or guarantor' },
      { text: 'Wasila does not verify professional qualifications beyond basic checks' },
      { text: 'Wasila is not responsible for agreements or transactions between users' },
    ],
    note: 'Use of the platform is at your own discretion.',
  },
  {
    number: '9.',
    title: 'Agreement',
    subtitle: 'Your acceptance of these terms',
    icon: 'document-text-outline',
    iconColor: colors.secondary[600],
    iconBg: '#e8f6f0',
    bullets: [
      { text: 'You have read and understood these guidelines' },
      { text: 'You agree to comply with them' },
      { text: 'You understand that violations may result in account suspension or removal' },
    ],
  },
];

const ProfileCommunityGuidelines: React.FC = () => {
  const navigation = useNavigation<Navigation>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text variant="lg-bold" style={styles.heroTitle}>
            Welcome to Wasila
          </Text>
          <Text variant="sm-medium" style={styles.heroBody}>
            Wasila is a community-first platform created to help Momineen
            connect, support one another, and access trusted services in a safe
            and respectful environment. All users are expected to follow the
            guidelines below.
          </Text>
        </View>

        {sectionData.map(section => (
          <View key={section.title} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: section.iconBg }]}>
                <Ionicons name={section.icon as any} size={20} color={section.iconColor} />
              </View>
              <View style={styles.sectionTitleBlock}>
                <Text variant="md-semibold" style={styles.sectionTitle}>
                  {section.number} {section.title}
                </Text>
                <Text variant="sm-normal" style={styles.sectionSubtitle}>
                  {section.subtitle}
                </Text>
              </View>
            </View>

            <View style={styles.bulletList}>
              {section.bullets.map(item => (
                <View key={item.text} style={styles.bulletRow}>
                  <Ionicons
                    name={item.type === 'alert' ? 'alert-circle' : 'checkmark-circle'}
                    size={18}
                    color={item.type === 'alert' ? colors.status.warning : colors.secondary[600]}
                  />
                  <Text variant="sm-normal" style={styles.bulletText}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>

            {section.note && (
              <View style={styles.noteBox}>
                <Text variant="sm-medium" style={styles.noteText}>
                  {section.note}
                </Text>
              </View>
            )}

            {section.infoBox && (
              <View style={styles.infoBox}>
                <Text variant="sm-semibold" style={styles.infoTitle}>
                  {section.infoBox.title}
                </Text>
                {section.infoBox.bullets.map(text => (
                  <View key={text} style={styles.infoRow}>
                    <Text variant="sm-normal" style={styles.infoText}>
                      • {text}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {section.reservedBox && (
              <View style={styles.infoBox}>
                {section.reservedBox.map(text => (
                  <Text key={text} variant="sm-normal" style={styles.infoText}>
                    • {text}
                  </Text>
                ))}
              </View>
            )}

            {section.prohibited && (
              <View style={styles.warningBox}>
                <Text variant="sm-semibold" style={styles.warningTitle}>
                  Users must not:
                </Text>
                {section.prohibited.map(item => (
                  <View key={item} style={styles.warningRow}>
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={colors.status.error}
                    />
                    <Text variant="sm-normal" style={styles.warningText}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={styles.commitmentCard}>
          <Text variant="lg-bold" style={styles.commitmentTitle}>
            Our Commitment
          </Text>
          <Text variant="md-normal" style={styles.commitmentText}>
            Wasila exists to strengthen community bonds and make it easier for Momineen to help one
            another — safely, respectfully, and responsibly.
          </Text>
          <Text variant="md-semibold" style={styles.commitmentTextStrong}>
            Thank you for being part of this community.
          </Text>
        </View>
        <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Profile')}>
            <Text variant="md-semibold" style={styles.ctaText}>
              I Understand
            </Text>
          </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.bottomNavItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={22} color={colors.text.secondary} />
          <Text variant="xs-normal" style={styles.bottomNavLabel}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Directory')}>
          <Ionicons name="storefront-outline" size={22} color={colors.text.secondary} />
          <Text variant="xs-normal" style={styles.bottomNavLabel}>
            Directory
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Services')}>
          <Ionicons name="briefcase-outline" size={22} color={colors.text.secondary} />
          <Text variant="xs-normal" style={styles.bottomNavLabel}>
            Services
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={22} color={colors.secondary[600]} />
          <Text variant="xs-normal" style={[styles.bottomNavLabel, styles.bottomNavLabelActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileCommunityGuidelines;


