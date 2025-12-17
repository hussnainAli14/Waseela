import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.common.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: colors.text.primary,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  dropdownCard: {
    position: 'absolute',
    backgroundColor: colors.common.white,
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: '60%',
  },
  optionList: {
    paddingVertical: 4,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    color: colors.text.primary,
  },
  optionTextActive: {
    color: colors.text.primary,
  },
  optionSeparator: {
    height: 1,
    backgroundColor: colors.border.light,
  },
});

