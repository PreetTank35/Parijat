// ============================================
// PARIJAT — Shared Enumerations
// ============================================
// Used across API and frontend for type-safe status values,
// equipment categories, rental units, and more.

/** Supported interface languages */
export const LANGUAGES = ['mr', 'hi', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

/** Equipment category codes with corresponding visual icons */
export const EQUIPMENT_CATEGORY_CODES = [
  'TRACTOR',
  'ROTAVATOR',
  'CULTIVATOR',
  'HARVESTER',
  'WATER_PUMP',
  'SPRAYER',
  'SEED_DRILL',
  'THRESHER',
  'PLOUGH',
  'TRAILER',
] as const;
export type EquipmentCategoryCode = (typeof EQUIPMENT_CATEGORY_CODES)[number];

/** Rental pricing unit */
export const RENTAL_UNITS = ['HOURLY', 'DAILY'] as const;
export type RentalUnit = (typeof RENTAL_UNITS)[number];

/** Equipment listing status (owner-controlled) */
export const LISTING_STATUSES = ['ACTIVE', 'PAUSED', 'ARCHIVED'] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

/** Booking lifecycle states */
export const BOOKING_STATUSES = [
  'REQUESTED',
  'ACCEPTED',
  'REJECTED',
  'CANCELLED',
  'COMPLETED',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

/** Valid booking status transitions */
export const VALID_BOOKING_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  REQUESTED: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['COMPLETED', 'CANCELLED'],
  REJECTED: [],
  CANCELLED: [],
  COMPLETED: [],
};

/** Mock payment states */
export const PAYMENT_STATUSES = ['PENDING', 'PAID_MOCK', 'REFUNDED'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/** Price observation unit */
export const PRICE_UNITS = ['QUINTAL', 'KG', 'TON'] as const;
export type PriceUnit = (typeof PRICE_UNITS)[number];

/** Farm input product categories */
export const INPUT_CATEGORIES = ['SEEDS', 'FERTILIZERS', 'PESTICIDES', 'TOOLS'] as const;
export type InputCategory = (typeof INPUT_CATEGORIES)[number];

/** Group purchase lifecycle */
export const GROUP_PURCHASE_STATUSES = [
  'OPEN',
  'TARGET_MET',
  'ORDERED',
  'DELIVERED',
  'CANCELLED',
] as const;
export type GroupPurchaseStatus = (typeof GROUP_PURCHASE_STATUSES)[number];

/** Notification types */
export const NOTIFICATION_TYPES = [
  'BOOKING_REQUESTED',
  'BOOKING_ACCEPTED',
  'BOOKING_REJECTED',
  'BOOKING_CANCELLED',
  'BOOKING_COMPLETED',
  'NEW_MESSAGE',
  'REVIEW_RECEIVED',
  'GROUP_PURCHASE_UPDATE',
  'PRICE_ALERT',
  'SYSTEM',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

/** Crop categories for visual grouping */
export const CROP_CATEGORIES = ['CEREAL', 'PULSE', 'OILSEED', 'VEGETABLE', 'FRUIT', 'CASH_CROP', 'SPICE'] as const;
export type CropCategory = (typeof CROP_CATEGORIES)[number];

/** Availability slot status */
export const AVAILABILITY_STATUSES = ['AVAILABLE', 'BLOCKED', 'BOOKED'] as const;
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];
