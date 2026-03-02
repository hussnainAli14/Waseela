import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { PP } from '@/utils/responsive';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.common.transparent,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.background.light,
    paddingVertical: PP(10),
    paddingHorizontal: PP(6),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  tabInner: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: PP(18),
    paddingVertical: PP(10),
  },
  tabInnerActive: {
    backgroundColor: colors.secondary[50],
    borderRadius: 16,
    // minWidth: 112,
  },
  tabLabel: {
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
    color: colors.text.secondary,
  },
  tabLabelActive: {
    color: colors.secondary[500],
  },
});

