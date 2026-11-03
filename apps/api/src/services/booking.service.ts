// ============================================
// PARIJAT API — Booking Service
// ============================================
// Handles booking lifecycle with conflict prevention,
// status transitions, and booking number generation.

import { v4 as uuid } from 'uuid';
import prisma from '../db/index';
import { AppError } from '../middleware/errorHandler';
import { VALID_BOOKING_TRANSITIONS, maskPhone } from '@parijat/shared';
import type { BookingStatus } from '@parijat/shared';

/**
 * Create a new booking request.
 * Validates: no self-booking, no date conflicts with accepted bookings.
 */
export async function createBooking(renterId: string, data: {
  listingId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}) {
  const listing = await prisma.equipmentListing.findUnique({
    where: { id: data.listingId },
    include: { category: true },
  });
  if (!listing) throw new AppError('Equipment not found', 404);
  if (listing.status !== 'ACTIVE') throw new AppError('Equipment is not available', 400);
  if (listing.ownerId === renterId) throw new AppError('Cannot book your own equipment', 400);

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  if (endDate <= startDate) throw new AppError('End date must be after start date', 400);

  // Check for conflicting accepted bookings
  const conflict = await prisma.equipmentBooking.findFirst({
    where: {
      listingId: data.listingId,
      status: { in: ['ACCEPTED'] },
      OR: [
        { startDate: { lte: endDate }, endDate: { gte: startDate } },
      ],
    },
  });
  if (conflict) {
    throw new AppError('Equipment is already booked for the selected dates', 409);
  }

  // Calculate total
  const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const totalUnits = listing.rentalUnit === 'HOURLY' ? days * 8 : days; // Assume 8-hour day for hourly
  const totalAmount = totalUnits * listing.rentalRate;

  // Generate booking number: BK-YYYYMMDD-XXXX
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const bookingNumber = `BK-${dateStr}-${uuid().slice(0, 4).toUpperCase()}`;

  const booking = await prisma.equipmentBooking.create({
    data: {
      bookingNumber,
      listingId: data.listingId,
      renterId,
      startDate,
      endDate,
      totalUnits,
      totalAmount,
      notes: data.notes || null,
      statusHistory: {
        create: {
          fromStatus: null,
          toStatus: 'REQUESTED',
          changedById: renterId,
        },
      },
    },
    include: {
      listing: { include: { category: true, images: true, owner: true } },
      renter: true,
    },
  });

  // Create notification for owner
  await prisma.notification.create({
    data: {
      userId: listing.ownerId,
      titleEn: 'New Booking Request',
      titleMr: 'नवीन भाडे विनंती',
      titleHi: 'नया बुकिंग अनुरोध',
      messageEn: `Someone wants to rent your ${listing.category.nameEn}`,
      messageMr: `कोणीतरी तुमच्या ${listing.category.nameMr} भाड्याने घेऊ इच्छितो`,
      messageHi: `कोई आपके ${listing.category.nameHi} को किराए पर लेना चाहता है`,
      type: 'BOOKING_REQUESTED',
      linkUrl: `/bookings/${booking.id}`,
    },
  });

  return formatBooking(booking);
}

/**
 * Update booking status with transition validation and conflict checks.
 */
export async function updateBookingStatus(
  bookingId: string,
  userId: string,
  newStatus: BookingStatus,
  reason?: string
) {
  const booking = await prisma.equipmentBooking.findUnique({
    where: { id: bookingId },
    include: {
      listing: { include: { owner: true, category: true, images: true } },
      renter: true,
    },
  });

  if (!booking) throw new AppError('Booking not found', 404);

  const currentStatus = booking.status as BookingStatus;

  // Validate transition
  const allowed = VALID_BOOKING_TRANSITIONS[currentStatus];
  if (!allowed.includes(newStatus)) {
    throw new AppError(`Cannot change status from ${currentStatus} to ${newStatus}`, 400);
  }

  // Authorization: Owner can accept/reject, renter can cancel, both can complete
  const isOwner = booking.listing.ownerId === userId;
  const isRenter = booking.renterId === userId;

  if (newStatus === 'ACCEPTED' || newStatus === 'REJECTED') {
    if (!isOwner) throw new AppError('Only the equipment owner can accept or reject', 403);
  }
  if (newStatus === 'CANCELLED' && !isOwner && !isRenter) {
    throw new AppError('Only booking participants can cancel', 403);
  }
  if (newStatus === 'COMPLETED' && !isOwner && !isRenter) {
    throw new AppError('Only booking participants can mark as completed', 403);
  }

  // Conflict check when accepting
  if (newStatus === 'ACCEPTED') {
    const conflict = await prisma.equipmentBooking.findFirst({
      where: {
        listingId: booking.listingId,
        id: { not: bookingId },
        status: 'ACCEPTED',
        OR: [
          { startDate: { lte: booking.endDate }, endDate: { gte: booking.startDate } },
        ],
      },
    });
    if (conflict) {
      throw new AppError('Another booking has already been accepted for overlapping dates', 409);
    }
  }

  // Update booking
  const updated = await prisma.equipmentBooking.update({
    where: { id: bookingId },
    data: {
      status: newStatus,
      paymentStatus: newStatus === 'ACCEPTED' ? 'PAID_MOCK' : undefined,
      statusHistory: {
        create: {
          fromStatus: currentStatus,
          toStatus: newStatus,
          changedById: userId,
          reason: reason || null,
        },
      },
    },
    include: {
      listing: { include: { category: true, images: true, owner: true } },
      renter: true,
      statusHistory: { orderBy: { timestamp: 'asc' }, include: { changedBy: true } },
    },
  });

  // Notify the other party
  const notifyUserId = isOwner ? booking.renterId : booking.listing.ownerId;
  const statusLabels: Record<string, { en: string; mr: string; hi: string }> = {
    ACCEPTED: { en: 'Booking Accepted', mr: 'भाडे मंजूर', hi: 'बुकिंग स्वीकृत' },
    REJECTED: { en: 'Booking Rejected', mr: 'भाडे नाकारले', hi: 'बुकिंग अस्वीकृत' },
    CANCELLED: { en: 'Booking Cancelled', mr: 'भाडे रद्द', hi: 'बुकिंग रद्द' },
    COMPLETED: { en: 'Booking Completed', mr: 'भाडे पूर्ण', hi: 'बुकिंग पूर्ण' },
  };

  const labels = statusLabels[newStatus] || { en: 'Booking Updated', mr: 'भाडे अपडेट', hi: 'बुकिंग अपडेट' };

  await prisma.notification.create({
    data: {
      userId: notifyUserId,
      titleEn: labels.en,
      titleMr: labels.mr,
      titleHi: labels.hi,
      messageEn: `Your ${booking.listing.category.nameEn} booking has been ${newStatus.toLowerCase()}`,
      messageMr: `तुमच्या ${booking.listing.category.nameMr} भाड्याची स्थिती: ${labels.mr}`,
      messageHi: `आपकी ${booking.listing.category.nameHi} बुकिंग: ${labels.hi}`,
      type: `BOOKING_${newStatus}` as any,
      linkUrl: `/bookings/${bookingId}`,
    },
  });

  return formatBooking(updated);
}

