import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.lightSecondary,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  backText: {
    color: colors.text.primary,
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.background.light,
  },
  hero: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  verifiedPill: {
    position: 'absolute',
    top: 20,
    right: 28,
    backgroundColor: colors.secondary[500],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  verifiedText: {
    color: colors.common.white,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  sectionTitle: {
    color: colors.text.primary,
  },
  subtleText: {
    color: colors.text.secondary,
  },
  tagChip: {
    backgroundColor: colors.background.neutral,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagChipText: {
    color: colors.text.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactCard: {
    gap: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.common.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  contactPrimary: {
    backgroundColor: colors.secondary[500],
    borderColor: colors.secondary[500],
  },
  contactText: {
    color: colors.text.primary,
  },
  contactTextPrimary: {
    color: colors.common.white,
  },
  reviewItem: {
    gap: 6,
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewTime: {
    color: colors.text.secondary,
  },
  relatedListItem: {
    marginBottom: 12,
  },
  // Review styles
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.secondary[500],
  },
  writeReviewText: {
    color: colors.secondary[500],
  },
  pendingReviewCard: {
    backgroundColor: colors.accent.orangeLight + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.accent.orange + '30',
  },
  pendingReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.accent.orange + '20',
    borderRadius: 6,
  },
  pendingBadgeText: {
    color: colors.accent.orange,
  },
  pendingReviewComment: {
    color: colors.text.primary,
    marginBottom: 12,
  },
  pendingReviewActions: {
    flexDirection: 'row',
    gap: 16,
  },
  editReviewText: {
    color: colors.secondary[500],
  },
  deleteReviewText: {
    color: colors.status.errorDark,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary[100],
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: colors.secondary[500],
  },
  title: {
    fontFamily: 'Outfit-SemiBold',
  }
});

