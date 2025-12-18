import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  dashboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: colors.common.black,
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  dashboardCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardCardContent: {
    flex: 1,
    gap: 4,
  },
  dashboardCardTitle: {
    color: colors.text.primary,
    fontFamily: 'Outfit-SemiBold',
  },
  dashboardCardSubtitle: {
    color: colors.text.secondary,
    fontFamily: 'Outfit-Medium',
  },
  dashboardCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listingsContainer: {
    marginTop: -4,
    marginBottom: 8,
    paddingLeft: 8,
  },
  listingSeparator: {
    height: 10,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.secondary,
  },
});

