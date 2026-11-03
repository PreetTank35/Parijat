// ============================================
// PARIJAT API — Message Routes
// ============================================

import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import * as messageService from '../services/message.service';

const router = Router();

/**
 * GET /api/v1/conversations
 */
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await messageService.getUserConversations(req.userId!);
    res.json(conversations);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

/**
 * POST /api/v1/conversations
 */
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { participantId, listingId } = req.body;
    if (!participantId) {
      res.status(400).json({ error: 'ValidationError', message: 'participantId is required', statusCode: 400 });
      return;
    }
    const conv = await messageService.createConversation(req.userId!, participantId, listingId);
    res.status(201).json(conv);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

/**
 * GET /api/v1/conversations/:id/messages
 */
router.get('/:id/messages', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await messageService.getMessages(req.userId!, req.params.id as string);
    res.json(messages);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

/**
 * POST /api/v1/conversations/:id/messages
 */
router.post('/:id/messages', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'ValidationError', message: 'text is required', statusCode: 400 });
      return;
    }
    const message = await messageService.sendMessage(req.userId!, req.params.id as string, text.trim());
    res.status(201).json(message);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: 'Error', message: err.message, statusCode: err.statusCode || 500 });
  }
});

export default router;
