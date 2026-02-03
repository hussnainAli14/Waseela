import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: colors.common.black,
    marginBottom: 8,
  },
  labelError: {
    color: colors.status.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.common.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  inputContainerFocused: {
    borderColor: colors.secondary[500],
  },
  inputContainerError: {
    borderColor: colors.status.error,
  },
  inputContainerSmall: {
    height: 44,
    paddingHorizontal: 12,
  },
  inputContainerMedium: {
    height: 48,
    paddingHorizontal: 16,
  },
  inputContainerLarge: {
    height: 52,
    paddingHorizontal: 20,
  },
  leftIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.text.primary,
    padding: 0,
  },
  inputSmall: {
    fontSize: 12,
  },
  inputMedium: {
    fontSize: 14,
  },
  inputLarge: {
    fontSize: 16,
  },
  rightIconContainer: {
    marginLeft: 12,
  },
  errorText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: colors.status.error,
    marginTop: 4,
  },
});

