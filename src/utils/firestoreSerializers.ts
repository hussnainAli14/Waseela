/**
 * Timestamp Serialization Utilities
 * Helper functions to convert Firestore Timestamps to milliseconds for Redux serialization
 */

import { toMilliseconds } from '@/utils/dateUtils';

/**
 * Serializes Firestore timestamp fields to milliseconds
 * Handles Firestore Timestamp objects, numbers, and ISO strings
 */
export const serializeTimestamp = (timestamp: any): number => {
    if (!timestamp) return Date.now();
    if (timestamp?.toMillis) return timestamp.toMillis();
    if (typeof timestamp === 'number') return timestamp;
    return toMilliseconds(timestamp);
};

/**
 * Serializes a Firestore document with timestamp fields
 * @param docId - Document ID
 * @param data - Document data from Firestore
 * @param timestampFields - Array of field names that contain timestamps (default: ['createdAt', 'updatedAt'])
 */
export const serializeFirestoreDoc = <T>(
    docId: string,
    data: any,
    timestampFields: string[] = ['createdAt', 'updatedAt']
): T => {
    const serialized: any = {
        id: docId,
        ...data,
    };

    // Serialize all timestamp fields
    timestampFields.forEach(field => {
        if (data?.[field]) {
            serialized[field] = serializeTimestamp(data[field]);
        }
    });

    return serialized as T;
};
