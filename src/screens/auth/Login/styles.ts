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
    color: colors.secondary[500],
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: colors.accent.orangeBrown,
  },
  signInButton: {
    marginBottom: 24,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 32,
  },
  signUpText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    opacity: 0.7,
    marginRight: 4,
  },
  signUpLink: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14,
    color: colors.secondary[500],
  },
  icon: {
    fontSize: 20,
    color: colors.text.secondary,
    opacity: 0.5,
  },
});

