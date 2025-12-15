import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonSmall: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  buttonMedium: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    minHeight: 48,
  },
  buttonLarge: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 52,
  },
  buttonPrimary: {
    backgroundColor: colors.secondary[500],
  },
  buttonSecondary: {
    backgroundColor: colors.primary[500],
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.secondary[500],
  },
  buttonText: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontFamily: 'Outfit-SemiBold',
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 18,
  },
  textPrimary: {
    color: colors.common.white,
  },
  textSecondary: {
    color: colors.common.white,
  },
  textOutline: {
    color: colors.secondary[500],
  },
  textText: {
    color: colors.secondary[500],
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

