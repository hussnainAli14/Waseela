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
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 28,
    color: colors.text.primary,
  },
  welcomeSubtitle: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    opacity: 0.7,
  },
  formContainer: {
    marginBottom: 24,
  },
  signInButton: {
    marginBottom: 16,
    borderRadius: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: colors.secondary[500],
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral[600],
    opacity: 0.1,
  },
  dividerText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    opacity: 0.7,
    marginHorizontal: 16,
  },
  createAccountButton: {
    marginBottom: 32,
    borderRadius: 16,

  },
  icon: {
    fontSize: 20,
    color: colors.text.secondary,
    opacity: 0.5,
  },
});

