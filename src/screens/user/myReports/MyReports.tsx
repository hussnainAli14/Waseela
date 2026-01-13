/**
 * MyReports Screen
 * Displays user's submitted reports with status tracking
 */

import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { colors } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchUserReports, deleteReport } from '@/store/slices/reportsSlice';
import type { Report } from '@/services/firestore/reports';

const MyReports = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { userReports, loading } = useAppSelector(state => state.reports);

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchUserReports(user.uid));
        }
    }, [user?.uid, dispatch]);

    const getStatusColor = (status: Report['status']) => {
        switch (status) {
            case 'pending':
                return colors.accent.orange;
            case 'under_review':
                return colors.primary[500];
            case 'resolved':
                return colors.status.success;
            case 'dismissed':
                return colors.text.secondary;
            default:
                return colors.text.secondary;
        }
    };

    const getStatusLabel = (status: Report['status']) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'under_review':
                return 'Under Review';
            case 'resolved':
                return 'Resolved';
            case 'dismissed':
                return 'Dismissed';
            default:
                return status;
        }
    };

    const getCategoryLabel = (category: Report['category']) => {
        const labels: Record<string, string> = {
            spam: 'Spam',
            inappropriate: 'Inappropriate Content',
            scam: 'Scam/Fraud',
            offensive: 'Offensive Language',
            fake: 'Fake Profile/Listing',
            other: 'Other',
        };
        return labels[category] || category;
    };

    const handleDeleteReport = (report: Report) => {
        if (report.status !== 'pending') {
            Alert.alert('Cannot Delete', 'You can only delete pending reports.');
            return;
        }

        Alert.alert(
            'Delete Report',
            'Are you sure you want to delete this report?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        if (user?.uid) {
                            try {
                                await dispatch(deleteReport({ reportId: report.id, userId: user.uid })).unwrap();
                            } catch (error) {
                                Alert.alert('Error', 'Failed to delete report');
                            }
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="flag-outline" size={64} color={colors.text.secondary} />
            <Text variant="lg-semibold" style={styles.emptyTitle}>
                No Reports Yet
            </Text>
            <Text variant="md-normal" style={styles.emptyText}>
                You haven't submitted any reports. Use the flag icon on listings to report inappropriate content.
            </Text>
        </View>
    );

    const renderReportCard = (report: Report) => (
        <View key={report.id} style={styles.reportCard}>
            {/* Header */}
            <View style={styles.reportHeader}>
                <View style={styles.reportHeaderLeft}>
                    <Ionicons
                        name={report.reportType === 'listing' ? 'business-outline' : 'person-outline'}
                        size={20}
                        color={colors.text.primary}
                    />
                    <Text variant="md-semibold" style={styles.reportTarget} numberOfLines={1}>
                        {report.targetName}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
                    <Text variant="xs-semibold" style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                        {getStatusLabel(report.status)}
                    </Text>
                </View>
            </View>

            {/* Category */}
            <View style={styles.reportRow}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.text.secondary} />
                <Text variant="sm-medium" style={styles.reportLabel}>
                    Reason:
                </Text>
                <Text variant="sm-normal" style={styles.reportValue}>
                    {getCategoryLabel(report.category)}
                </Text>
            </View>

            {/* Description */}
            {report.description && (
                <View style={styles.descriptionContainer}>
                    <Text variant="sm-normal" style={styles.descriptionText}>
                        "{report.description}"
                    </Text>
                </View>
            )}

            {/* Date */}
            <View style={styles.reportRow}>
                <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
                <Text variant="sm-normal" style={styles.dateText}>
                    Submitted on {formatDate(report.createdAt)}
                </Text>
            </View>

            {/* Resolution (if available) */}
            {report.resolution && (
                <View style={styles.resolutionContainer}>
                    <Text variant="sm-semibold" style={styles.resolutionTitle}>
                        Admin Response:
                    </Text>
                    <Text variant="sm-normal" style={styles.resolutionText}>
                        {report.resolution}
                    </Text>
                </View>
            )}

            {/* Actions */}
            {report.status === 'pending' && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteReport(report)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash-outline" size={16} color={colors.status.errorDark} />
                    <Text variant="sm-semibold" style={styles.deleteButtonText}>
                        Delete Report
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
                    <Text variant="lg-semibold" style={styles.headerTitle}>
                        My Reports
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.secondary[500]} />
                    <Text variant="md-normal" style={styles.loadingText}>
                        Loading reports...
                    </Text>
                </View>
            ) : userReports.length === 0 ? (
                renderEmptyState()
            ) : (
                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <Text variant="sm-normal" style={styles.infoText}>
                        You have {userReports.length} report{userReports.length !== 1 ? 's' : ''}
                    </Text>
                    {userReports.map(renderReportCard)}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.lightSecondary,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
        backgroundColor: colors.background.light,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        color: colors.text.primary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        color: colors.text.secondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        gap: 16,
    },
    emptyTitle: {
        color: colors.text.primary,
    },
    emptyText: {
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    infoText: {
        color: colors.text.secondary,
        marginBottom: 16,
    },
    reportCard: {
        backgroundColor: colors.background.light,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    reportHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    reportHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    reportTarget: {
        color: colors.text.primary,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontFamily: 'Outfit-SemiBold',
    },
    reportRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    reportLabel: {
        color: colors.text.secondary,
    },
    reportValue: {
        color: colors.text.primary,
        flex: 1,
    },
    descriptionContainer: {
        backgroundColor: colors.background.lightSecondary,
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
    },
    descriptionText: {
        color: colors.text.primary,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    dateText: {
        color: colors.text.secondary,
    },
    resolutionContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: colors.status.successLight,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: colors.status.success,
    },
    resolutionTitle: {
        color: colors.status.successDark,
        marginBottom: 4,
    },
    resolutionText: {
        color: colors.text.primary,
        lineHeight: 20,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.status.errorDark,
    },
    deleteButtonText: {
        color: colors.status.errorDark,
    },
});

export default MyReports;
