import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.lightSecondary,
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
  },
  heroImage: {
    width: '100%',
    height: 220,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  priceText: {
    color: colors.accent.purple,
  },
  itemTitle: {
    color: colors.text.primary,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  badgeCondition: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  badgeCategory: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: colors.accent.tealBackground,
  },
  badgeText: {
    color: colors.text.secondary,
  },
  badgeCategoryText: {
    color: colors.secondary[500],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactDetails: {
    gap: 8,
    marginBottom: 16,
  },
  metaText: {
    color: colors.text.secondary,
  },
  sectionTitle: {
    color: colors.text.primary,
  },
  bodyText: {
    color: colors.text.secondary,
  },
  tipsCard: {
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.primary[200],
    gap: 6,
  },
  tipsTitle: {
    color: colors.primary[500],
  },
  tipList: {
    gap: 4,
  },
  tipText: {
    color: colors.primary[500],
  },
  contactButton: {
    marginTop: 8,
    backgroundColor: colors.accent.purple,
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
});


