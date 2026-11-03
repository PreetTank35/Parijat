// ============================================
// PARIJAT — Shared TypeScript Types
// ============================================
// API request/response types consumed by both backend and frontend.

import type {
  Language,
  EquipmentCategoryCode,
  RentalUnit,
  ListingStatus,
  BookingStatus,
  PaymentStatus,
  InputCategory,
  GroupPurchaseStatus,
  NotificationType,
  CropCategory,
} from '../enums';

// ── Auth ─────────────────────────────────────

export interface RequestOtpRequest {
  phone: string;
}

export interface RequestOtpResponse {
  success: boolean;
  message: string;
  /** In demo mode, the OTP is returned for convenience */
  demoOtp?: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  isNewUser: boolean;
}

// ── User ─────────────────────────────────────

export interface UserProfile {
  id: string;
  phone: string;
  name: string | null;
  preferredLanguage: Language;
  villageId: string | null;
  villageName?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  preferredLanguage?: Language;
  villageId?: string;
}

// ── Equipment ────────────────────────────────

export interface EquipmentCategoryDTO {
  id: string;
  code: EquipmentCategoryCode;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  iconUrl: string | null;
  /** Emoji fallback for icon */
  emoji: string;
}

export interface EquipmentListingDTO {
  id: string;
  owner: {
    id: string;
    name: string | null;
    /** Masked phone: "98****1234" */
    maskedPhone: string;
    villageName: string | null;
  };
  category: EquipmentCategoryDTO;
  titleEn: string;
  titleMr: string | null;
  titleHi: string | null;
  description: string | null;
  rentalRate: number;
  rentalUnit: RentalUnit;
  securityDeposit: number | null;
  villageName: string;
  distanceKm: number | null;
  latitude: number | null;
  longitude: number | null;
  images: EquipmentImageDTO[];
  avgRating: number | null;
  reviewCount: number;
  status: ListingStatus;
  isAvailable: boolean;
  createdAt: string;
}

export interface EquipmentImageDTO {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface EquipmentSearchParams {
  categoryCode?: EquipmentCategoryCode;
  villageId?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Bookings ─────────────────────────────────

export interface BookingDTO {
  id: string;
  bookingNumber: string;
  listing: {
    id: string;
    titleEn: string;
    titleMr: string | null;
    titleHi: string | null;
    primaryImage: string | null;
    rentalRate: number;
    rentalUnit: RentalUnit;
    category: EquipmentCategoryDTO;
  };
  renter: {
    id: string;
    name: string | null;
    maskedPhone: string;
  };
  owner: {
    id: string;
    name: string | null;
    maskedPhone: string;
    /** Full phone revealed only after booking is accepted */
    phone?: string;
  };
  startDate: string;
  endDate: string;
  totalUnits: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes: string | null;
  statusHistory: BookingStatusHistoryDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingStatusHistoryDTO {
  fromStatus: string | null;
  toStatus: string;
  changedBy: string;
  reason: string | null;
  timestamp: string;
}

export interface CreateBookingRequest {
  listingId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
  reason?: string;
}

// ── Reviews ──────────────────────────────────

export interface ReviewDTO {
  id: string;
  reviewer: { id: string; name: string | null };
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface CreateReviewRequest {
  bookingId: string;
  rating: number;
  comment?: string;
}

// ── Crop Prices ──────────────────────────────

export interface CropDTO {
  id: string;
  code: string;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  imageUrl: string | null;
  emoji: string;
  category: CropCategory;
}

export interface MarketDTO {
  id: string;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  district: string;
  state: string;
}

export interface MarketPriceDTO {
  id: string;
  crop: CropDTO;
  market: MarketDTO;
  date: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  sourceName: string;
  isVerified: boolean;
}

export interface PriceEstimateDTO {
  cropId: string;
  cropName: string;
  marketId: string | null;
  marketName: string | null;
  estimatedMin: number;
  estimatedMax: number;
  estimatedModal: number;
  unit: string;
  confidence: string;
  explanationEn: string;
  explanationMr: string;
  explanationHi: string;
  isDemo: boolean;
  dataSource: string;
  generatedAt: string;
}

export interface PriceEstimateRequest {
  cropId: string;
  marketId?: string;
}

// ── Farm Inputs ──────────────────────────────

export interface FarmInputProductDTO {
  id: string;
  supplier: {
    id: string;
    name: string;
    village: string | null;
  };
  category: InputCategory;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  packSize: string;
  price: number;
  mrp: number | null;
  imageUrl: string | null;
  inStock: boolean;
  activeGroupPurchases: GroupPurchaseDTO[];
}

export interface GroupPurchaseDTO {
  id: string;
  product: {
    id: string;
    nameEn: string;
    nameMr: string;
    nameHi: string;
  };
  villageName: string;
  targetQuantity: number;
  currentQuantity: number;
  unit: string;
  targetDate: string;
  discountPercent: number | null;
  status: GroupPurchaseStatus;
  participantCount: number;
  myPledge: number | null;
}

// ── Messaging ────────────────────────────────

export interface ConversationDTO {
  id: string;
  otherParticipant: {
    id: string;
    name: string | null;
  };
  listing: {
    id: string;
    titleEn: string;
    titleMr: string | null;
    primaryImage: string | null;
  } | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface MessageDTO {
  id: string;
  senderId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

// ── Notifications ────────────────────────────

export interface NotificationDTO {
  id: string;
  titleEn: string;
  titleMr: string | null;
  titleHi: string | null;
  messageEn: string;
  messageMr: string | null;
  messageHi: string | null;
  type: NotificationType;
  isRead: boolean;
  linkUrl: string | null;
  createdAt: string;
}

// ── API Error ────────────────────────────────

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, string[]>;
}
