import { Timestamp } from '@react-native-firebase/firestore';

// Base types
export type ListingStatus = 'pending' | 'approved' | 'active' | 'rejected';
export type ItemStatus = 'active' | 'sold' | 'removed';

export type RoomType = 'single' | 'double' | 'studio' | 'shared';
export type ItemCondition = 'new' | 'like-new' | 'good' | 'fair' | 'needs-repair';
export type ContactMethod = 'whatsapp' | 'email' | 'phone';
export type TargetType = 'business' | 'service' | 'professional';

// User type (extends auth user)
export interface User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    phone?: string;
    location?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Business type
export interface Business {
    id: string;
    ownerId: string;
    name: string;
    category: string;
    description: string;
    tagline?: string;
    city: string;
    address?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    images: string[];
    logoUrl?: string;
    contactPerson: string;
    whatsapp: string;
    email: string;
    phone?: string;
    website?: string;
    instagram?: string;
    openingHours?: string;
    tags: string[];
    rating: number;
    reviewCount: number;
    verified: boolean;
    status: ListingStatus;
    createdAt: Timestamp | string | number;
    updatedAt: Timestamp | string | number;
    approvedAt?: Timestamp | string | number;
    rejectedAt?: Timestamp | string | number;
}

// Service type
export interface Service {
    id: string;
    providerId: string;
    name: string;
    serviceType: string;
    description: string;
    city: string;
    areasCovered: string[];
    images: string[];
    profilePhoto?: string;
    whatsapp: string;
    email: string;
    phone?: string;
    experience?: string;
    tags: string[];
    rating: number;
    reviewCount: number;
    verified: boolean;
    status: ListingStatus;
    createdAt: Timestamp | string | number;
    updatedAt: Timestamp | string | number;
    approvedAt?: Timestamp | string | number;
    rejectedAt?: Timestamp | string | number;
}

// Marketplace item type
export interface MarketplaceItem {
    id: string;
    sellerId: string;
    title: string;
    description: string;
    category: string;
    condition: ItemCondition;
    price: number;
    currency: string;
    location: string;
    city: string;
    images: string[];
    contactMethod: ContactMethod;
    whatsapp?: string;
    email?: string;
    phone?: string;
    status: ItemStatus;
    views: number;
    createdAt: Timestamp | string | number;
    updatedAt: Timestamp | string | number;
    approvedAt?: Timestamp | string | number;
    rejectedAt?: Timestamp | string | number;
}

// Product type
export interface Product {
    id: string;
    sellerId: string;
    sellerName?: string;
    sellerPhoto?: string;
    title: string;
    description: string;
    category: string;
    condition: ItemCondition;
    price: number;
    location: string;
    city: string;
    images: string[];
    verified: boolean;
    status: ListingStatus;
    views: number;
    createdAt: Timestamp | string | number;
    updatedAt: Timestamp | string | number;
    approvedAt?: Timestamp | string | number;
    rejectedAt?: Timestamp | string | number;
}

// Room Status
export type RoomStatus = 'pending' | 'available' | 'rented' | 'removed' | 'rejected';

// Room type
export interface Room {
    id: string;
    posterId: string;
    posterName?: string;
    posterPhoto?: string;
    title: string;
    description: string;
    type: RoomType;
    city: string;
    locationLine1: string;
    locationLine2?: string;
    postcode?: string;
    price: number;
    priceLabel: string;
    billsIncluded: boolean;
    availableFrom: Timestamp | string | number;
    images: string[];
    amenities: string[];
    whatsapp: string;
    email?: string;
    phone?: string;
    status: RoomStatus;
    views: number;
    createdAt: Timestamp | string | number;
    updatedAt: Timestamp | string | number;
    approvedAt?: Timestamp | string | number;
    rejectedAt?: Timestamp | string | number;
}

// Professional type
export interface ProfessionalProfile {
    id: string;
    userId: string;
    fullName: string;
    profession: string;
    company?: string;
    industry: string;
    location: string;
    bio: string;
    skills: string[];
    experience?: string;
    education?: string;
    profilePhoto?: string;
    linkedIn?: string;
    website?: string;
    email: string;
    phone?: string;
    connections: number;
    verified: boolean;
    status: ListingStatus;
    createdAt: Timestamp | string | number;
    updatedAt: Timestamp | string | number;
    approvedAt?: Timestamp | string | number;
    rejectedAt?: Timestamp | string | number;
}

// Review type
export interface Review {
    id: string;
    targetType: TargetType;
    targetId: string;
    userId: string;
    userName: string;
    userPhoto?: string;
    rating: number;
    comment: string;
    helpful: number;
    createdAt: Timestamp | string | number;
    updatedAt: Timestamp | string | number;
}

// Saved listing type
export interface SavedListing {
    itemType: 'business' | 'service' | 'marketplace' | 'room';
    itemId: string;
    savedAt: Timestamp | string | number;
}

// Category type
export interface Category {
    id: string;
    type: 'business' | 'service' | 'marketplace' | 'professional';
    name: string;
    icon: string;
    order: number;
    active: boolean;
}

// Form data types
export interface BusinessFormData {
    name: string;
    category: string;
    description: string;
    tagline?: string;
    city: string;
    address?: string;
    contactPerson: string;
    whatsapp: string;
    email: string;
    phone?: string;
    website?: string;
    instagram?: string;
    openingHours?: string;
    tags: string[];
}

export interface ServiceFormData {
    name: string;
    serviceType: string;
    description: string;
    city: string;
    areasCovered: string[];
    whatsapp: string;
    email: string;
    phone?: string;
    experience?: string;
    tags: string[];
}

export interface MarketplaceFormData {
    title: string;
    description: string;
    category: string;
    condition: ItemCondition;
    price: number;
    location: string;
    city: string;
    contactMethod: ContactMethod;
    whatsapp?: string;
    email?: string;
    phone?: string;
}

export interface ProductFormData {
    title: string;
    description: string;
    category: string;
    condition: ItemCondition;
    price: number;
    location: string;
    city: string;
}

export interface RoomFormData {
    title: string;
    description: string;
    type: RoomType;
    city: string;
    locationLine1: string;
    locationLine2?: string;
    postcode?: string;
    price: number;
    billsIncluded: boolean;
    availableFrom: Date;
    amenities: string[];
    whatsapp: string;
    email?: string;
    phone?: string;
}

export interface ProfessionalFormData {
    fullName: string;
    profession: string;
    company?: string;
    industry: string;
    location: string;
    bio: string;
    skills: string[];
    experience?: string;
    education?: string;
    linkedIn?: string;
    website?: string;
    email: string;
    phone?: string;
}

// Query filter types
export interface ListingFilters {
    category?: string;
    city?: string;
    verified?: boolean;
    minRating?: number;
    search?: string;
    status?: ListingStatus;
}

export interface MarketplaceFilters {
    category?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: ItemCondition;
    search?: string;
}

export interface RoomFilters {
    type?: RoomType;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    billsIncluded?: boolean;
    search?: string;
}

// Pagination type
export interface PaginationState {
    page: number;
    limit: number;
    hasMore: boolean;
    lastDoc?: any;
}
