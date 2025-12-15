import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary[500],
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    gap: 8,
  },
});

