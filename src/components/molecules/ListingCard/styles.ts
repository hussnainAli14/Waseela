import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  card: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 14,
  },
  thumbnail: {
    width: 94,
    height: 94,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedIcon: {
    marginLeft: 'auto',
  },
  category: {
    color: colors.text.secondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: colors.text.secondary,
  },
  ctaButton: {
    marginTop: 16,
    backgroundColor: colors.primary[500],
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  ctaText: {
    color: colors.common.white,
  },
  ctaIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.common.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

