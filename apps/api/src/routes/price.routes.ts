// ============================================
// PARIJAT API — Crop Price Routes
// ============================================

import { Router, Request, Response } from 'express';
import { validateBody } from '../middleware/validate';
import { priceEstimateRequestSchema } from '@parijat/shared';
import * as priceService from '../services/price.service';

const router = Router();

/** GET /api/v1/crops */
router.get('/crops', async (_req: Request, res: Response) => {
  try {
    const crops = await priceService.getCrops();
    res.json(crops);
  } catch (err: any) {
    res.status(500).json({ error: 'Error', message: err.message, statusCode: 500 });
  }
});

/** GET /api/v1/markets */
router.get('/markets', async (_req: Request, res: Response) => {
  try {
    const markets = await priceService.getMarkets();
    res.json(markets);
  } catch (err: any) {
    res.status(500).json({ error: 'Error', message: err.message, statusCode: 500 });
  }
});

/** GET /api/v1/market-prices */
router.get('/market-prices', async (req: Request, res: Response) => {
  try {
    const params = {
      cropId: req.query.cropId as string | undefined,
      marketId: req.query.marketId as string | undefined,
      fromDate: req.query.fromDate as string | undefined,
      toDate: req.query.toDate as string | undefined,
    };
    const prices = await priceService.getMarketPrices(params);
    res.json(prices);
  } catch (err: any) {
    res.status(500).json({ error: 'Error', message: err.message, statusCode: 500 });
  }
});

/** POST /api/v1/price-estimates */
router.post('/price-estimates', validateBody(priceEstimateRequestSchema), async (req: Request, res: Response) => {
  try {
    const estimate = await priceService.generatePriceEstimate(req.body);
    res.json(estimate);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

export default router;
