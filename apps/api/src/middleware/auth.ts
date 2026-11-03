// ============================================
// PARIJAT API — Auth Middleware
// ============================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db/index';
import { config } from '../config/index';

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    phone: string;
    name: string | null;
    preferredLanguage: string;
  };
}

/**
 * Required authentication — rejects unauthenticated requests with 401.
 */
export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required', statusCode: 401 });
    }

    const payload = jwt.verify(token, config.jwt.secret) as { userId: string; sessionId: string };

    // Verify session exists and is not expired
    const session = await prisma.userSession.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Session expired', statusCode: 401 });
    }

    req.userId = session.user.id;
    req.user = {
      id: session.user.id,
      phone: session.user.phone,
      name: session.user.name,
      preferredLanguage: session.user.preferredLanguage,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token', statusCode: 401 });
  }
}

/**
 * Optional authentication — sets req.user if token is valid, but allows unauthenticated requests.
 */
export async function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    if (!token) return next();

    const payload = jwt.verify(token, config.jwt.secret) as { userId: string; sessionId: string };
    const session = await prisma.userSession.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    });

    if (session && session.expiresAt > new Date()) {
      req.userId = session.user.id;
      req.user = {
        id: session.user.id,
        phone: session.user.phone,
        name: session.user.name,
        preferredLanguage: session.user.preferredLanguage,
      };
    }
  } catch {
    // Silent — optional auth failure is fine
  }
  next();
}

function extractToken(req: Request): string | null {
  // Check Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  // Check cookie
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  return null;
}
