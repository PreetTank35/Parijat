// ============================================
// PARIJAT API — Configuration
// ============================================

import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isDemo: process.env.DEMO_MODE === 'true',

  jwt: {
    secret: process.env.JWT_SECRET || 'parijat-dev-secret-change-in-production-2024',
    expiresIn: '7d',
  },

  otp: {
    expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10),
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10),
    demoCode: process.env.DEMO_OTP_CODE || '123456',
  },

  location: {
    defaultRadiusKm: parseInt(process.env.DEFAULT_SEARCH_RADIUS_KM || '25', 10),
    defaultLatitude: parseFloat(process.env.DEFAULT_LATITUDE || '18.5204'),
    defaultLongitude: parseFloat(process.env.DEFAULT_LONGITUDE || '73.8567'),
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  },
} as const;
