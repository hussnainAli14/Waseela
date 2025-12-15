import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MainStackParamList } from '@/navigation/types';
const mockReviews = [
  {
    id: '1',
    name: 'Ahmed K.',
    timeAgo: '2 weeks ago',
    rating: 5,
    text:
      'Excellent service! Very professional and trustworthy. Highly recommended to the community.',
  },
  {
    id: '2',
    name: 'Khadija M.',
    timeAgo: '1 month ago',
    rating: 5,
    text:
      'Amazing experience. Will definitely use their services again. Staff were very kind and welcoming.',
  },
  {
    id: '3',
    name: 'Hussain A.',
    timeAgo: '2 months ago',
    rating: 4,
    text:
      'Very good overall. Great communication and reliable. There is some room for improvement in waiting times.',
  },
];

const mockRelated = [
  {
    id: 'rel-1',
    name: 'Al-Noor Restaurant',
    category: 'Food',
    location: 'London',
    rating: 4.6,
    reviews: 124,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rel-2',
    name: 'Barakah Cafe',
    category: 'Food',
    location: 'London',
    rating: 4.7,
    reviews: 98,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1432139509613-5c4255815697?auto=format&fit=crop&w=600&q=80',
  },
];

import { Text, Image } from '@/components/atoms';
import { colors } from '@/theme';
import { styles } from './styles';
import { ListingCard } from '@/components';

type DetailsRoute = RouteProp<MainStackParamList, 'Details'>;

const Details = () => {
  const navigation = useNavigation();
  const { params } = useRoute<DetailsRoute>();
  const listing = params?.listing;

  const goBack = () => navigation.goBack();

  const handleWhatsApp = () => {
    const phone = listing.phone || '0000000000';
    const url = `https://wa.me/${phone}`;
    Linking.openURL(url).catch(() => {});
  };

  const handleEmail = () => {
    const email = listing.email || 'info@example.com';
    const url = `mailto:${email}`;
    Linking.openURL(url).catch(() => {});
  };

  const handleCall = () => {
    const phone = listing.phone || '0000000000';
    const url = `tel:${phone}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backRow} onPress={goBack} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
          <Text variant="md-medium" style={styles.backText}>
            Details
          </Text>
        </TouchableOpacity>

        <View style={styles.hero}>
          <Image
            source={{ uri: listing.image }}
            resizeMode="cover"
            containerStyle={styles.heroImage}
          />
          {listing.verified && (
            <View style={styles.verifiedPill}>
              <MaterialCommunityIcons
                name="check-decagram-outline"
                size={16}
                color={colors.common.white}
              />
              <Text variant="sm-medium" style={styles.verifiedText}>
                Verified
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text variant="lg-semibold">{listing.name}</Text>
          <View style={styles.badge}>
            <Text variant="md-medium" style={styles.badgeText}>
              {listing.category}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
              <Text variant="md-medium" style={styles.subtleText}>
                {listing.location}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={16} color={colors.accent.orange} />
              <Text variant="md-medium" style={styles.subtleText}>
                {listing.rating} ({listing.reviews})
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg-bold" style={styles.sectionTitle}>
            About
          </Text>
          <Text variant="md-normal" style={styles.subtleText}>
            {listing.description ??
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Authentic Middle Eastern flavors and warm hospitality.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="lg-bold" style={styles.sectionTitle}>
            Contact
          </Text>
          <View style={styles.contactCard}>
            <TouchableOpacity
              style={[styles.contactItem, styles.contactPrimary]}
              activeOpacity={0.85}
              onPress={handleWhatsApp}>
              <Ionicons name="logo-whatsapp" size={18} color={colors.common.white} />
              <Text variant="md-semibold" style={styles.contactTextPrimary}>
                WhatsApp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactItem}
              activeOpacity={0.85}
              onPress={handleEmail}>
              <Ionicons name="mail-outline" size={18} color={colors.text.secondary} />
              <Text variant="md-medium" style={styles.contactText}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactItem}
              activeOpacity={0.85}
              onPress={handleCall}>
              <Ionicons name="call-outline" size={18} color={colors.text.secondary} />
              <Text variant="md-medium" style={styles.contactText}>
                Call
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg-bold" style={styles.sectionTitle}>
            Reviews ({listing.reviews})
          </Text>
          {mockReviews.map(review => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text variant="md-medium">{review.name}</Text>
                <View style={styles.reviewStars}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Ionicons
                      key={index}
                      name={index < review.rating ? 'star' : 'star-outline'}
                      size={16}
                      color={colors.accent.orange}
                    />
                  ))}
                </View>
              </View>
              <Text variant="sm-normal" style={styles.reviewTime}>
                {review.timeAgo}
              </Text>
              <Text variant="md-normal" style={styles.subtleText}>
                {review.text}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text variant="lg-bold" style={styles.sectionTitle}>
            More from this category
          </Text>
          {mockRelated.map(item => (
            <View key={item.id} style={styles.relatedListItem}>
              <ListingCard
                title={item.name}
                category={item.category}
                location={item.location}
                rating={item.rating}
                reviews={item.reviews}
                verified={item.verified}
                imageUri={item.image}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Details;

