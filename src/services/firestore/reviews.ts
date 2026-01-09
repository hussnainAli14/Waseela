import { firebaseFirestore } from '@/config/firebase';
import type { Review, TargetType } from '@/types/firestore';

const COLLECTION = 'reviews';

export const createReview = async (
    targetType: TargetType,
    targetId: string,
    userId: string,
    userName: string,
    rating: number,
    comment: string,
    userPhoto?: string
): Promise<string> => {
    const reviewData: Omit<Review, 'id'> = {
        targetType,
        targetId,
        userId,
        userName,
        userPhoto,
        rating,
        comment,
        helpful: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const docRef = await firebaseFirestore.collection(COLLECTION).add(reviewData);
    return docRef.id;
};

export const getReview = async (reviewId: string): Promise<Review | null> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(reviewId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data(),
    } as Review;
};

export const getReviewsForTarget = async (
    targetType: TargetType,
    targetId: string,
    limit: number = 20
): Promise<Review[]> => {
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('targetType', '==', targetType)
        .where('targetId', '==', targetId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Review[];
};

export const getReviewsByUser = async (userId: string): Promise<Review[]> => {
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Review[];
};

export const updateReview = async (
    reviewId: string,
    rating: number,
    comment: string
): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(reviewId).update({
        rating,
        comment,
        updatedAt: new Date().toISOString(),
    });
};

export const deleteReview = async (reviewId: string): Promise<void> => {
    await firebaseFirestore.collection(COLLECTION).doc(reviewId).delete();
};

export const incrementHelpful = async (reviewId: string): Promise<void> => {
    const doc = await firebaseFirestore.collection(COLLECTION).doc(reviewId).get();
    const currentHelpful = (doc.data()?.helpful || 0) as number;

    await firebaseFirestore.collection(COLLECTION).doc(reviewId).update({
        helpful: currentHelpful + 1,
    });
};

export const calculateAverageRating = async (
    targetType: TargetType,
    targetId: string
): Promise<{ averageRating: number; reviewCount: number }> => {
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('targetType', '==', targetType)
        .where('targetId', '==', targetId)
        .get();

    if (snapshot.empty) {
        return { averageRating: 0, reviewCount: 0 };
    }

    const reviews = snapshot.docs.map(doc => doc.data() as Review);
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: reviews.length,
    };
};

export const checkUserReview = async (
    targetType: TargetType,
    targetId: string,
    userId: string
): Promise<Review | null> => {
    const snapshot = await firebaseFirestore
        .collection(COLLECTION)
        .where('targetType', '==', targetType)
        .where('targetId', '==', targetId)
        .where('userId', '==', userId)
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
};
