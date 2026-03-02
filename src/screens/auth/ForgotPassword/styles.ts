import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { PP } from '@/utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.lightSecondary,
  },
  header: {
    paddingHorizontal: PP(24),
    paddingTop: PP(16),
    paddingBottom: PP(8),
  },
  backButton: {
    width: PP(40),
    height: PP(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: PP(24),
    paddingTop: PP(20),
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
    letterSpacing: 1,
  },
  titleContainer: {
    marginBottom: PP(16),
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: PP(28),
    color: colors.secondary[500],
  },
  subtitle: {
    fontFamily: 'Outfit-Regular',
    fontSize: PP(14),
    color: colors.text.secondary,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: PP(16),
    lineHeight: PP(20),
  },
  formContainer: {
    marginBottom: PP(24),
  },
  sendButton: {
    marginBottom: PP(24),
  },
  backContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: PP(32),
  },
  backIcon: {
    marginRight: PP(8),
  },
  backText: {
    fontFamily: 'Outfit-Regular',
    fontSize: PP(14),
    color: colors.text.secondary,
    opacity: 0.7,
  },
  icon: {
    fontSize: PP(20),
    color: colors.text.secondary,
    opacity: 0.5,
  },
});

