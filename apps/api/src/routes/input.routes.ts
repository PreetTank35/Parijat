// ============================================
// PARIJAT API — Farm Input & Group Purchase Routes
// ============================================

import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createGroupPurchaseSchema, joinGroupPurchaseSchema } from '@parijat/shared';
import * as inputService from '../services/input.service';

const router = Router();
export const groupPurchaseRouter = Router();

// --- Input Catalog Endpoints (/api/v1/inputs) ---

/** GET /api/v1/inputs */
router.get('/', async (req, res) => {
  try {
    const params = {
      category: req.query.category as string | undefined,
      search: req.query.search as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };
    const result = await inputService.getInputProducts(params);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Error', message: err.message, statusCode: 500 });
  }
});

/** GET /api/v1/inputs/:id */
router.get('/:id', async (req, res) => {
  try {
    const product = await inputService.getInputProductById(req.params.id);
    res.json(product);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

// --- Group Purchase Endpoints (/api/v1/group-purchases) ---

/** POST /api/v1/group-purchases */
groupPurchaseRouter.post('/', requireAuth, validateBody(createGroupPurchaseSchema), async (req: AuthRequest, res: Response) => {
  try {
    const gp = await inputService.createGroupPurchase(req.userId!, req.body);
    res.status(201).json(gp);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

/** GET /api/v1/group-purchases/mine */
groupPurchaseRouter.get('/mine', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const gps = await inputService.getUserGroupPurchases(req.userId!);
    res.json(gps);
  } catch (err: any) {
    res.status(500).json({ error: 'Error', message: err.message, statusCode: 500 });
  }
});

/** POST /api/v1/group-purchases/:id/join */
groupPurchaseRouter.post('/:id/join', requireAuth, validateBody(joinGroupPurchaseSchema), async (req: AuthRequest, res: Response) => {
  try {
    const result = await inputService.joinGroupPurchase(req.userId!, req.params.id as string, req.body.quantity);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

export default router;
