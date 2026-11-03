// ============================================
// PARIJAT API — Booking Routes
// ============================================

import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createBookingSchema, updateBookingStatusSchema } from '@parijat/shared';
import * as bookingService from '../services/booking.service';

const router = Router();

/**
 * POST /api/v1/bookings
 */
router.post('/', requireAuth, validateBody(createBookingSchema), async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.createBooking(req.userId!, req.body);
    res.status(201).json(booking);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

/**
 * GET /api/v1/bookings/mine
 */
router.get('/mine', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await bookingService.getRenterBookings(req.userId!);
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: 'Error', message: err.message, statusCode: 500 });
  }
});

/**
 * GET /api/v1/bookings/incoming
 */
router.get('/incoming', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await bookingService.getOwnerBookings(req.userId!);
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: 'Error', message: err.message, statusCode: 500 });
  }
});

/**
 * GET /api/v1/bookings/:id
 */
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const booking = await bookingService.getBookingById(id, req.userId!);
    res.json(booking);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

/**
 * PATCH /api/v1/bookings/:id/status
 */
router.patch('/:id/status', requireAuth, validateBody(updateBookingStatusSchema), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const booking = await bookingService.updateBookingStatus(
      id,
      req.userId!,
      req.body.status,
      req.body.reason
    );
    res.json(booking);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

export default router;
