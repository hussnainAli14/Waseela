import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.lightSecondary,
  },
  header: {
    backgroundColor: colors.accent.purple,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: colors.common.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: colors.common.white,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.text.secondary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
  professionalCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.background.light,
    shadowColor: colors.common.black,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  cardHeaderText: {
    flex: 1,
    gap: 2,
  },
  nameText: {
    color: colors.text.primary,
  },
  titleText: {
    color: colors.text.secondary,
  },
  companyText: {
    color: colors.text.secondary,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 8,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  tagChipText: {
    color: colors.text.primary,
  },
  tagChipPrimary: {
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  tagChipSecondary: {
    backgroundColor: colors.primary[50],
  },
  tagChipPrimaryText: {
    color: colors.text.primary,
  },
  tagChipSecondaryText: {
    color: colors.primary[700],
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.text.secondary,
  },
  statusRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPillApproved: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.status.success + '20',
    alignSelf: 'flex-start',
  },
  statusPillPending: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.status.warning + '20',
    alignSelf: 'flex-start',
  },
  statusPillTextApproved: {
    color: colors.status.success,
  },
  statusPillTextPending: {
    color: colors.status.warning,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 10,
    color: colors.text.primary,
  },
  emptySubtitle: {
    marginTop: 5,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.purple,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 8,
  },
  joinButtonText: {
    color: colors.common.white,
  },
});
