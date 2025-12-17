import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background.light,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
  },
  tabInnerActive: {
    backgroundColor: colors.secondary[50],
  },
  tabLabel: {
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 6,
  },
  tabLabelActive: {
    color: colors.secondary[500],
  },
});


