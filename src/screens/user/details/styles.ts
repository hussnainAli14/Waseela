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
  title:{
    fontFamily: 'Outfit-SemiBold',
  }
});

