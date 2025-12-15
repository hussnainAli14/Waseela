import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.lightSecondary,
  },
  fixedHeader: {
    backgroundColor: colors.accent.purple,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    gap: 16,
    zIndex: 3,
  },
  headerTitle: {
    color: colors.common.white,
    textAlign: 'center',
  },
  searchBlock: {
    gap: 12,
  },
  sellButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.common.white,
    borderRadius: 16,
    paddingVertical: 10,
    gap: 8,
  },
  sellButtonText: {
    color: colors.accent.purple,
  },
  categoryBar: {
    backgroundColor: colors.background.lightSecondary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    zIndex: 2,
  },
  categoryList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  categoryChipActive: {
    backgroundColor: colors.accent.purple,
    borderColor: colors.accent.purple,
  },
  categoryChipLabel: {
    color: colors.text.primary,
  },
  categoryChipLabelActive: {
    color: colors.common.white,
  },
  showSoldButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.background.lightSecondary,
    borderWidth: 1,
    borderColor: colors.accent.purple,
  },
  showSoldText: {
    color: colors.accent.purple,
  },
  showSoldButtonActive: {
    backgroundColor: colors.accent.purpleBlue,
    borderColor: colors.accent.purpleBlue,
  },
  listArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text.primary,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  gridSeparator: {
    height: 16,
  },
  itemCard: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  itemImageWrapper: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 170,
    borderRadius: 20,
  },
  conditionPill: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  conditionGood: {
    backgroundColor: colors.background.lightSecondary,
  },
  conditionLikeNew: {
    backgroundColor: colors.accent.blueLight,
  },
  conditionNew: {
    backgroundColor: colors.accent.tealBackground,
  },
  conditionText: {
    color: colors.text.primary,
  },
  itemContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  priceText: {
    color: colors.accent.purple,
  },
  itemTitle: {
    color: colors.text.primary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: colors.text.secondary,
  },
  listContent: {
    paddingBottom: 24,
  },
});


