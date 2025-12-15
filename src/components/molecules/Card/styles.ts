import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.light,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
});

