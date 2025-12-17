import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.lightSecondary,
  },
  fixedHeader: {
    zIndex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  separator: {
    height: 12,
  },
  listItemContainer: {
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: 12,
  },
  headerTitle: {
    color: colors.common.white,
    fontFamily: 'Outfit-Bold',
  },
  headerSubtitle: {
    color: colors.common.white,
    opacity: 0.9,
  },
  searchWrapper: {
    marginTop: 12,
    width: '100%',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    color: colors.text.primary,
    marginBottom: 16,
    fontFamily: 'Outfit-Bold',
  },
  exploreGrid: {
    display: 'none',
  },
  exploreListContent: {
    paddingBottom: 0,
  },
  exploreRow: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  exploreCard: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 18,
    paddingVertical: 20,
    marginBottom: 0,
  },
  exploreContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  exploreIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreLabel: {
    textAlign: 'center',
    color: colors.text.primary,
    fontFamily: 'Outfit-Medium',
  },
  networkCard: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkContent: {
    alignItems: 'center',
    gap: 12,
  },
  networkIconWrapper: {
    width: 64,
    height: 64,
  },
  featuredSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 14,
  },
});

