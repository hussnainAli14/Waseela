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
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 28,
    color: colors.secondary[500],
  },
  subtitle: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 24,
  },
  sendButton: {
    marginBottom: 24,
  },
  backContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 32,
  },
  backIcon: {
    marginRight: 8,
  },
  backText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    opacity: 0.7,
  },
  icon: {
    fontSize: 20,
    color: colors.text.secondary,
    opacity: 0.5,
  },
});

