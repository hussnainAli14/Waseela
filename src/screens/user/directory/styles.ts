import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.lightSecondary,
  },
  fixedHeader: {
    backgroundColor: colors.secondary[500],
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    gap: 14,
    zIndex: 3,
  },
  headerTitle: {
    color: colors.common.white,
    textAlign: 'center',
  },
  searchBlock: {
    gap: 12,
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.common.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  citySelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  citySelectorText: {
    color: colors.text.primary,
  },
  categoryBar: {
    backgroundColor: colors.background.lightSecondary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    zIndex: 2,
  },
  categoryList: {
    gap: 12,
    paddingRight: 8,
    paddingBottom: 8,
  },
  categoryCard: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.light,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 16,
    backgroundColor: colors.background.lightSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCardActive: {
    backgroundColor: colors.secondary[50],
    borderColor: colors.secondary[500],
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontFamily: 'Outfit-SemiBold',
  },
  listItem: {
    width: '100%',
  },
  separator: {
    height: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
});

