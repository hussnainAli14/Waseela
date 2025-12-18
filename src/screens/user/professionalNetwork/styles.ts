import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  header: {
    backgroundColor: colors.accent.blueDark,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    gap: 12,
  },
  headerTitle: {
    color: colors.common.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: colors.common.white,
    textAlign: 'center',
  },
  searchBlock: {
    gap: 12,
  },
  searchBar: {
    backgroundColor: colors.common.white,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.common.white,
    borderRadius: 18,
    paddingVertical: 10,
    gap: 8,
  },
  joinButtonText: {
    color: colors.accent.blueDark,
    fontFamily: 'Outfit-Medium',
  },
  filtersSection: {
    paddingTop: 20,
    paddingBottom: 12,
    gap: 16,
    backgroundColor: colors.common.white,
  },
  filterBlock: {
    gap: 8,
  },
  filterLabel: {
    color: colors.text.primary,
  },
  dropdownButton: {
    backgroundColor: colors.background.light,
  },
  mentorToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.background.light,
  },
  mentorToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mentorIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.lightSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleSubtitle: {
    color: colors.text.secondary,
  },
  resultsText: {
    color: colors.text.secondary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  separator: {
    height: 4,
  },
  professionalCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.background.light,
    shadowColor: colors.common.black,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  cardHeaderText: {
    flex: 1,
    gap: 2,
  },
  nameText: {
    color: colors.text.primary,
  },
  titleText: {
    color: colors.text.secondary,
  },
  companyText: {
    color: colors.text.secondary,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  tagChipText: {
    color: colors.text.primary,
  },
  tagChipPrimary: {
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  tagChipSecondary: {
    backgroundColor: colors.primary[50],
  },
  tagChipPrimaryText: {
    color: colors.text.primary,
  },
  tagChipSecondaryText: {
    color: colors.primary[700],
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.text.secondary,
  },
});


