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
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: PP(80),
    height: PP(80),
    marginBottom: PP(16),
  },
  logoText: {
    fontFamily: 'Outfit-Bold',
    fontSize: PP(24),
    color: colors.secondary[500],
    letterSpacing: PP(1),
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: PP(32),
  },
  welcomeTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: PP(28),
    color: colors.text.primary,
  },
  welcomeSubtitle: {
    fontFamily: 'Outfit-Regular',
    fontSize: PP(14),
    color: colors.text.secondary,
    opacity: 0.7,
  },
  formContainer: {
    marginBottom: PP(24),
  },
  signInButton: {
    marginBottom: PP(16),
    borderRadius: PP(16),
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: PP(8),
    marginBottom: PP(32),
    paddingVertical: PP(8),
  },
  forgotPasswordText: {
    fontFamily: 'Outfit-Medium',
    fontSize: PP(16),
    color: colors.secondary[500],
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: PP(24),
  },
  dividerLine: {
    flex: 1,
    height: PP(1),
    backgroundColor: colors.neutral[600],
    opacity: 0.1,
  },
  dividerText: {
    fontFamily: 'Outfit-Regular',
    fontSize: PP(14),
    color: colors.text.secondary,
    opacity: 0.7,
    marginHorizontal: PP(16),
  },
  createAccountButton: {
    marginBottom: PP(32),
    borderRadius: PP(16),

  },
  icon: {
    fontSize: PP(20),
    color: colors.text.secondary,
    opacity: 0.5,
  },
});

