/**
 * Reports Service
 * Handles all report-related operations for user/listing reporting
 */

import firebaseFirestore from '@react-native-firebase/firestore';
import { toMilliseconds } from '@/utils/dateUtils';

const COLLECTION = 'reports';

export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';
export type ReportType = 'listing' | 'user' | 'review';
export type ReportCategory =
    | 'spam'
    | 'inappropriate'
    | 'scam'
    | 'offensive'
    | 'fake'
    | 'other';

export type TargetType = 'business' | 'service' | 'marketplace' | 'room' | 'product';

export interface Report {
    id: string;
    reporterId: string;
    reporterName: string;
    reportType: ReportType;
    targetId: string;
    targetType?: TargetType;
    targetName?: string; // Name of the reported item/user
    category: ReportCategory;
    description: string;
    status: ReportStatus;
    resolution?: string;
    createdAt: number;
    updatedAt: number;
    reviewedBy?: string;
    reviewedAt?: number;
}

export interface ReportFormData {
    category: ReportCategory;
    description: string;
}

/**
 * Submit a new report
 */
export const submitReport = async (
    reporterId: string,
    reporterName: string,
    reportType: ReportType,
    targetId: string,
    targetName: string,
    data: ReportFormData,
    targetType?: TargetType
): Promise<string> => {
    try {
        const docRef = firebaseFirestore().collection(COLLECTION).doc();
        const reportId = docRef.id;

        const report: Report = {
            id: reportId,
            reporterId,
            reporterName,
            reportType,
            targetId,
            targetName,
            targetType,
            category: data.category,
            description: data.description,
            status: 'pending',
            createdAt: toMilliseconds(new Date().toISOString()),
            updatedAt: toMilliseconds(new Date().toISOString()),
        };

        await docRef.set(report);
        return reportId;
    } catch (error) {
        console.error('Error submitting report:', error);
        throw error;
    }
};

/**
 * Get all reports submitted by a user
 */
export const getUserReports = async (userId: string): Promise<Report[]> => {
    try {
        const snapshot = await firebaseFirestore()
            .collection(COLLECTION)
            .where('reporterId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Report[];
    } catch (error) {
        console.error('Error fetching user reports:', error);
        return [];
    }
};

/**
 * Get a specific report
 */
export const getReport = async (reportId: string): Promise<Report | null> => {
    try {
        const doc = await firebaseFirestore()
            .collection(COLLECTION)
            .doc(reportId)
            .get();

        if (!doc.exists) {
            return null;
        }

        return {
            id: doc.id,
            ...doc.data(),
        } as Report;
    } catch (error) {
        console.error('Error fetching report:', error);
        return null;
    }
};

/**
 * Delete a pending report (user can only delete their own pending reports)
 */
export const deleteReport = async (
    reportId: string,
    userId: string
): Promise<void> => {
    try {
        const docRef = firebaseFirestore().collection(COLLECTION).doc(reportId);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error('Report not found');
        }

        const report = doc.data() as Report;

        if (report.reporterId !== userId) {
            throw new Error('Unauthorized: You can only delete your own reports');
        }

        if (report.status !== 'pending') {
            throw new Error('Cannot delete a report that has been reviewed');
        }

        await docRef.delete();
    } catch (error) {
        console.error('Error deleting report:', error);
        throw error;
    }
};

/**
 * Admin: Get all pending reports
 */
export const getPendingReports = async (): Promise<Report[]> => {
    try {
        const snapshot = await firebaseFirestore()
            .collection(COLLECTION)
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Report[];
    } catch (error) {
        console.error('Error fetching pending reports:', error);
        return [];
    }
};

/**
 * Admin: Get all reports (with optional status filter)
 */
export const getAllReports = async (status?: ReportStatus): Promise<Report[]> => {
    try {
        let query = firebaseFirestore().collection(COLLECTION);

        if (status) {
            query = query.where('status', '==', status) as any;
        }

        const snapshot = await query.orderBy('createdAt', 'desc').get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Report[];
    } catch (error) {
        console.error('Error fetching all reports:', error);
        return [];
    }
};

/**
 * Admin: Update report status
 */
export const updateReportStatus = async (
    reportId: string,
    status: ReportStatus,
    resolution: string,
    adminId: string
): Promise<void> => {
    try {
        await firebaseFirestore()
            .collection(COLLECTION)
            .doc(reportId)
            .update({
                status,
                resolution,
                reviewedBy: adminId,
                reviewedAt: toMilliseconds(new Date().toISOString()),
                updatedAt: toMilliseconds(new Date().toISOString()),
            });
    } catch (error) {
        console.error('Error updating report status:', error);
        throw error;
    }
};

/**
 * Get report statistics for admin dashboard
 */
export const getReportStats = async (): Promise<{
    total: number;
    pending: number;
    underReview: number;
    resolved: number;
    dismissed: number;
}> => {
    try {
        const snapshot = await firebaseFirestore()
            .collection(COLLECTION)
            .get();

        const reports = snapshot.docs.map(doc => doc.data() as Report);

        return {
            total: reports.length,
            pending: reports.filter(r => r.status === 'pending').length,
            underReview: reports.filter(r => r.status === 'under_review').length,
            resolved: reports.filter(r => r.status === 'resolved').length,
            dismissed: reports.filter(r => r.status === 'dismissed').length,
        };
    } catch (error) {
        console.error('Error getting report stats:', error);
        return {
            total: 0,
            pending: 0,
            underReview: 0,
            resolved: 0,
            dismissed: 0,
        };
    }
};

/**
 * Predefined report categories with descriptions
 */
export const REPORT_CATEGORIES = [
    {
        value: 'spam' as ReportCategory,
        label: 'Spam',
        description: 'Unwanted promotional or repetitive content',
    },
    {
        value: 'inappropriate' as ReportCategory,
        label: 'Inappropriate Content',
        description: 'Offensive or unsuitable material',
    },
    {
        value: 'scam' as ReportCategory,
        label: 'Scam/Fraud',
        description: 'Fraudulent or deceptive activity',
    },
    {
        value: 'offensive' as ReportCategory,
        label: 'Offensive Language',
        description: 'Hate speech or abusive content',
    },
    {
        value: 'fake' as ReportCategory,
        label: 'Fake Profile/Listing',
        description: 'Impersonation or false information',
    },
    {
        value: 'other' as ReportCategory,
        label: 'Other',
        description: 'Other concerns (please provide details)',
    },
];
