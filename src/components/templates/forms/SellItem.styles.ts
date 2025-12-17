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
    // paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionLabel: {
    marginBottom: 12,
    color: colors.text.primary,
    fontFamily: 'Outfit-Medium',
  },
  uploadCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border.light,
    borderRadius: 16,
    paddingVertical: 28,
    // paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: colors.background.light,
  },
  uploadTitle: {
    color: colors.text.primary,
    marginTop: 12,
    marginBottom: 6,
  },
  uploadSubtitle: {
    color: colors.text.secondary,
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
  dropdownLabel: {
    marginBottom: 8,
    color: colors.text.primary,
    fontFamily: 'Outfit-Medium',
  },
  dropdownButton: {
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  dropdownText: {
    color: colors.text.primary,
  },
  descriptionInput: {
    textAlignVertical: 'top',
    height: 120,
  },
  guidelinesCard: {
    backgroundColor: 'rgba(172, 83, 255, 0.08)',
    borderColor: colors.accent.purple,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  guidelinesTitle: {
    marginBottom: 8,
    color: colors.accent.purple,
  },
  guidelineItem: {
    color: colors.accent.purple,
    marginBottom: 6,
  },
  buttonSpacing: {
    marginTop: 6,
  },
  postButton: {
    backgroundColor: colors.accent.purple,
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  descriptionInputContainer: {
    backgroundColor: colors.background.lightSecondary,
    borderColor: colors.border.light,
    height: 120,
    paddingTop: 12,
  },
});


