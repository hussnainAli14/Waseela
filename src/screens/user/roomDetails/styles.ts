import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    paddingRight: 8,
    paddingVertical: 4,
  },
  headerTitle: {
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 30,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  billsBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary[500],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  billsBadgeText: {
    color: colors.common.white,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleLeft: {
    flex: 1,
    gap: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent.orange,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  typeBadgeText: {
    color: colors.common.white,
  },
  roomTitle: {
    color: colors.text.primary,
    flex: 1,
  },
  priceColumn: {
    alignItems: 'flex-end',
    gap: 2,
  },
  priceText: {
    color: colors.accent.orange,
  },
  priceSubtext: {
    color: colors.text.secondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: colors.text.secondary,
  },
  proximityBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary[50],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 4,
  },
  proximityBadgeText: {
    color: colors.primary[500],
  },
  sectionTitle: {
    color: colors.text.primary,
    marginBottom: 4,
  },
  bodyText: {
    color: colors.text.secondary,
    lineHeight: 22,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  amenityTag: {
    backgroundColor: colors.background.lightSecondary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  amenityText: {
    color: colors.text.primary,
  },
  billsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  billsTextContainer: {
    flex: 1,
    gap: 4,
  },
  postedByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent.orangeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postedByInfo: {
    flex: 1,
    gap: 2,
  },
  landlordName: {
    color: colors.text.primary,
  },
  postedDate: {
    color: colors.text.secondary,
  },
  contactButton: {
    marginTop: 8,
    backgroundColor: colors.accent.orange,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  contactButtonText: {
    color: colors.common.white,
  },
  disclaimer: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
  },
});

