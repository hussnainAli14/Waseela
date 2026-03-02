import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.lightSecondary,
  },
  header: {
    backgroundColor: colors.accent.orange,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    gap: 16,
  },
  headerTitle: {
    color: colors.common.white,
    textAlign: 'center',
  },
  searchBlock: {
    gap: 12,
    zIndex: 1000, // Ensure dropdown container has proper z-index
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.common.white,
    borderRadius: 18,
    paddingVertical: 10,
    gap: 8,
  },
  postButtonText: {
    color: colors.accent.orange,
    fontFamily: 'Outfit-Medium',
  },
  filtersSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 16,
  },
  filterBlock: {
    gap: 8,
  },
  filterLabel: {
    color: colors.text.primary,
  },
  cityDropdown: {
    backgroundColor: colors.background.light,
  },
  rentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rentChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  rentChipActive: {
    backgroundColor: colors.accent.orange,
    borderColor: colors.accent.orange,
  },
  rentChipText: {
    color: colors.text.primary,
  },
  rentChipTextActive: {
    color: colors.common.white,
  },
  roomTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  typeChipActive: {
    backgroundColor: colors.accent.orange,
    borderColor: colors.accent.orange,
  },
  typeChipText: {
    color: colors.text.primary,
  },
  typeChipTextActive: {
    color: colors.common.white,
  },
  resultsText: {
    color: colors.text.secondary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 12,
  },
  listSeparator: {
    height: 12,
  },
  roomCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  roomCardContent: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  roomImage: {
    width: 100,
    height: 100,
  },
  roomInfo: {
    flex: 1,
    gap: 6,
  },
  roomTitle: {
    color: colors.text.primary,
    fontFamily: 'Outfit-SemiBold',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: colors.background.lightSecondary,
  },
  badgeText: {
    color: colors.text.primary,
  },
  billsBadge: {
    backgroundColor: colors.status.successLight,
  },
  billsBadgeText: {
    color: colors.status.success,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    color: colors.accent.orange,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: colors.text.secondary,
  },
  subLocationText: {
    color: colors.text.secondary,
    fontFamily: 'Outfit-Medium',
  },
});


