// ============================================
// PARIJAT API — User/Profile Routes
// ============================================

import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { updateProfileSchema } from '@parijat/shared';
import prisma from '../db/index';
import * as authService from '../services/auth.service';

const router = Router();

/**
 * GET /api/v1/users/me
 */
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.getCurrentUser(req.userId!);
    res.json(user);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

/**
 * PATCH /api/v1/users/me
 */
router.patch('/me', requireAuth, validateBody(updateProfileSchema), async (req: AuthRequest, res: Response) => {
  try {
    const data: any = {};
    if (req.body.name) data.name = req.body.name;
    if (req.body.preferredLanguage) data.preferredLanguage = req.body.preferredLanguage;

    const user = await prisma.user.update({
      where: { id: req.userId! },
      data,
    });

    if (req.body.villageId) {
      await prisma.farmerProfile.upsert({
        where: { userId: req.userId! },
        update: { villageId: req.body.villageId },
        create: { userId: req.userId!, villageId: req.body.villageId },
      });
    }

    const profile = await authService.getCurrentUser(req.userId!);
    res.json(profile);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

export default router;
