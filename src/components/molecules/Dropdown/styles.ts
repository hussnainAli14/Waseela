import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border.light,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    flex: 1,
  },
  dropdownCard: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: 300,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    color: colors.text.primary,
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
  },
});

