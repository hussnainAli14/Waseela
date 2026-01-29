import { Timestamp } from '@react-native-firebase/firestore';

/**
 * Safely convert a date value (string, number, or Firestore Timestamp) to milliseconds
 * @param date - Date value as string, number, or Firestore Timestamp
 * @returns Milliseconds since epoch, or 0 if invalid
 */
export const toMilliseconds = (date: string | number | Timestamp | Date | undefined | null): number => {
    if (!date) return 0;

    if (date instanceof Date) {
        return date.getTime();
    }

    if (typeof date === 'number') {
        return date;
    }

    if (typeof date === 'string') {
        return new Date(date).getTime();
    }

    // Firestore Timestamp
    if (typeof date === 'object' && 'toMillis' in date) {
        return date.toMillis();
    }

    return 0;
};

/**
 * Format a date for display
 * @param date - Date value as string or Firestore Timestamp
 * @param format - Format type ('relative' | 'short' | 'long')
 * @returns Formatted date string
 */
export const formatDate = (
    date: string | number | Timestamp | undefined | null,
    format: 'relative' | 'short' | 'long' = 'relative'
): string => {
    const ms = toMilliseconds(date);
    if (ms === 0) return 'Unknown date';

    const dateObj = new Date(ms);

    if (format === 'relative') {
        const now = Date.now();
        const diff = now - ms;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        if (days < 30) return `${Math.floor(days / 7)}w ago`;
        return dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }

    if (format === 'short') {
        return dateObj.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    // long format
    return dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
