/**
 * ReviewModal Component
 * Modal for submitting and editing reviews
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { colors } from '@/theme';
import type { Review, ReviewFormData } from '@/services/firestore/reviews';

interface ReviewModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: ReviewFormData) => Promise<void>;
    existingReview?: Review | null;
    listingName: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
    visible,
    onClose,
    onSubmit,
    existingReview,
    listingName,
}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load existing review data if editing
    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment);
        } else {
            setRating(0);
            setComment('');
        }
        setError(null);
    }, [existingReview, visible]);

    const handleSubmit = async () => {
        // Validation
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await onSubmit({ rating, comment });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = () => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        activeOpacity={0.7}
                        style={styles.starButton}
                    >
                        <Ionicons
                            name={star <= rating ? 'star' : 'star-outline'}
                            size={40}
                            color={star <= rating ? colors.accent.orange : colors.text.secondary}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
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
                        {existingReview ? 'Edit Review' : 'Write a Review'}
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Listing Name */}
                    <View style={styles.section}>
                        <Text variant="md-medium" style={styles.label}>
                            Reviewing
                        </Text>
                        <Text variant="lg-semibold" style={styles.listingName}>
                            {listingName}
                        </Text>
                    </View>

                    {/* Rating */}
                    <View style={styles.section}>
                        <Text variant="md-medium" style={styles.label}>
                            Rating *
                        </Text>
                        {renderStars()}
                        {rating > 0 && (
                            <Text variant="sm-normal" style={styles.ratingText}>
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
                            </Text>
                        )}
                    </View>

                    {/* Comment */}
                    <View style={styles.section}>
                        <Text variant="md-medium" style={styles.label}>
                            Your Review (Optional)
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Share your experience..."
                            placeholderTextColor={colors.text.secondary}
                            value={comment}
                            onChangeText={setComment}
                            multiline
                            numberOfLines={6}
                            maxLength={500}
                            textAlignVertical="top"
                        />
                        <Text variant="sm-normal" style={styles.charCount}>
                            {comment.length}/500
                        </Text>
                    </View>

                    {/* Pending Notice */}
                    {existingReview?.status === 'pending' && (
                        <View style={styles.pendingNotice}>
                            <Ionicons name="time-outline" size={20} color={colors.accent.orange} />
                            <Text variant="sm-normal" style={styles.pendingText}>
                                Your review is pending approval. Editing will reset it to pending status.
                            </Text>
                        </View>
                    )}

                    {/* Error */}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={20} color="#EF4444" />
                            <Text variant="sm-normal" style={styles.errorText}>
                                {error}
                            </Text>
                        </View>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={submitting}
                        activeOpacity={0.8}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color={colors.common.white} />
                        ) : (
                            <Text variant="md-semibold" style={styles.submitButtonText}>
                                {existingReview ? 'Update Review' : 'Submit Review'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Info Text */}
                    <Text variant="xs-normal" style={styles.infoText}>
                        Your review will be visible after admin approval. Please be respectful and honest.
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
        marginBottom: 12,
    },
    listingName: {
        color: colors.text.primary,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    starButton: {
        padding: 4,
    },
    ratingText: {
        color: colors.text.secondary,
        marginTop: 12,
    },
    textInput: {
        borderWidth: 1,
        borderColor: colors.border.light,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Outfit-Regular',
        color: colors.text.primary,
        minHeight: 120,
        backgroundColor: colors.background.lightSecondary,
    },
    charCount: {
        color: colors.text.secondary,
        textAlign: 'right',
        marginTop: 8,
    },
    pendingNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: colors.accent.orange + '15',
        borderRadius: 12,
        marginBottom: 24,
    },
    pendingText: {
        flex: 1,
        color: colors.text.primary,
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
        backgroundColor: colors.secondary[500],
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
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
