import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from '@/components/molecules';
import { Image, Text } from '@/components/atoms';
import { colors } from '@/theme';
import { styles } from './styles';
import { ListingCardProps } from './types';

const ListingCard: React.FC<ListingCardProps> = ({
  title,
  category,
  location,
  rating,
  reviews,
  verified = false,
  imageUri,
  variant = 'default',
  ctaLabel = 'Contact',
  onPress,
  onPressCta,
}) => {
  return (
    <Card
      style={styles.card}
      backgroundColor={colors.background.light}
      padding={14}
      onPress={onPress}>
      <View style={styles.headerRow}>
        <Image
          source={{ uri: imageUri }}
          containerStyle={styles.thumbnail}
          borderRadius={12}
        />
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text variant="lg-semibold" style={styles.title}>{title}</Text>
            {verified && (
              <MaterialCommunityIcons
                name="check-decagram-outline"
                size={20}
                color={colors.secondary[500]}
                style={styles.verifiedIcon}
              />
            )}
          </View>
          <Text variant="md-normal" style={styles.category}>
            {category}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.text.secondary}
              />
              <Text variant="md-medium" style={styles.metaText}>
                {location}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={16} color={colors.accent.orange} />
              <Text variant="md-medium" style={styles.metaText}>
                {rating}{' '}
                <Text variant="md-medium" style={styles.metaText}>
                  ({reviews})
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>

      {variant === 'cta' && (
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={onPressCta}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color={colors.common.white}
            />
          <Text variant="lg-semibold" style={styles.ctaText}>
            {ctaLabel}
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

export default ListingCard;

