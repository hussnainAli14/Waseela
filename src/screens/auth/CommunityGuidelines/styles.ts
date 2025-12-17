import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.lightSecondary,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 28,
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    opacity: 0.7,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 32,
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    opacity: 0.8,
    lineHeight: 20,
  },
  noticeContainer: {
    backgroundColor: colors.status.warningLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.accent.orangeLight,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  noticeTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16,
    color: colors.accent.orangeBrown,
  },
  noticeText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.accent.orangeBrown,
    lineHeight: 20,
  },
  continueButton: {
    marginBottom: 24,
  },
  disclaimerContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  disclaimerText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: colors.text.secondary,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 16,
  },
});

