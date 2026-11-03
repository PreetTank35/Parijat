// ============================================
// PARIJAT API — Auth Routes
// ============================================

import { Router, Request, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { requestOtpSchema, verifyOtpSchema } from '@parijat/shared';
import * as authService from '../services/auth.service';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit OTP requests: 5 per 15 minutes per IP
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too Many Requests', message: 'Please wait before requesting another OTP', statusCode: 429 },
});

/**
 * POST /api/v1/auth/request-otp
 * Request OTP for phone authentication
 */
router.post('/request-otp', otpLimiter, validateBody(requestOtpSchema), async (req: Request, res: Response) => {
  try {
    const result = await authService.requestOtp(req.body.phone);
    res.json({
      success: true,
      message: 'OTP sent successfully',
      ...(result.demoOtp && { demoOtp: result.demoOtp, demoCode: result.demoOtp }),
    });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      error: 'Error',
      message: err.message,
      statusCode: err.statusCode || 500,
    });
  }
});

/**
 * POST /api/v1/auth/verify-otp
 * Verify OTP and get auth token
 */
router.post('/verify-otp', validateBody(verifyOtpSchema), async (req: Request, res: Response) => {
  try {
    const result = await authService.verifyOtp(
      req.body.phone,
      req.body.otp,
      req.ip,
      req.headers['user-agent']
    );

    // Set token as httpOnly cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json(result);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      error: 'Error',
      message: err.message,
      statusCode: err.statusCode || 500,
    });
  }
});

/**
 * POST /api/v1/auth/logout
 * Invalidate session
 */
router.post('/logout', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.slice(7) || req.cookies?.token;
    if (token) await authService.logout(token);
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out' });
  } catch (err: any) {
    res.status(500).json({ error: 'Error', message: err.message, statusCode: 500 });
  }
});

/**
 * GET /api/v1/auth/me
 * Get current authenticated user
 */
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.getCurrentUser(req.userId!);
    res.json(user);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      error: 'Error',
      message: err.message,
      statusCode: err.statusCode || 500,
    });
  }
});

export default router;
