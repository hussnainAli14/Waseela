/**
 * ReportModal Component
 * Modal for reporting listings or users with predefined categories
 */

import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { colors } from '@/theme';
import type { ReportFormData, ReportCategory } from '@/services/firestore/reports';
import { REPORT_CATEGORIES } from '@/services/firestore/reports';

interface ReportModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: ReportFormData) => Promise<void>;
    targetName: string;
    reportType: 'listing' | 'user';
}

export const ReportModal: React.FC<ReportModalProps> = ({
    visible,
    onClose,
    onSubmit,
    targetName,
    reportType,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);
    const [customDescription, setCustomDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (visible) {
            setSelectedCategory(null);
            setCustomDescription('');
            setError(null);
        }
    }, [visible]);

    const handleCategorySelect = (category: ReportCategory) => {
        setSelectedCategory(category);
        setError(null);
    };

    const handleSubmitWithConfirmation = () => {
        // Validation
        if (!selectedCategory) {
            setError('Please select a reason for reporting');
            return;
        }

        // Show confirmation dialog
        Alert.alert(
            'Confirm Report',
            `Are you sure you want to report this ${reportType}?\n\nReason: ${REPORT_CATEGORIES.find(c => c.value === selectedCategory)?.label}\n\nThis action cannot be undone.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Report',
                    style: 'destructive',
                    onPress: handleSubmit,
                },
            ]
        );
    };

    const handleSubmit = async () => {
        if (!selectedCategory) return;

        setSubmitting(true);
        setError(null);

        try {
            await onSubmit({
                category: selectedCategory,
                description: customDescription.trim(),
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to submit report');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text variant="lg-semibold" style={styles.headerTitle}>
                        Report {reportType === 'listing' ? 'Listing' : 'User'}
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Target Info */}
                    <View style={styles.section}>
                        <Text variant="md-medium" style={styles.label}>
                            Reporting
                        </Text>
                        <View style={styles.targetCard}>
                            <Ionicons
                                name={reportType === 'listing' ? 'business-outline' : 'person-outline'}
                                size={20}
                                color={colors.text.secondary}
                            />
                            <Text variant="md-semibold" style={styles.targetName}>
                                {targetName}
                            </Text>
                        </View>
                    </View>

                    {/* Category Selection */}
                    <View style={styles.section}>
                        <Text variant="md-medium" style={styles.label}>
                            Reason for Reporting *
                        </Text>
                        <Text variant="sm-normal" style={styles.helperText}>
                            Select the most appropriate reason
                        </Text>

                        <View style={styles.categoriesContainer}>
                            {REPORT_CATEGORIES.map((category) => (
                                <TouchableOpacity
                                    key={category.value}
                                    style={[
                                        styles.categoryCard,
                                        selectedCategory === category.value && styles.categoryCardSelected,
                                    ]}
                                    onPress={() => handleCategorySelect(category.value)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.categoryHeader}>
                                        <View
                                            style={[
                                                styles.radioButton,
                                                selectedCategory === category.value && styles.radioButtonSelected,
                                            ]}
                                        >
                                            {selectedCategory === category.value && (
                                                <View style={styles.radioButtonInner} />
                                            )}
                                        </View>
                                        <Text
                                            variant="md-semibold"
                                            style={[
                                                styles.categoryLabel,
                                                selectedCategory === category.value && styles.categoryLabelSelected,
                                            ]}
                                        >
                                            {category.label}
                                        </Text>
                                    </View>
                                    <Text variant="sm-normal" style={styles.categoryDescription}>
                                        {category.description}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Custom Description (Optional) */}
                    <View style={styles.section}>
                        <Text variant="md-medium" style={styles.label}>
                            Additional Details (Optional)
                        </Text>
                        <Text variant="sm-normal" style={styles.helperText}>
                            Provide more context if needed
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Describe the issue..."
                            placeholderTextColor={colors.text.secondary}
                            value={customDescription}
                            onChangeText={setCustomDescription}
                            multiline
                            numberOfLines={4}
                            maxLength={500}
                            textAlignVertical="top"
                        />
                        <Text variant="sm-normal" style={styles.charCount}>
                            {customDescription.length}/500
                        </Text>
                    </View>

                    {/* Error */}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={20} color={colors.status.errorDark} />
                            <Text variant="sm-normal" style={styles.errorText}>
                                {error}
                            </Text>
                        </View>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                        onPress={handleSubmitWithConfirmation}
                        disabled={submitting}
                        activeOpacity={0.8}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color={colors.common.white} />
                        ) : (
                            <>
                                <Ionicons name="flag" size={18} color={colors.common.white} />
                                <Text variant="md-semibold" style={styles.submitButtonText}>
                                    Submit Report
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Info Text */}
                    <Text variant="xs-normal" style={styles.infoText}>
                        Your report will be reviewed by our moderation team. False reports may result in account restrictions.
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.light,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        color: colors.text.primary,
    },
    placeholder: {
        width: 32,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        color: colors.text.primary,
        marginBottom: 8,
    },
    helperText: {
        color: colors.text.secondary,
        marginBottom: 12,
    },
    targetCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: colors.background.lightSecondary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    targetName: {
        color: colors.text.primary,
        flex: 1,
    },
    categoriesContainer: {
        gap: 12,
    },
    categoryCard: {
        padding: 16,
        backgroundColor: colors.background.light,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: colors.border.light,
    },
    categoryCardSelected: {
        borderColor: colors.status.errorDark,
        backgroundColor: colors.status.errorDark + '08',
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 6,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border.medium,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonSelected: {
        borderColor: colors.status.errorDark,
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.status.errorDark,
    },
    categoryLabel: {
        color: colors.text.primary,
        flex: 1,
    },
    categoryLabelSelected: {
        color: colors.status.errorDark,
    },
    categoryDescription: {
        color: colors.text.secondary,
        marginLeft: 32,
    },
    textInput: {
        borderWidth: 1,
        borderColor: colors.border.light,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Outfit-Regular',
        color: colors.text.primary,
        minHeight: 100,
        backgroundColor: colors.background.lightSecondary,
    },
    charCount: {
        color: colors.text.secondary,
        textAlign: 'right',
        marginTop: 8,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: '#FEE2E2',
        borderRadius: 12,
        marginBottom: 24,
    },
    errorText: {
        flex: 1,
        color: colors.status.errorDark,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.status.errorDark,
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: colors.common.white,
    },
    infoText: {
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 18,
    },
});