/**
 * Get bookings for a renter.
 */
export async function getRenterBookings(renterId: string) {
  const bookings = await prisma.equipmentBooking.findMany({
    where: { renterId },
    include: {
      listing: { include: { category: true, images: true, owner: true } },
      renter: true,
      statusHistory: { orderBy: { timestamp: 'asc' }, include: { changedBy: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return bookings.map(formatBooking);
}

/**
 * Get incoming bookings for an equipment owner.
 */
export async function getOwnerBookings(ownerId: string) {
  const bookings = await prisma.equipmentBooking.findMany({
    where: { listing: { ownerId } },
    include: {
      listing: { include: { category: true, images: true, owner: true } },
      renter: true,
      statusHistory: { orderBy: { timestamp: 'asc' }, include: { changedBy: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return bookings.map(formatBooking);
}

/**
 * Get a single booking by ID.
 */
export async function getBookingById(bookingId: string, userId: string) {
  const booking = await prisma.equipmentBooking.findUnique({
    where: { id: bookingId },
    include: {
      listing: { include: { category: true, images: true, owner: true } },
      renter: true,
      statusHistory: { orderBy: { timestamp: 'asc' }, include: { changedBy: true } },
    },
  });

  if (!booking) throw new AppError('Booking not found', 404);

  // Only participants can view
  if (booking.renterId !== userId && booking.listing.ownerId !== userId) {
    throw new AppError('Not authorized to view this booking', 403);
  }

  return formatBooking(booking);
}

function formatBooking(booking: any) {
  const isAccepted = booking.status === 'ACCEPTED' || booking.status === 'COMPLETED';

  return {
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    listing: {
      id: booking.listing.id,
      titleEn: booking.listing.titleEn,
      titleMr: booking.listing.titleMr,
      titleHi: booking.listing.titleHi,
      primaryImage: booking.listing.images?.[0]?.url || null,
      rentalRate: booking.listing.rentalRate,
      rentalUnit: booking.listing.rentalUnit,
      category: {
        id: booking.listing.category.id,
        code: booking.listing.category.code,
        nameEn: booking.listing.category.nameEn,
        nameMr: booking.listing.category.nameMr,
        nameHi: booking.listing.category.nameHi,
        iconUrl: booking.listing.category.iconUrl,
        emoji: booking.listing.category.emoji,
      },
    },
    renter: {
      id: booking.renter.id,
      name: booking.renter.name,
      maskedPhone: maskPhone(booking.renter.phone),
    },
    owner: {
      id: booking.listing.owner.id,
      name: booking.listing.owner.name,
      maskedPhone: maskPhone(booking.listing.owner.phone),
      // Reveal full phone only after acceptance
      ...(isAccepted && { phone: booking.listing.owner.phone }),
    },
    startDate: booking.startDate.toISOString(),
    endDate: booking.endDate.toISOString(),
    totalUnits: booking.totalUnits,
    totalAmount: booking.totalAmount,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    notes: booking.notes,
    statusHistory: booking.statusHistory?.map((h: any) => ({
      fromStatus: h.fromStatus,
      toStatus: h.toStatus,
      changedBy: h.changedBy?.name || 'System',
      reason: h.reason,
      timestamp: h.timestamp.toISOString(),
    })) || [],
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  };
}
