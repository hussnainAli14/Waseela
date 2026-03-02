import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { PP } from '@/utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.lightSecondary,
  },
  fixedHeader: {
    backgroundColor: colors.secondary[500],
    paddingHorizontal: PP(16),
    paddingTop: PP(24),
    paddingBottom: PP(16),
    borderBottomLeftRadius: PP(20),
    borderBottomRightRadius: PP(20),
    gap: PP(14),
    zIndex: 3,
  },
  headerTitle: {
    color: colors.common.white,
    textAlign: 'center',
  },
  searchBlock: {
    gap: PP(12),
    zIndex: 1000, // Ensure dropdown container has proper z-index
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.common.white,
    borderRadius: PP(14),
    paddingHorizontal: PP(14),
    paddingVertical: PP(12),
  },
  citySelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PP(8),
  },
  citySelectorText: {
    color: colors.text.primary,
  },
  categoryBar: {
    backgroundColor: colors.background.lightSecondary,
    paddingHorizontal: PP(16),
    paddingTop: PP(12),
    paddingBottom: PP(16),
    zIndex: 2,
  },
  categoryList: {
    gap: PP(12),
    paddingRight: PP(8),
    paddingBottom: PP(8),
  },
  categoryCard: {
    width: PP(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.light,
    borderRadius: PP(18),
    paddingVertical: PP(4),
    paddingHorizontal: PP(10),
    gap: PP(10),
    borderWidth: PP(1),
    borderColor: colors.border.light,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: PP(2) },
    shadowOpacity: 0.05,
    shadowRadius: PP(6),
    elevation: 2,
  },
  categoryCardActive: {
    backgroundColor: colors.secondary[50],
    borderColor: colors.secondary[500],
  },
  categoryIconWrapper: {
    width: PP(48),
    height: PP(48),
    borderRadius: PP(16),
    backgroundColor: colors.background.lightSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconWrapperActive: {
    backgroundColor: colors.secondary[50],
  },
  categoryLabel: {
    color: colors.text.primary,
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: colors.secondary[500],
  },
  listArea: {
    flex: 1,
    paddingHorizontal: PP(16),
    paddingTop: PP(8),
  },
  sectionHeader: {
    marginBottom: PP(12),
  },
  sectionTitle: {
    color: colors.text.primary,
    fontFamily: 'Outfit-SemiBold',
  },
  listItem: {
    width: '100%',
  },
  separator: {
    height: PP(12),
  },
  listContent: {
    paddingBottom: PP(24),
  },
});

