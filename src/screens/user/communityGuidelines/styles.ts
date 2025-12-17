import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.lightSecondary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },
  heroCard: {
    backgroundColor: '#02a97b',
    borderRadius: 16,
    padding: 16,
  },
  heroTitle: {
    color: colors.common.white,
    marginBottom: 8,
  },
  heroBody: {
    color: colors.common.white,
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eef2f7',
    gap: 12,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitleBlock: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    color: colors.text.primary,
  },
  sectionSubtitle: {
    color: colors.text.secondary,
  },
  bulletList: {
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletText: {
    flex: 1,
    color: colors.text.primary,
    lineHeight: 20,
  },
  noteBox: {
    backgroundColor: '#e6f7f0',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#c3e8d6',
  },
  noteText: {
    color: colors.text.primary,
  },
  warningBox: {
    backgroundColor: '#ffecec',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffd5d5',
    gap: 8,
  },
  warningTitle: {
    color: colors.status.error,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  warningText: {
    flex: 1,
    color: colors.text.primary,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#eef3ff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d6e1ff',
    gap: 6,
  },
  infoTitle: {
    color: colors.text.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    color: colors.text.primary,
    lineHeight: 20,
  },
  commitmentCard: {
    backgroundColor: '#06b48a',
    borderRadius: 18,
    padding: 20,
    gap: 10,
  },
  commitmentTitle: {
    color: colors.common.white,
  },
  commitmentText: {
    color: colors.common.white,
    lineHeight: 20,
  },
  commitmentTextStrong: {
    color: colors.common.white,
  },
  ctaButton: {
    marginTop: 12,
    backgroundColor: '#06b48a',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: {
    color: colors.common.white,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.common.white,
  },
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  bottomNavLabel: {
    color: colors.text.secondary,
  },
  bottomNavLabelActive: {
    color: colors.secondary[600],
  },
});

