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
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  logoText: {
    fontFamily: 'Outfit-Bold',
    fontSize: 24,
    color: colors.secondary[500],
    letterSpacing: 1,
  },
  titleContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 28,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    opacity: 0.7,
  },
  dataProtectionCard: {
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#EEF5FF',
    borderWidth: 1,
    borderColor: '#C7D8FF',
  },
  dataProtectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  dataProtectionIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.common.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataProtectionIcon: {
    color: colors.primary[500],
  },
  dataProtectionTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 15,
    color: colors.primary[500],
  },
  dataProtectionText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 13,
    color: colors.primary[500],
    lineHeight: 18,
    marginBottom: 8,
  },
  dataProtectionLink: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 13,
    color: colors.primary[500],
    textDecorationLine: 'underline',
  },
  formContainer: {
    marginBottom: 24,
  },
  agreementsSection: {
    marginBottom: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  agreementsTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 12,
  },
  checkboxGroup: {
    gap: 12,
    marginBottom: 8,
  },
  agreementsError: {
    fontFamily: 'Outfit-Regular',
    fontSize: 13,
    color: colors.status.error,
    marginBottom: 12,
  },
  optionalTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14,
    color: colors.text.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  signUpButton: {
    marginBottom: 16,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  signInText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    opacity: 0.7,
    marginRight: 4,
  },
  signInLink: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14,
    color: colors.secondary[500],
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  disclaimerIcon: {
    color: colors.text.secondary,
  },
  disclaimerText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 13,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
  legalDisclaimerCard: {
    backgroundColor: colors.status.warningLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.status.warning,
    marginBottom: 24,
  },
  legalDisclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  legalDisclaimerIcon: {
    color: colors.status.warning,
  },
  legalDisclaimerTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 15,
    color: colors.common.black,
  },
  legalSectionTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14,
    color: colors.common.black,
    marginTop: 12,
    marginBottom: 4,
  },
  legalDisclaimerText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 13,
    color: colors.common.black,
    lineHeight: 18,
  },
  legalDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: 12,
  },
  verificationCard: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.background.success,
    borderWidth: 1,
    borderColor: colors.status.success,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  verificationIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.common.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationIcon: {
    color: colors.status.success,
  },
  verificationTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14,
    color: colors.common.black,
  },
  verificationText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 13,
    color: colors.common.black,
    lineHeight: 18,
  },
  icon: {
    fontSize: 20,
    color: colors.common.black
  },
});

