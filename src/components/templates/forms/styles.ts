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
  fieldGroup: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  label: {
    marginBottom: 10,
    color: colors.text.primary,
    fontFamily: 'Outfit-Medium',
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
  toggleButtonActive: {
    backgroundColor: colors.secondary[50],
    borderColor: colors.secondary[200],
  },
  toggleButtonSpacing: {
    marginRight: 10,
  },
  toggleText: {
    color: colors.text.secondary,
  },
  toggleTextActive: {
    color: colors.secondary[500],
  },
  inputSpacing: {
    marginBottom: 12,
  },
  helperText: {
    color: colors.text.secondary,
  },
  dropdownButton: {
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    paddingVertical: 14,
  },
  dropdownText: {
    color: colors.text.primary,
  },
  labelSpacing: {
    marginBottom: 6,
    marginTop: 4,
    color: colors.text.primary,
    fontFamily: 'Outfit-Medium',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    backgroundColor: colors.background.light,
    color: colors.text.primary,
  },
  tagInputSpacing: {
    marginRight: 10,
  },
  addButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: colors.border.light,
    minWidth: 72,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.text.primary,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    marginHorizontal: -4,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.secondary[50],
    borderWidth: 1,
    borderColor: colors.secondary[200],
    marginHorizontal: 4,
    marginTop: 8,
  },
  tagText: {
    color: colors.text.primary,
  },
  tagIcon: {
    marginLeft: 8,
  },
  uploadCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border.light,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: colors.background.light,
    paddingHorizontal: 16,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  fileName: {
    color: colors.text.primary,
    fontFamily: 'Outfit-Medium',
  },
  uploadTitle: {
    color: colors.text.primary,
    fontFamily: 'Outfit-Semibold',
  },
  uploadSubtitle: {
    color: colors.text.secondary,
    fontFamily: 'Outfit-Regular',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  checkboxText: {
    flex: 1,
    color: colors.text.primary,
    marginLeft: 10,
  },
  submitButton: {
    marginHorizontal: 4,
    marginTop: 4,
    marginBottom: 8,
  },
  reviewNote: {
    textAlign: 'center',
    color: colors.text.secondary,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.light,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.common.white,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.common.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changeImageText: {
    color: colors.primary[600],
    fontFamily: 'Outfit-Medium',
  },
});


