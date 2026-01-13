/**
 * Reviews Slice
 * Manages review state and operations
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Review, ReviewFormData, ListingType } from '@/services/firestore/reviews';
import * as reviewsService from '@/services/firestore/reviews';

interface ReviewsState {
    reviews: Review[];
    userReview: Review | null;
    loading: boolean;
    submitting: boolean;
    error: string | null;
}

const initialState: ReviewsState = {
    reviews: [],
    userReview: null,
    loading: false,
    submitting: false,
    error: null,
};

/**
 * Fetch approved reviews for a listing
 */
export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async ({ listingId, listingType }: { listingId: string; listingType: ListingType }) => {
        const reviews = await reviewsService.getApprovedReviews(listingId, listingType);
        return reviews;
    }
);

/**
 * Fetch user's review for a listing
 */
export const fetchUserReview = createAsyncThunk(
    'reviews/fetchUserReview',
    async ({ userId, listingId }: { userId: string; listingId: string }) => {
        const review = await reviewsService.getUserReview(userId, listingId);
        return review;
    }
);

/**
 * Submit a new review
 */
export const submitReview = createAsyncThunk(
    'reviews/submitReview',
    async ({
        listingId,
        listingType,
        userId,
        userName,
        data,
    }: {
        listingId: string;
        listingType: ListingType;
        userId: string;
        userName: string;
        data: ReviewFormData;
    }) => {
        const reviewId = await reviewsService.submitReview(
            listingId,
            listingType,
            userId,
            userName,
            data
        );
        // Fetch the newly created review
        const review = await reviewsService.getUserReview(userId, listingId);
        return review;
    }
);

/**
 * Update user's review
 */
export const updateReview = createAsyncThunk(
    'reviews/updateReview',
    async ({
        reviewId,
        userId,
        listingId,
        data,
    }: {
        reviewId: string;
        userId: string;
        listingId: string;
        data: ReviewFormData;
    }) => {
        await reviewsService.updateReview(reviewId, userId, data);
        // Fetch the updated review
        const review = await reviewsService.getUserReview(userId, listingId);
        return review;
    }
);

/**
 * Delete user's review
 */
export const deleteReview = createAsyncThunk(
    'reviews/deleteReview',
    async ({ reviewId, userId }: { reviewId: string; userId: string }) => {
        await reviewsService.deleteReview(reviewId, userId);
        return reviewId;
    }
);

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        clearReviews: (state) => {
            state.reviews = [];
            state.userReview = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch reviews
        builder.addCase(fetchReviews.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
            state.loading = false;
            state.reviews = action.payload;
        });
        builder.addCase(fetchReviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch reviews';
        });

        // Fetch user review
        builder.addCase(fetchUserReview.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserReview.fulfilled, (state, action: PayloadAction<Review | null>) => {
            state.loading = false;
            state.userReview = action.payload;
        });
        builder.addCase(fetchUserReview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch user review';
        });

        // Submit review
        builder.addCase(submitReview.pending, (state) => {
            state.submitting = true;
            state.error = null;
        });
        builder.addCase(submitReview.fulfilled, (state, action: PayloadAction<Review | null>) => {
            state.submitting = false;
            if (action.payload) {
                state.userReview = action.payload;
            }
        });
        builder.addCase(submitReview.rejected, (state, action) => {
            state.submitting = false;
            state.error = action.error.message || 'Failed to submit review';
        });

        // Update review
        builder.addCase(updateReview.pending, (state) => {
            state.submitting = true;
            state.error = null;
        });
        builder.addCase(updateReview.fulfilled, (state, action: PayloadAction<Review | null>) => {
            state.submitting = false;
            if (action.payload) {
                state.userReview = action.payload;
            }
        });
        builder.addCase(updateReview.rejected, (state, action) => {
            state.submitting = false;
            state.error = action.error.message || 'Failed to update review';
        });

        // Delete review
        builder.addCase(deleteReview.pending, (state) => {
            state.submitting = true;
            state.error = null;
        });
        builder.addCase(deleteReview.fulfilled, (state) => {
            state.submitting = false;
            state.userReview = null;
        });
        builder.addCase(deleteReview.rejected, (state, action) => {
            state.submitting = false;
            state.error = action.error.message || 'Failed to delete review';
        });
    },
});

export const { clearReviews, clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer;
