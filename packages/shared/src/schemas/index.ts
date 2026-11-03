// ============================================
// PARIJAT — Zod Validation Schemas
// ============================================
// Shared between API (server-side validation) and
// frontend (form validation via React Hook Form).

import { z } from 'zod';
import {
  LANGUAGES,
  RENTAL_UNITS,
  LISTING_STATUSES,
  BOOKING_STATUSES,
  PAYMENT_STATUSES,
  INPUT_CATEGORIES,
  EQUIPMENT_CATEGORY_CODES,
  NOTIFICATION_TYPES,
  GROUP_PURCHASE_STATUSES,
} from '../enums';

// ── Auth ─────────────────────────────────────

/** Indian mobile phone: 10 digits starting with 6-9 */
export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number');

export const requestOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/),
});

// ── Profile ──────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  preferredLanguage: z.enum(LANGUAGES).optional(),
  villageId: z.string().optional(),
});

// ── Equipment ────────────────────────────────

export const createEquipmentSchema = z.object({
  categoryCode: z.enum(EQUIPMENT_CATEGORY_CODES),
  titleEn: z.string().min(2).max(200),
  titleMr: z.string().min(2).max(200).optional(),
  titleHi: z.string().min(2).max(200).optional(),
  description: z.string().max(1000).optional(),
  rentalRate: z.number().positive().max(100000),
  rentalUnit: z.enum(RENTAL_UNITS),
  securityDeposit: z.number().min(0).max(500000).optional(),
  villageId: z.string(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  imageUrls: z.array(z.string().url()).min(1).max(5).optional(),
});

export const updateEquipmentSchema = z.object({
  titleEn: z.string().min(2).max(200).optional(),
  titleMr: z.string().min(2).max(200).optional(),
  titleHi: z.string().min(2).max(200).optional(),
  description: z.string().max(1000).optional(),
  rentalRate: z.number().positive().max(100000).optional(),
  rentalUnit: z.enum(RENTAL_UNITS).optional(),
  securityDeposit: z.number().min(0).max(500000).optional(),
  status: z.enum(LISTING_STATUSES).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const equipmentSearchSchema = z.object({
  categoryCode: z.enum(EQUIPMENT_CATEGORY_CODES).optional(),
  villageId: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  radiusKm: z.number().min(1).max(200).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

// ── Bookings ─────────────────────────────────

export const createBookingSchema = z.object({
  listingId: z.string(),
  startDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
  endDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
  notes: z.string().max(500).optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
  reason: z.string().max(500).optional(),
});

// ── Reviews ──────────────────────────────────

export const createReviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

// ── Prices ───────────────────────────────────

export const priceSearchSchema = z.object({
  cropId: z.string().optional(),
  marketId: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export const priceEstimateRequestSchema = z.object({
  cropId: z.string(),
  marketId: z.string().optional(),
});

// ── Farm Inputs ──────────────────────────────

export const inputSearchSchema = z.object({
  category: z.enum(INPUT_CATEGORIES).optional(),
  search: z.string().max(200).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

export const createGroupPurchaseSchema = z.object({
  productId: z.string(),
  villageId: z.string(),
  targetQuantity: z.number().positive(),
  unit: z.string().min(1).max(20),
  targetDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
});

export const joinGroupPurchaseSchema = z.object({
  quantity: z.number().positive(),
});

// ── Messaging ────────────────────────────────

export const createConversationSchema = z.object({
  participantId: z.string(),
  listingId: z.string().optional(),
});

export const sendMessageSchema = z.object({
  text: z.string().min(1).max(2000),
});
