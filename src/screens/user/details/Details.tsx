import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { saveItem, unsaveItem, checkIfSaved } from '@/store/slices/savedListingsSlice';
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

import { getRelatedBusinesses } from '@/services/firestore/businesses';
import { getRelatedServices } from '@/services/firestore/services';
import { getRelatedMarketplaceItems } from '@/services/firestore/marketplace';
import { getRelatedRooms } from '@/services/firestore/rooms';
import { ReviewModal } from '@/components/organisms';
import { ReportModal } from '@/components/organisms';
import { fetchReviews, fetchUserReview, submitReview, updateReview, deleteReview } from '@/store/slices/reviewsSlice';
import { submitReport as submitReportAction } from '@/store/slices/reportsSlice';
import type { ReviewFormData } from '@/services/firestore/reviews';
import type { ReportFormData, ReportType, TargetType } from '@/services/firestore/reports';
import { getListingImage } from '@/utils/placeholders';

type ListingType = 'business' | 'service' | 'marketplace' | 'room' | 'product';
type DetailsNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Details'>;
type DetailsRoute = RouteProp<MainStackParamList, 'Details'>;

const Details = () => {
  const navigation = useNavigation<DetailsNavigationProp>();
  const { params } = useRoute<DetailsRoute>();
  const listing = params?.listing;
  console.log('🔖 Details: Listing:', listing);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { savedItemIds } = useAppSelector(state => state.savedListings);

  const [isSaved, setIsSaved] = useState(false);
  const [relatedListings, setRelatedListings] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  // Reviews from Redux
  const { reviews, userReview, loading: reviewsLoading } = useAppSelector(state => state.reviews);

  // Check if current user is the owner of this listing
  const isOwner = user?.uid && listing?.ownerId && user.uid === listing.ownerId;

  // Check if item is saved - sync with Redux state
  useEffect(() => {
    if (listing?.id) {
      const saved = savedItemIds.includes(listing.id);
      console.log('🔖 Details: Checking if saved:', {
        listingId: listing.id,
        savedItemIds,
        saved,
        currentIsSaved: isSaved,
      });
      setIsSaved(saved);
    }
  }, [listing?.id, savedItemIds]);

  // NOTE: Removed checkIfSaved call - subscription keeps savedItemIds up-to-date
  // The subscription in MainNavigator handles real-time updates

  // Fetch reviews and user's review
  useEffect(() => {
    if (listing?.id) {
      // Infer listing type
      let type: ListingType = 'business';
      if (listing.category?.toLowerCase().includes('service')) type = 'service';
      else if (listing.price !== undefined && listing.priceLabel !== undefined) type = 'room';
      else if (listing.condition !== undefined) type = 'marketplace';

      // Fetch approved reviews
      dispatch(fetchReviews({ listingId: listing.id, listingType: type }));

      // Fetch user's review if logged in
      if (user?.uid) {
        dispatch(fetchUserReview({ userId: user.uid, listingId: listing.id }));
      }
    }
  }, [listing?.id, user?.uid, dispatch]);

  // Fetch related listings
  useEffect(() => {
    const fetchRelated = async () => {
      if (!listing?.id) return;

      setLoadingRelated(true);
      try {
        // Infer type or get from params if available (future improvement)
        // Current inference:
        let type: ListingType = 'business';
        if (listing.category?.toLowerCase().includes('service')) type = 'service';
        else if (listing.price !== undefined && listing.priceLabel !== undefined) type = 'room'; // Room has priceLabel
        else if (listing.condition !== undefined) type = 'marketplace'; // Marketplace has condition

        // Override inference if we can be sure
        // NOTE: This inference is fragile. Ideally we pass `type` in navigation params.

        let fetched: any[] = [];

        switch (type) {
          case 'business':
            if (listing.category) {
              fetched = await getRelatedBusinesses(listing.category, listing.id);
            }
            break;
          case 'service':
            // We need serviceType, but listing.category is often used as display for serviceType
            // Let's assume listing.category holds the serviceType or similar
            if (listing.category) {
              // getRelatedServices expects serviceType. 
              // If listing came from Services screen, `category` might be `serviceType`.
              fetched = await getRelatedServices(listing.category, listing.id);
            }
            break;
          case 'marketplace':
            if (listing.category) {
              fetched = await getRelatedMarketplaceItems(listing.category, listing.id);
            }
            break;
          case 'room':
            // Room type (single/double) is needed. `category` in listing item usually maps to type for rooms?
            // Let's check RoomItem type in navigation/types.ts: it has `type`.
            // But `listing` is `ListingItem` which just has `category`.
            // We might need to fetch the full room details to know the type if it's not in `category`.
            // For now, let's try using `category` as type if it matches known types, otherwise default.
            if (listing.category) {
              fetched = await getRelatedRooms(listing.category, listing.id);
            }
            break;
        }

        // Map to common display format if needed, but ListingCard handles mostly common props
        setRelatedListings(fetched);

      } catch (error) {
        console.error('Error fetching related listings:', error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelated();
  }, [listing]);

  const goBack = () => navigation.goBack();

  const handleToggleSave = async () => {
    if (!user?.uid || !listing?.id) return;

    try {
      if (isSaved) {
        await dispatch(unsaveItem({ userId: user.uid, itemId: listing.id })).unwrap();
        setIsSaved(false);
      } else {
        // Determine item type based on listing category or other properties
        const itemType = listing.category?.toLowerCase().includes('service')
          ? 'service'
          : 'business'; // Default to business, you can make this smarter
        await dispatch(saveItem({ userId: user.uid, itemType, itemId: listing.id })).unwrap();
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleWhatsApp = () => {
    const num = listing.whatsapp || listing.phone || '';
    const digits = (num || '').replace(/\D/g, '');
    if (!digits) return;
    const url = `https://wa.me/${digits}`;
    Linking.openURL(url).catch(() => { });
  };

  const handleEmail = () => {
    const email = (listing.email || '').trim();
    if (!email) return;
    const url = `mailto:${email}`;
    Linking.openURL(url).catch(() => { });
  };

  const handleCall = () => {
    const phone = listing.phone || listing.whatsapp || '';
    if (!phone) return;
    const url = `tel:${phone.replace(/\s/g, '')}`;
    Linking.openURL(url).catch(() => { });
  };

  const handleOpenReviewModal = () => {
    if (!user?.uid) {
      // TODO: Show login prompt
      console.log('Please login to write a review');
      return;
    }
    setReviewModalVisible(true);
  };

  const handleSubmitReview = async (data: ReviewFormData) => {
    if (!user?.uid || !listing?.id) return;

    // Infer listing type
    let type: ListingType = 'business';
    if (listing.category?.toLowerCase().includes('service')) type = 'service';
    else if (listing.price !== undefined && listing.priceLabel !== undefined) type = 'room';
    else if (listing.condition !== undefined) type = 'marketplace';

    try {
      if (userReview) {
        // Update existing review
        await dispatch(updateReview({
          reviewId: userReview.id,
          userId: user.uid,
          listingId: listing.id,
          data,
        })).unwrap();
      } else {
        // Submit new review
        await dispatch(submitReview({
          listingId: listing.id,
          listingType: type,
          userId: user.uid,
          userName: user.displayName || user.email || 'Anonymous',
          data,
        })).unwrap();
      }
      setReviewModalVisible(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  const handleDeleteReview = async () => {
    if (!user?.uid || !userReview) return;

    try {
      await dispatch(deleteReview({ reviewId: userReview.id, userId: user.uid })).unwrap();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleOpenReportModal = () => {
    if (!user?.uid) {
      console.log('Please login to report');
      return;
    }
    setReportModalVisible(true);
  };

  const handleSubmitReport = async (data: ReportFormData) => {
    if (!user?.uid || !listing?.id) return;

    // Infer listing type
    let targetType: TargetType = 'business';
    if (listing.category?.toLowerCase().includes('service')) targetType = 'service';
    else if (listing.price !== undefined && listing.priceLabel !== undefined) targetType = 'room';
    else if (listing.condition !== undefined) targetType = 'marketplace';

    try {
      await dispatch(submitReportAction({
        reporterId: user.uid,
        reporterName: user.displayName || user.email || 'Anonymous',
        reportType: 'listing' as ReportType,
        targetId: listing.id,
        targetName: listing.name,
        data,
        targetType,
      })).unwrap();
      setReportModalVisible(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  };

  const navigateToRelated = (item: any) => {
    // Map related item to ListingItem with all form fields for Details
    const isService = !!item.serviceType || (item.category && String(item.category).toLowerCase().includes('service'));
    const mappedItem: any = {
      id: item.id,
      name: item.name || item.title,
      category: item.category || item.type || item.serviceType,
      location: item.location || item.city,
      rating: item.rating || 0,
      reviews: item.reviews || item.reviewCount || 0,
      verified: item.verified,
      image: getListingImage(item.images, isService ? 'service' : 'business'),
      description: item.description,
      phone: item.phone,
      email: item.email,
      ownerId: item.ownerId || item.sellerId || item.providerId,
      price: item.price,
      priceLabel: item.priceLabel,
      condition: item.condition,
      listingType: isService ? ('service' as const) : ('business' as const),
      tagline: item.tagline,
      contactPerson: item.contactPerson,
      whatsapp: item.whatsapp,
      website: item.website,
      instagram: item.instagram,
      openingHours: item.openingHours,
      tags: item.tags,
      areasCovered: item.areasCovered,
    };

    navigation.push('Details', { listing: mappedItem });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
            <Text variant="md-medium" style={styles.backText}>
              Back
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* Report Button (Flag Icon) */}
            {!isOwner && (
              <TouchableOpacity
                onPress={handleOpenReportModal}
                style={styles.bookmarkButton}
                activeOpacity={0.7}
              >
                <Ionicons name="flag-outline" size={20} color={colors.status.errorDark} />
              </TouchableOpacity>
            )}
            {/* Bookmark Button */}
            <TouchableOpacity
              onPress={handleToggleSave}
              style={styles.bookmarkButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isSaved ? colors.secondary[500] : colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.hero}>
          <Image
            source={typeof listing.image === 'string' ? { uri: listing.image } : listing.image}
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
          <Text variant="lg-semibold" style={styles.title}>{listing.name}</Text>
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
              'No description available.'}
          </Text>
        </View>

        {/* Optional details – only show when user has entered them */}
        {listing.tagline && listing.tagline.trim() && (
          <View style={styles.section}>
            <Text variant="lg-bold" style={styles.sectionTitle}>
              Tagline
            </Text>
            <Text variant="md-normal" style={styles.subtleText}>
              {listing.tagline}
            </Text>
          </View>
        )}

        {listing.contactPerson && listing.contactPerson.trim() && (
          <View style={styles.section}>
            <Text variant="lg-bold" style={styles.sectionTitle}>
              Contact Person
            </Text>
            <Text variant="md-normal" style={styles.subtleText}>
              {listing.contactPerson}
            </Text>
          </View>
        )}

        {listing.openingHours && listing.openingHours.trim() && (
          <View style={styles.section}>
            <Text variant="lg-bold" style={styles.sectionTitle}>
              Opening Hours
            </Text>
            <Text variant="md-normal" style={styles.subtleText}>
              {listing.openingHours}
            </Text>
          </View>
        )}

        {listing.website && listing.website.trim() && (
          <View style={styles.section}>
            <Text variant="lg-bold" style={styles.sectionTitle}>
              Website
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                const url = listing.website!.trim().startsWith('http') ? listing.website!.trim() : `https://${listing.website!.trim()}`;
                Linking.openURL(url).catch(() => {});
              }}>
              <Text variant="md-normal" style={[styles.subtleText, { color: colors.primary[600], textDecorationLine: 'underline' }]}>
                {listing.website.trim()}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {listing.instagram && listing.instagram.trim() && (
          <View style={styles.section}>
            <Text variant="lg-bold" style={styles.sectionTitle}>
              Instagram
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                const handle = listing.instagram!.trim().replace(/^@/, '');
                Linking.openURL(`https://instagram.com/${handle}`).catch(() => {});
              }}>
              <Text variant="md-normal" style={[styles.subtleText, { color: colors.primary[600], textDecorationLine: 'underline' }]}>
                {listing.instagram.trim()}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {listing.tags && listing.tags.length > 0 && (
          <View style={styles.section}>
            <Text variant="lg-bold" style={styles.sectionTitle}>
              Tags
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {listing.tags.map(tag => (
                <View key={tag} style={styles.tagChip}>
                  <Text variant="sm-medium" style={styles.tagChipText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {listing.areasCovered && listing.areasCovered.length > 0 && (
          <View style={styles.section}>
            <Text variant="lg-bold" style={styles.sectionTitle}>
              Areas Covered
            </Text>
            <Text variant="md-normal" style={styles.subtleText}>
              {listing.areasCovered.join(', ')}
            </Text>
          </View>
        )}

        {/* Contact – only show buttons when the corresponding field exists */}
        {(listing.whatsapp || listing.phone || listing.email) && (
          <View style={styles.section}>
            <Text variant="lg-bold" style={styles.sectionTitle}>
              Contact
            </Text>
            <View style={styles.contactCard}>
              {(listing.whatsapp || listing.phone) && (
                <TouchableOpacity
                  style={[styles.contactItem, styles.contactPrimary]}
                  activeOpacity={0.85}
                  onPress={handleWhatsApp}>
                  <Ionicons name="logo-whatsapp" size={18} color={colors.common.white} />
                  <Text variant="md-semibold" style={styles.contactTextPrimary}>
                    WhatsApp
                  </Text>
                </TouchableOpacity>
              )}
              {listing.email && listing.email.trim() && (
                <TouchableOpacity
                  style={styles.contactItem}
                  activeOpacity={0.85}
                  onPress={handleEmail}>
                  <Ionicons name="mail-outline" size={18} color={colors.text.secondary} />
                  <Text variant="md-medium" style={styles.contactText}>
                    Email
                  </Text>
                </TouchableOpacity>
              )}
              {(listing.phone || listing.whatsapp) && (
                <TouchableOpacity
                  style={styles.contactItem}
                  activeOpacity={0.85}
                  onPress={handleCall}>
                  <Ionicons name="call-outline" size={18} color={colors.text.secondary} />
                  <Text variant="md-medium" style={styles.contactText}>
                    Call
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text variant="lg-bold" style={styles.sectionTitle}>
              Reviews ({reviews.length})
            </Text>
            {!isOwner && (
              <TouchableOpacity
                style={styles.writeReviewButton}
                onPress={handleOpenReviewModal}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={18} color={colors.secondary[500]} />
                <Text variant="sm-semibold" style={styles.writeReviewText}>
                  {userReview ? 'Edit Review' : 'Write Review'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* User's Review (if exists and pending) */}
          {userReview && userReview.status === 'pending' && (
            <View style={styles.pendingReviewCard}>
              <View style={styles.pendingReviewHeader}>
                <View style={styles.pendingBadge}>
                  <Ionicons name="time-outline" size={14} color={colors.accent.orange} />
                  <Text variant="xs-semibold" style={styles.pendingBadgeText}>
                    Pending Approval
                  </Text>
                </View>
                <View style={styles.reviewStars}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Ionicons
                      key={index}
                      name={index < userReview.rating ? 'star' : 'star-outline'}
                      size={14}
                      color={colors.accent.orange}
                    />
                  ))}
                </View>
              </View>
              <Text variant="sm-normal" style={styles.pendingReviewComment}>
                {userReview.comment || 'No comment provided'}
              </Text>
              <View style={styles.pendingReviewActions}>
                <TouchableOpacity onPress={handleOpenReviewModal} activeOpacity={0.7}>
                  <Text variant="xs-semibold" style={styles.editReviewText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteReview} activeOpacity={0.7}>
                  <Text variant="xs-semibold" style={styles.deleteReviewText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Approved Reviews */}
          {reviewsLoading ? (
            <Text variant="sm-normal" style={styles.subtleText}>Loading reviews...</Text>
          ) : reviews.length === 0 ? (
            <Text variant="sm-normal" style={styles.subtleText}>
              No reviews yet. Be the first to review!
            </Text>
          ) : (
            reviews.map(review => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text variant="md-medium">{review.userName}</Text>
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
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
                <Text variant="md-normal" style={styles.subtleText}>
                  {review.comment || 'No comment provided'}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Related Listings Section - only show if there are items */}
        {relatedListings.length > 0 && (
          <View style={styles.section}>
            <Text variant="lg-bold" style={styles.sectionTitle}>
              More from this category
            </Text>
            {relatedListings.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.relatedListItem}
                activeOpacity={0.9}
                onPress={() => navigateToRelated(item)}
              >
                <ListingCard
                  title={item.name || item.title}
                  category={item.category || item.type || item.serviceType}
                  location={item.city || item.location}
                  rating={item.rating || 0}
                  reviews={item.reviewCount || item.reviews || 0}
                  verified={item.verified}
                  imageUri={getListingImage(item.images, 'business')}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Review Modal */}
      <ReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleSubmitReview}
        existingReview={userReview}
        listingName={listing.name}
      />

      {/* Report Modal */}
      <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={handleSubmitReport}
        targetName={listing.name}
        reportType="listing"
      />
    </SafeAreaView>
  );
};

export default Details;

