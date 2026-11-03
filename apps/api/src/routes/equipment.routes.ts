// ============================================
// PARIJAT API — Equipment Routes
// ============================================

import { Router, Request, Response } from 'express';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import { createEquipmentSchema, updateEquipmentSchema, equipmentSearchSchema } from '@parijat/shared';
import * as equipmentService from '../services/equipment.service';

const router = Router();

/**
 * GET /api/v1/equipment/categories
 */
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await equipmentService.getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: 'Error', message: err.message, statusCode: 500 });
  }
});

/**
 * GET /api/v1/equipment/villages
 */
router.get('/villages', async (_req: Request, res: Response) => {
  try {
    const villages = await equipmentService.getVillages();
    res.json(villages);
  } catch (err: any) {
    res.status(500).json({ error: 'Error', message: err.message, statusCode: 500 });
  }
});

/**
 * GET /api/v1/equipment
 * Public — browse available equipment with optional filters.
 */
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const params = {
      categoryCode: req.query.categoryCode as string | undefined,
      villageId: req.query.villageId as string | undefined,
      latitude: req.query.latitude ? parseFloat(req.query.latitude as string) : undefined,
      longitude: req.query.longitude ? parseFloat(req.query.longitude as string) : undefined,
      radiusKm: req.query.radiusKm ? parseInt(req.query.radiusKm as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };
    const result = await equipmentService.searchEquipment(params);
    res.json({
      listings: result.data,
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Error', message: err.message, statusCode: 500 });
  }
});

/**
 * GET /api/v1/equipment/:id
 */
router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const listing = await equipmentService.getEquipmentById(req.params.id as string);
    res.json(listing);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

/**
 * POST /api/v1/equipment
 */
router.post('/', requireAuth, validateBody(createEquipmentSchema), async (req: AuthRequest, res: Response) => {
  try {
    const listing = await equipmentService.createEquipment(req.userId!, req.body);
    res.status(201).json(listing);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

/**
 * PATCH /api/v1/equipment/:id
 */
router.patch('/:id', requireAuth, validateBody(updateEquipmentSchema), async (req: AuthRequest, res: Response) => {
  try {
    const listing = await equipmentService.updateEquipment(req.params.id as string, req.userId!, req.body);
    res.json(listing);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

/**
 * DELETE /api/v1/equipment/:id
 */
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await equipmentService.deleteEquipment(req.params.id as string, req.userId!);
    res.json({ success: true, message: 'Equipment archived' });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

export default router;
