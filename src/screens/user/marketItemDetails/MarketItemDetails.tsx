import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Text, Image } from '@/components/atoms';
import { colors } from '@/theme';
import { styles } from './styles';
import { MainStackParamList, MarketItem } from '@/navigation/types';

type MarketDetailsRoute = RouteProp<MainStackParamList, 'MarketItemDetails'>;

const MarketItemDetails = () => {
  const navigation = useNavigation();
  const { params } = useRoute<MarketDetailsRoute>();
  const item = params.item as MarketItem & { description?: string };
  const [isFlagged, setIsFlagged] = useState(false);

  const goBack = () => navigation.goBack();

  const handleContactPress = async () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in your listing "${item.title}" on Waseela.`,
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
            Item Details
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsFlagged(prev => !prev)}>
            <Ionicons
              name={isFlagged ? 'flag' : 'flag-outline'}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: item.image }}
          resizeMode="cover"
          containerStyle={styles.heroImage}
          borderRadius={0}
        />

        <View style={styles.section}>
          <Text variant="xl-bold" style={styles.priceText}>
            {item.price}
          </Text>
          <Text variant="lg-semibold" style={styles.itemTitle}>
            {item.title}
          </Text>
          <View style={styles.badgeRow}>
            <View style={styles.badgeCondition}>
              <Text variant="sm-medium" style={styles.badgeText}>
                {item.condition} Condition
              </Text>
            </View>
            <View style={styles.badgeCategory}>
              <Text variant="sm-medium" style={styles.badgeCategoryText}>
                {item.category || 'Toys'}
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
              {item.location}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
            <Text variant="md-normal" style={styles.metaText}>
              {item.postedAt ?? 'Posted 1 week ago'}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="person-outline" size={16} color={colors.text.secondary} />
            <Text variant="md-normal" style={styles.metaText}>
              Seller: {item.sellerName ?? 'Zahra M.'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg-bold" style={styles.sectionTitle}>
            Description
          </Text>
          <Text variant="md-normal" style={styles.bodyText}>
            {item.description ??
              'Bundle of toys and educational games in great condition. Suitable for children aged 3–8. All clean and in full working order.'}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.tipsCard}>
            <Text variant="md-medium" style={styles.tipsTitle}>
              Safety Tips
            </Text>
            <View style={styles.tipList}>
              {(item.safetyTips ?? [
                'Meet in a public place',
                'Check the item before paying',
                'Never share sensitive information',
              ]).map(tip => (
                <Text key={tip} variant="md-normal" style={styles.tipText}>
                  • {tip}
                </Text>
              ))}
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
              Contact Seller
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MarketItemDetails;


