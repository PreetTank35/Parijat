// ============================================
// PARIJAT API — Validation Middleware
// ============================================

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validate request body against a Zod schema.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details: Record<string, string[]> = {};
        err.errors.forEach((e) => {
          const path = e.path.join('.') || 'body';
          if (!details[path]) details[path] = [];
          details[path].push(e.message);
        });
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid request data',
          statusCode: 400,
          details,
        });
      }
      next(err);
    }
  };
}

/**
 * Validate request query against a Zod schema.
 * Coerces string values to numbers where the schema expects them.
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Coerce numeric query params
      const coerced: Record<string, unknown> = { ...req.query };
      for (const [key, value] of Object.entries(coerced)) {
        if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value)) {
          coerced[key] = parseFloat(value);
        }
      }
      req.query = schema.parse(coerced) as any;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid query parameters',
          statusCode: 400,
          details: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        });
      }
      next(err);
    }
  };
}
