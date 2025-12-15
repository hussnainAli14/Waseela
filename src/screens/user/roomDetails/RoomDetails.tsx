import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Text, Image } from '@/components/atoms';
import { colors } from '@/theme';
import { styles } from './styles';
import { MainStackParamList, RoomItem } from '@/navigation/types';

type RoomDetailsRoute = RouteProp<MainStackParamList, 'RoomDetails'>;

const RoomDetails = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RoomDetailsRoute>();
  const room: RoomItem = params.room;

  const goBack = () => navigation.goBack();

  const handleContactPress = async () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in your room listing "${room.title}" on Waseela.`,
    );

    const whatsappUrl = `whatsapp://send?text=${message}`;

    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);

      if (!canOpen) {
        Alert.alert(
          'WhatsApp not available',
          'Please make sure WhatsApp is installed on your device.',
        );
        return;
      }
      await Linking.openURL(whatsappUrl);
    } catch {
      Alert.alert('Something went wrong', 'Unable to open WhatsApp right now.');
    }
  };

  const getRoomTypeLabel = (type: string) => {
    switch (type) {
      case 'single':
        return 'Single Room';
      case 'double':
        return 'Double Room';
      case 'studio':
        return 'Studio';
      case 'shared':
        return 'Shared Room';
      default:
        return 'Room';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={goBack}
            activeOpacity={0.8}
            style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <Text variant="md-medium" style={styles.headerTitle}>
            Room Details
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: room.image }}
            resizeMode="cover"
            containerStyle={styles.heroImage}
            borderRadius={0}
          />
          {room.billsIncluded && (
            <View style={styles.billsBadge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.common.white} />
              <Text variant="sm-medium" style={styles.billsBadgeText}>
                Bills Included
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <View style={styles.typeBadge}>
                <Text variant="sm-medium" style={styles.typeBadgeText}>
                  {getRoomTypeLabel(room.type)}
                </Text>
              </View>
              <Text variant="xl-bold" style={styles.roomTitle}>
                {room.title}
              </Text>
            </View>
            <View style={styles.priceColumn}>
              <Text variant="xl-bold" style={styles.priceText}>
                £ {room.price}
              </Text>
              <Text variant="sm-normal" style={styles.priceSubtext}>
                per month
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={colors.text.secondary}
            />
            <Text variant="md-normal" style={styles.metaText}>
              {room.locationLine1}
            </Text>
          </View>

          {room.availableFrom && (
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
              <Text variant="md-normal" style={styles.metaText}>
                Available from {room.availableFrom}
              </Text>
            </View>
          )}

          <View style={styles.proximityBadge}>
            <Text variant="sm-medium" style={styles.proximityBadgeText}>
              {room.locationLine2}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg-bold" style={styles.sectionTitle}>
            Description
          </Text>
          <Text variant="md-normal" style={styles.bodyText}>
            {room.description ??
              'Bright single room in a friendly shared house. Close to UCL campus, 5 min walk to tube station. Fully furnished with desk and wardrobe.'}
          </Text>
        </View>

        {room.amenities && room.amenities.length > 0 && (
          <View style={styles.section}>
            <Text variant="lg-bold" style={styles.sectionTitle}>
              Amenities
            </Text>
            <View style={styles.amenitiesRow}>
              {room.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityTag}>
                  <Text variant="md-normal" style={styles.amenityText}>
                    {amenity}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.billsRow}>
            <View style={styles.billsTextContainer}>
              <Text variant="lg-bold" style={styles.sectionTitle}>
                Bills
              </Text>
              <Text variant="md-normal" style={styles.bodyText}>
                All bills included in rent
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={32} color={colors.secondary[500]} />
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg-bold" style={styles.sectionTitle}>
            Posted by
          </Text>
          <View style={styles.postedByRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color={colors.accent.orange} />
            </View>
            <View style={styles.postedByInfo}>
              <Text variant="md-semibold" style={styles.landlordName}>
                {room.landlordName ?? 'Fatima K.'}
              </Text>
              <Text variant="sm-normal" style={styles.postedDate}>
                Posted {room.postedAt ?? '2 days ago'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.contactButton}
            activeOpacity={0.9}
            onPress={handleContactPress}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color={colors.common.white}
            />
            <Text variant="md-semibold" style={styles.contactButtonText}>
              Contact Landlord
            </Text>
          </TouchableOpacity>
          <Text variant="sm-normal" style={styles.disclaimer}>
            Please verify all details before committing to any rental agreement
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RoomDetails;

