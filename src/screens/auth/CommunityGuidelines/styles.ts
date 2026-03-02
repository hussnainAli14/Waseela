import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { PP } from '@/utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.lightSecondary,
    paddingHorizontal: PP(24),
    paddingTop: PP(60),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: PP(32),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: PP(24),
  },
  logo: {
    width: PP(80),
    height: PP(80),
    marginBottom: PP(16),
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: PP(32),
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: PP(28),
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Outfit-Regular',
    fontSize: PP(14),
    color: colors.text.secondary,
    opacity: 0.7,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: PP(32),
    gap: PP(20),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: PP(16),
  },
  featureIconContainer: {
    width: PP(48),
    height: PP(48),
    borderRadius: PP(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    gap: PP(4),
  },
  featureTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: PP(16),
    color: colors.text.primary,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Outfit-Regular',
    fontSize: PP(14),
    color: colors.text.secondary,
    opacity: 0.8,
    lineHeight: PP(20),
  },
  noticeContainer: {
    backgroundColor: colors.status.warningLight,
    borderRadius: PP(16),
    padding: PP(16),
    marginBottom: PP(32),
    borderWidth: PP(1),
    borderColor: colors.accent.orangeLight,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PP(8),
    marginBottom: PP(12),
  },
  noticeTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: PP(16),
    color: colors.accent.orangeBrown,
  },
  noticeText: {
    fontFamily: 'Outfit-Regular',
    fontSize: PP(14),
    color: colors.accent.orangeBrown,
    lineHeight: PP(20),
  },
  continueButton: {
    marginBottom: PP(24),
  },
  disclaimerContainer: {
    alignItems: 'center',
    paddingHorizontal: PP(16),
  },
  disclaimerText: {
    fontFamily: 'Outfit-Regular',
    fontSize: PP(12),
    color: colors.text.secondary,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: PP(16),
  },
});

