import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    color: colors.text.primary,
    marginLeft: 12,
  },
  card: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
  },
  label: {
    marginBottom: 10,
    color: colors.text.primary,
    fontFamily: 'Outfit-Medium',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  uploadCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border.medium,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
  uploadTitle: {
    color: colors.text.primary,
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  uploadSubtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  photoPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  photoThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.background.dark,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkboxLabel: {
    marginLeft: 10,
    color: colors.text.primary,
    flex: 1,
  },
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  amenityPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.lightSecondary,
  },
  amenityPillActive: {
    backgroundColor: colors.secondary[50],
    borderColor: colors.secondary[200],
  },
  amenityText: {
    color: colors.text.primary,
    fontFamily: 'Outfit-Medium',
  },
  addAmenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  addAmenityInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.lightSecondary,
    color: colors.text.primary,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  addButtonText: {
    color: colors.text.primary,
    fontFamily: 'Outfit-Medium',
  },
  infoText: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginTop: 10,
  },
  postButton: {
    backgroundColor: colors.accent.orange,
    marginTop: 8,
  },
  dropdownButton: {
    backgroundColor: colors.background.lightSecondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  dropdownText: {
    color: colors.text.primary,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.lightSecondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  datePickerText: {
    color: colors.text.primary,
    fontFamily: 'Outfit-Regular',
  },
  datePickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerModalContent: {
    backgroundColor: colors.common.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  datePickerTitle: {
    color: colors.text.primary,
    fontFamily: 'Outfit-SemiBold',
  },
  datePickerCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  datePickerCancelText: {
    color: colors.text.secondary,
    fontFamily: 'Outfit-Medium',
  },
  datePickerDoneButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  datePickerDoneText: {
    color: colors.primary[500],
    fontFamily: 'Outfit-Medium',
  },
});


