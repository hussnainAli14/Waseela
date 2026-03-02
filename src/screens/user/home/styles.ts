import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { PP } from '@/utils/responsive';

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
    paddingBottom: PP(32),
  },
  separator: {
    height: PP(12),
  },
  listItemContainer: {
    paddingHorizontal: PP(20),
  },
  headerContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: PP(6),
    paddingBottom: PP(12),
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
    marginTop: PP(12),
    width: '100%',
  },
  section: {
    paddingHorizontal: PP(20),
    paddingTop: PP(20),
  },
  sectionTitle: {
    color: colors.text.primary,
    marginBottom: PP(16),
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
    marginBottom: PP(14),
  },
  exploreCard: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: PP(12),
    borderRadius: PP(18),
    paddingVertical: PP(20),
    marginBottom: 0,
  },
  exploreContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: PP(12),
  },
  exploreIconWrapper: {
    width: PP(44),
    height: PP(44),
    borderRadius: PP(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreLabel: {
    textAlign: 'center',
    color: colors.text.primary,
    fontFamily: 'Outfit-Medium',
  },
  networkCard: {
    marginTop: PP(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkContent: {
    alignItems: 'center',
    gap: PP(12),
  },
  networkIconWrapper: {
    width: PP(54),
    height: PP(54),
  },
  featuredSection: {
    paddingHorizontal: PP(20),
    paddingTop: PP(20),
    gap: PP(14),
  },
});

