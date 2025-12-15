import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.lightSecondary,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: colors.secondary[500],
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.common.white,
    marginBottom: 16,
  },
  profileCard: {
    width: '100%',
    backgroundColor: colors.background.light,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: colors.common.black,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTextBlock: {
    flex: 1,
    gap: 4,
  },
  nameText: {
    color: colors.text.primary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: colors.text.secondary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    alignSelf: 'flex-start',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  editButtonText: {
    color: colors.text.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  primaryActionButton: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary[500],
    flexDirection: 'row',
    gap: 8,
  },
  primaryActionText: {
    color: colors.common.white,
  },
  secondaryActionCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.light,
    gap: 6,
  },
  secondaryActionLabel: {
    color: colors.text.primary,
  },
  networkCard: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 18,
    backgroundColor: colors.primary[700],
    padding: 18,
    gap: 8,
  },
  networkTitle: {
    color: colors.common.white,
  },
  networkSubtitle: {
    color: colors.common.white,
  },
  joinNetworkButton: {
    marginTop: 8,
    backgroundColor: colors.common.white,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinNetworkButtonText: {
    color: colors.primary[700],
  },
  sectionWrapper: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.text.primary,
  },
  sectionBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: colors.background.lightSecondary,
  },
  sectionBadgeText: {
    color: colors.text.secondary,
  },
  listingCard: {
    borderRadius: 16,
    backgroundColor: colors.background.light,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: colors.common.black,
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  listingImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.background.lightSecondary,
  },
  listingInfo: {
    flex: 1,
    gap: 4,
  },
  listingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listingTitle: {
    color: colors.text.primary,
  },
  listingSubtitle: {
    color: colors.text.secondary,
  },
  listingStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  statusPillApproved: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.status.successLight,
  },
  statusPillPending: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.status.warningLight,
  },
  statusPillTextApproved: {
    color: colors.status.success,
  },
  statusPillTextPending: {
    color: colors.status.warning,
  },
  listingMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoutButtonWrapper: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  logoutButton: {
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.status.errorLight ?? colors.background.light,
    borderWidth: 1,
    borderColor: colors.status.errorLight ?? colors.status.error,
    flexDirection: 'row',
    gap: 8,
  },
  logoutText: {
    color: colors.status.error ?? colors.accent.orange,
  },
  listingActionText: {
    color: colors.text.primary,
  },
});


