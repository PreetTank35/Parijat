// ============================================
// PARIJAT API — Review Routes
// ============================================

import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createReviewSchema } from '@parijat/shared';
import prisma from '../db/index';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /api/v1/reviews
 */
router.post('/', requireAuth, validateBody(createReviewSchema), async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.equipmentBooking.findUnique({
      where: { id: req.body.bookingId },
      include: { listing: true },
    });

    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.status !== 'COMPLETED') throw new AppError('Can only review completed bookings', 400);

    const isRenter = booking.renterId === req.userId!;
    const isOwner = booking.listing.ownerId === req.userId!;
    if (!isRenter && !isOwner) throw new AppError('Not authorized', 403);

    const revieweeId = isRenter ? booking.listing.ownerId : booking.renterId;

    const review = await prisma.review.create({
      data: {
        bookingId: req.body.bookingId,
        reviewerId: req.userId!,
        revieweeId,
        listingId: booking.listingId,
        rating: req.body.rating,
        comment: req.body.comment || null,
      },
      include: { reviewer: true },
    });

    res.status(201).json({
      id: review.id,
      reviewer: { id: review.reviewer.id, name: review.reviewer.name },
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
    });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

/**
 * GET /api/v1/equipment/:id/reviews
 */
router.get('/equipment/:id', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { listingId: req.params.id },
      include: { reviewer: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews.map((r) => ({
      id: r.id,
      reviewer: { id: r.reviewer.id, name: r.reviewer.name },
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    })));
  } catch (err: any) {
    res.status(500).json({ error: 'Error', message: err.message, statusCode: 500 });
  }
});

export default router;
