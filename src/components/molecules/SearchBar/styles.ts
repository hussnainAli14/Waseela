import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: 10,
  },
  containerFocused: {
    borderColor: colors.secondary[500],
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  defaultIcon: {
    opacity: 0.6,
  },
  iconButton: {
    paddingLeft: 8,
  },
});

