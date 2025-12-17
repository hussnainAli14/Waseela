import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border.medium,
    backgroundColor: colors.common.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxSmall: {
    width: 18,
    height: 18,
    borderRadius: 3,
  },
  checkboxLarge: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  checkboxChecked: {
    backgroundColor: colors.secondary[500],
    borderColor: colors.secondary[500],
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  label: {
    flex: 1,
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  labelDisabled: {
    opacity: 0.5,
  },
});

