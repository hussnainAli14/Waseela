/**
 * Review Service
 * Handles all review-related operations with admin approval workflow
 */

import firebaseFirestore from '@react-native-firebase/firestore';
import { toMilliseconds } from '@/utils/dateUtils';

const COLLECTION = 'reviews';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type ListingType = 'business' | 'service' | 'marketplace' | 'room' | 'product';

export interface Review {
    id: string;
    listingId: string;
    listingType: ListingType;
    userId: string;
    userName: string;
    rating: number; // 1-5
    comment: string;
    status: ReviewStatus;
    createdAt: number;
    updatedAt: number;
    moderatedBy?: string;
    moderatedAt?: number;
}

export interface ReviewFormData {
    rating: number;
    comment: string;
}

/**
 * Submit a new review (status: pending by default)
 */
export const submitReview = async (
    listingId: string,
    listingType: ListingType,
    userId: string,
    userName: string,
    data: ReviewFormData
): Promise<string> => {
    try {
        // Check if user already reviewed this listing
        const existingReview = await getUserReview(userId, listingId);
        if (existingReview) {
            throw new Error('You have already reviewed this listing');
        }

        const docRef = firebaseFirestore().collection(COLLECTION).doc();
        const reviewId = docRef.id;

        const review: Review = {
            id: reviewId,
            listingId,
            listingType,
            userId,
            userName,
            rating: data.rating,
            comment: data.comment,
            status: 'pending',
            createdAt: toMilliseconds(new Date().toISOString()),
            updatedAt: toMilliseconds(new Date().toISOString()),
        };

        await docRef.set(review);
        return reviewId;
    } catch (error) {
        console.error('Error submitting review:', error);
        throw error;
    }
};

/**
 * Get all approved reviews for a listing
 */
export const getApprovedReviews = async (
    listingId: string,
    listingType: ListingType
): Promise<Review[]> => {
    try {
        const snapshot = await firebaseFirestore()
            .collection(COLLECTION)
            .where('listingId', '==', listingId)
            .where('listingType', '==', listingType)
            .where('status', '==', 'approved')
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Review[];
    } catch (error) {
        console.error('Error fetching approved reviews:', error);
        return [];
    }
};

/**
 * Get user's review for a specific listing (any status)
 */
export const getUserReview = async (
    userId: string,
    listingId: string
): Promise<Review | null> => {
    try {
        const snapshot = await firebaseFirestore()
            .collection(COLLECTION)
            .where('userId', '==', userId)
            .where('listingId', '==', listingId)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
        } as Review;
    } catch (error) {
        console.error('Error fetching user review:', error);
        return null;
    }
};

/**
 * Update user's own review (resets status to pending)
 */
export const updateReview = async (
    reviewId: string,
    userId: string,
    data: ReviewFormData
): Promise<void> => {
    try {
        const docRef = firebaseFirestore().collection(COLLECTION).doc(reviewId);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error('Review not found');
        }

        const review = doc.data() as Review;
        if (review.userId !== userId) {
            throw new Error('Unauthorized: You can only edit your own reviews');
        }

        await docRef.update({
            rating: data.rating,
            comment: data.comment,
            status: 'pending', // Reset to pending after edit
            updatedAt: toMilliseconds(new Date().toISOString()),
        });
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};

/**
 * Admin: Get all pending reviews
 */
export const getPendingReviews = async (): Promise<Review[]> => {
    try {
        const snapshot = await firebaseFirestore()
            .collection(COLLECTION)
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Review[];
    } catch (error) {
        console.error('Error fetching pending reviews:', error);
        return [];
    }
};

/**
 * Admin: Approve a review and update listing rating
 */
