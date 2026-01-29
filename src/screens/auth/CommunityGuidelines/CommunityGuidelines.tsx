import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Button, Image } from '@/components/atoms';
import { CommunityGuidelinesScreenProps } from './types';
import { styles } from './styles';
import { images } from '@/assets/images/images';
import { colors } from '@/theme';

const CommunityGuidelines: React.FC<CommunityGuidelinesScreenProps> = ({
  navigation,
}) => {
  const handleContinue = () => {
    navigation.navigate('Login');
  };

  const safetyFeatures = [
    {
      icon: 'shield-outline',
      title: 'Safe Community Space',
      description:
        'All listings are moderated before going live to protect our community',
      iconColor: colors.secondary[500],
    },
    {
      icon: 'lock-closed-outline',
      title: 'Your Privacy Protected',
      description:
        'Your personal information is never shared without your consent',
      iconColor: colors.primary[500],
    },
    {
      icon: 'eye-outline',
      title: 'Report Inappropriate Content',
      description:
        'Easy reporting tools to flag any concerning content or behavior',
      iconColor: colors.accent.purple,
    },
    {
      icon: 'people-outline',
      title: 'Age Verification',
      description: 'Users must be 16+ to use Wasila independently',
      iconColor: colors.accent.orange,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image
            source={images.placeholderImage}
            width={80}
            height={80}
            resizeMode="contain"
            containerStyle={styles.logo}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text variant="3xl-bold" style={styles.title}>
            Your Safety Matters
          </Text>
          <Text variant="md-normal" style={styles.subtitle}>
            Community safeguarding and online safety
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {safetyFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: `${feature.iconColor}15` },
                ]}>
                <Ionicons
                  name={feature.icon}
                  size={24}
                  color={feature.iconColor}
                />
              </View>
              <View style={styles.featureContent}>
                <Text variant="md-semibold" style={styles.featureTitle}>
                  {feature.title}
                </Text>
                <Text variant="sm-normal" style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.noticeContainer}>
          <View style={styles.noticeHeader}>
            <Ionicons
              name="warning-outline"
              size={20}
              color={colors.accent.orangeBrown}
            />
            <Text variant="md-semibold" style={styles.noticeTitle}>
              Important Notice
            </Text>
          </View>
          <Text variant="sm-normal" style={styles.noticeText}>
            Never share personal information like your home address, phone
            number, or financial details in public listings. Meet in public
            places for transactions and always inform someone you trust.
          </Text>
        </View>

        <Button
          title="Continue to Wasila"
          variant="primary"
          size="large"
          fullWidth
          onPress={handleContinue}
          containerStyle={styles.continueButton}
        />

        <View style={styles.disclaimerContainer}>
          <Text variant="xs-normal" style={styles.disclaimerText}>
            By continuing, you agree to our Community Guidelines and Safety
            Policies
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommunityGuidelines;

