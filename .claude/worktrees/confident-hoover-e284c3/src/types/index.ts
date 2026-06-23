/**
 * types/index.ts
 *
 * Shared TypeScript types for RentalHub BOUESTI.
 * These are derived from the Prisma schema and used across
 * both server and client components.
 */

import type {
  User,
  Location,
  Property,
  Booking,
  Role,
  VerificationStatus,
  PropertyStatus,
  BookingStatus,
} from '@prisma/client';

// ── Re-export Prisma enums ────────────────────────────────
export type { Role, VerificationStatus, PropertyStatus, BookingStatus };

// ── Safe User type (no password) ──────────────────────────
export type SafeUser = Omit<User, 'password'>;

// ── Property with relations ───────────────────────────────
export type PropertyWithRelations = Property & {
  landlord: SafeUser;
  location: Location;
  _count?: {
    bookings: number;
  };
};

// ── Booking with relations ────────────────────────────────
export type BookingWithRelations = Booking & {
  student: SafeUser;
  property: Property & {
    location: Location;
    landlord: SafeUser;
  };
};

// ── API Response shapes ───────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Search / filter params ────────────────────────────────
export interface PropertySearchParams {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  status?: PropertyStatus;
  page?: number;
  pageSize?: number;
  sortBy?: 'price' | 'createdAt' | 'distanceToCampus';
  sortOrder?: 'asc' | 'desc';
}

// ── Auth session user ────────────────────────────────────
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  verificationStatus: VerificationStatus;
}

// ── Form data types ──────────────────────────────────────
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  locationId: string;
  distanceToCampus?: number;
  amenities: string[];
  images: string[];
}

export interface BookingFormData {
  propertyId: string;
}
