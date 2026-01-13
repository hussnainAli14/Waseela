/**
 * Reports Slice
 * Manages report state and operations
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Report, ReportFormData, ReportType, TargetType } from '@/services/firestore/reports';
import * as reportsService from '@/services/firestore/reports';

interface ReportsState {
    userReports: Report[];
    loading: boolean;
    submitting: boolean;
    error: string | null;
}

const initialState: ReportsState = {
    userReports: [],
    loading: false,
    submitting: false,
    error: null,
};

/**
 * Fetch user's submitted reports
 */
export const fetchUserReports = createAsyncThunk(
    'reports/fetchUserReports',
    async (userId: string) => {
        const reports = await reportsService.getUserReports(userId);
        return reports;
    }
);

/**
 * Submit a new report
 */
export const submitReport = createAsyncThunk(
    'reports/submitReport',
    async ({
        reporterId,
        reporterName,
        reportType,
        targetId,
        targetName,
        data,
        targetType,
    }: {
        reporterId: string;
        reporterName: string;
        reportType: ReportType;
        targetId: string;
        targetName: string;
        data: ReportFormData;
        targetType?: TargetType;
    }) => {
        const reportId = await reportsService.submitReport(
            reporterId,
            reporterName,
            reportType,
            targetId,
            targetName,
            data,
            targetType
        );

        // Fetch updated user reports
        const reports = await reportsService.getUserReports(reporterId);
        return reports;
    }
);

/**
 * Delete a report
 */
export const deleteReport = createAsyncThunk(
    'reports/deleteReport',
    async ({ reportId, userId }: { reportId: string; userId: string }) => {
        await reportsService.deleteReport(reportId, userId);

        // Fetch updated user reports
        const reports = await reportsService.getUserReports(userId);
        return reports;
    }
);

const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        clearReports: (state) => {
            state.userReports = [];
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch user reports
        builder.addCase(fetchUserReports.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserReports.fulfilled, (state, action: PayloadAction<Report[]>) => {
            state.loading = false;
            state.userReports = action.payload;
        });
        builder.addCase(fetchUserReports.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch reports';
        });

        // Submit report
        builder.addCase(submitReport.pending, (state) => {
            state.submitting = true;
            state.error = null;
        });
        builder.addCase(submitReport.fulfilled, (state, action: PayloadAction<Report[]>) => {
            state.submitting = false;
            state.userReports = action.payload;
        });
        builder.addCase(submitReport.rejected, (state, action) => {
            state.submitting = false;
            state.error = action.error.message || 'Failed to submit report';
        });

        // Delete report
        builder.addCase(deleteReport.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteReport.fulfilled, (state, action: PayloadAction<Report[]>) => {
            state.loading = false;
            state.userReports = action.payload;
        });
        builder.addCase(deleteReport.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete report';
        });
    },
});

export const { clearReports, clearError } = reportsSlice.actions;
export default reportsSlice.reducer;
