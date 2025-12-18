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
  hero: {
    backgroundColor: colors.primary[700],
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  nameText: {
    color: colors.common.white,
    marginBottom: 4,
  },
  titleText: {
    color: colors.common.white,
  },
  companyText: {
    color: colors.common.white,
    marginTop: 4,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.primary[500],
  },
  tagBadgeText: {
    color: colors.common.white,
  },
  statsCardWrapper: {
    paddingHorizontal: 16,
    marginTop: -24,
  },
  statsCard: {
    backgroundColor: colors.background.light,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: colors.common.black,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsLabel: {
    color: colors.text.secondary,
    marginBottom: 4,
  },
  statsValue: {
    color: colors.text.primary,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 8,
  },
  sectionTitle: {
    color: colors.text.primary,
  },
  bodyText: {
    color: colors.text.secondary,
    lineHeight: 22,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E0E7FF',
  },
  chipText: {
    color: colors.primary[700],
  },
  helpCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helpIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpTitle: {
    color: colors.primary[500],
  },
  helpBodyText: {
    color: colors.primary[500],
    lineHeight: 22,
  },
  emailButton: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.accent.purple,
    marginBottom: 12,
  },
  emailButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emailButtonText: {
    color: colors.common.white,
  },
  linkButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent.purple,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.common.white,
  },
  linkButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  linkButtonText: {
    color: colors.accent.purple,
  },
  noteText: {
    color: colors.text.secondary,
    marginTop: 8,
  },
  noteLabel: {
    color: colors.text.primary,
  },
});


