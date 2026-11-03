// ============================================
// PARIJAT API — Notification Routes
// ============================================

import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import * as notificationService from '../services/notification.service';

const router = Router();

/**
 * GET /api/v1/notifications
 */
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await notificationService.getNotifications(req.userId!);
    res.json(notifications);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

/**
 * PATCH /api/v1/notifications/:id/read
 */
router.patch('/:id/read', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id as string, req.userId!);
    res.json(notification);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

export default router;