export const approveReview = async (
    reviewId: string,
    adminId: string
): Promise<void> => {
    try {
        // Get the review first to know which listing to update
        const reviewDoc = await firebaseFirestore()
            .collection(COLLECTION)
            .doc(reviewId)
            .get();

        if (!reviewDoc.exists) {
            throw new Error('Review not found');
        }

        const review = reviewDoc.data() as Review;

        // Update review status
        await firebaseFirestore()
            .collection(COLLECTION)
            .doc(reviewId)
            .update({
                status: 'approved',
                moderatedBy: adminId,
                moderatedAt: toMilliseconds(new Date().toISOString()),
                updatedAt: toMilliseconds(new Date().toISOString()),
            });

        // Update listing rating (this will recalculate based on all approved reviews)
        await updateListingRating(review.listingId, review.listingType);
    } catch (error) {
        console.error('Error approving review:', error);
        throw error;
    }
};

/**
 * Admin: Reject a review
 */
export const rejectReview = async (
    reviewId: string,
    adminId: string
): Promise<void> => {
    try {
        await firebaseFirestore()
            .collection(COLLECTION)
            .doc(reviewId)
            .update({
                status: 'rejected',
                moderatedBy: adminId,
                moderatedAt: toMilliseconds(new Date().toISOString()),
                updatedAt: toMilliseconds(new Date().toISOString()),
            });
    } catch (error) {
        console.error('Error rejecting review:', error);
        throw error;
    }
};

/**
 * Delete a review and update listing rating
 */
export const deleteReview = async (
    reviewId: string,
    userId: string
): Promise<void> => {
    try {
        const docRef = firebaseFirestore().collection(COLLECTION).doc(reviewId);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error('Review not found');
        }

        const review = doc.data() as Review;
        if (review.userId !== userId) {
            throw new Error('Unauthorized: You can only delete your own reviews');
        }

        // Store listing info before deleting
        const { listingId, listingType, status } = review;

        // Delete the review
        await docRef.delete();

        // If the deleted review was approved, update the listing rating
        if (status === 'approved') {
            await updateListingRating(listingId, listingType);
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};

/**
 * Update listing's aggregate rating based on approved reviews
 */
export const updateListingRating = async (
    listingId: string,
    listingType: ListingType
): Promise<void> => {
    try {
        // Get all approved reviews for this listing
        const reviews = await getApprovedReviews(listingId, listingType);

        if (reviews.length === 0) {
            // No reviews, set rating to 0
            await updateListingDocument(listingId, listingType, 0, 0);
            return;
        }

        // Calculate average rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        const roundedRating = Math.round(averageRating * 10) / 10; // Round to 1 decimal

        await updateListingDocument(listingId, listingType, roundedRating, reviews.length);
    } catch (error) {
        console.error('Error updating listing rating:', error);
        throw error;
    }
};

/**
 * Helper: Update the listing document with new rating
 */
const updateListingDocument = async (
    listingId: string,
    listingType: ListingType,
    rating: number,
    reviewCount: number
): Promise<void> => {
    try {
        let collection = '';
        switch (listingType) {
            case 'business':
                collection = 'businesses';
                break;
            case 'service':
                collection = 'services';
                break;
            case 'marketplace':
                collection = 'marketplace';
                break;
            case 'room':
                collection = 'rooms';
                break;
            case 'product':
                collection = 'products';
                break;
            default:
                throw new Error(`Unknown listing type: ${listingType}`);
        }

        await firebaseFirestore()
            .collection(collection)
            .doc(listingId)
            .update({
                rating,
                reviewCount,
                updatedAt: new Date().toISOString(),
            });
    } catch (error) {
        console.error('Error updating listing document:', error);
        throw error;
    }
};

/**
 * Get review statistics for a listing
 */
export const getReviewStats = async (
    listingId: string,
    listingType: ListingType
): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
}> => {
    try {
        const reviews = await getApprovedReviews(listingId, listingType);

        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            };
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

        const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(review => {
            ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
        });

        return {
            averageRating,
            totalReviews: reviews.length,
            ratingDistribution,
        };
    } catch (error) {
        console.error('Error getting review stats:', error);
        return {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
    }
};
