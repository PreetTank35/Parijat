// ============================================
// PARIJAT API — Auth Service
// ============================================
// Mock OTP provider for demo. Replace with real SMS provider
// (e.g., MSG91, Twilio) for production.

import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import prisma from '../db/index';
import { config } from '../config/index';
import { AppError } from '../middleware/errorHandler';

// ── In-memory OTP store (replace with Redis in production) ──
const otpStore = new Map<string, { otp: string; expiresAt: Date; attempts: number }>();

/**
 * OTP Provider Abstraction
 * Replace this with a real SMS gateway integration for production.
 */
interface OtpProvider {
  send(phone: string, otp: string): Promise<void>;
}

class MockOtpProvider implements OtpProvider {
  async send(phone: string, otp: string): Promise<void> {
    console.log(`[DEMO OTP] Phone: ${phone}, OTP: ${otp}`);
  }
}

const otpProvider: OtpProvider = new MockOtpProvider();

/**
 * Request an OTP for a phone number.
 */
export async function requestOtp(phone: string): Promise<{ success: boolean; demoOtp?: string }> {
  // Rate limit check
  const existing = otpStore.get(phone);
  if (existing && existing.attempts >= config.otp.maxAttempts) {
    const minutesLeft = Math.ceil((existing.expiresAt.getTime() - Date.now()) / 60000);
    if (minutesLeft > 0) {
      throw new AppError(`Too many attempts. Try again in ${minutesLeft} minutes.`, 429);
    }
  }

  // Generate OTP
  const otp = config.isDemo ? config.otp.demoCode : generateOtp();
  const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);

  otpStore.set(phone, { otp, expiresAt, attempts: 0 });

  // Send via provider
  await otpProvider.send(phone, otp);

  return {
    success: true,
    // In demo mode, return the OTP for convenience
    ...(config.isDemo && { demoOtp: otp }),
  };
}

/**
 * Verify OTP and create/return user session.
 */
export async function verifyOtp(
  phone: string,
  otp: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ token: string; user: any; isNewUser: boolean }> {
  const stored = otpStore.get(phone);
  if (!stored) {
    throw new AppError('No OTP requested for this number. Please request a new OTP.', 400);
  }

  if (stored.expiresAt < new Date()) {
    otpStore.delete(phone);
    throw new AppError('OTP expired. Please request a new one.', 400);
  }

  stored.attempts += 1;
  if (stored.attempts > config.otp.maxAttempts) {
    throw new AppError('Too many failed attempts. Please request a new OTP.', 429);
  }

  if (stored.otp !== otp) {
    throw new AppError('Incorrect OTP. Please try again.', 400);
  }

  // OTP verified — clean up
  otpStore.delete(phone);

  // Find or create user
  let isNewUser = false;
  let user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    isNewUser = true;
    user = await prisma.user.create({
      data: {
        phone,
        isVerified: true,
        preferredLanguage: 'mr', // Default Marathi for Maharashtra pilot
        farmerProfile: {
          create: {},
        },
      },
    });
  } else if (!user.isVerified) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });
  }

  // Create session
  const sessionId = uuid();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const token = jwt.sign({ userId: user.id, sessionId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  await prisma.userSession.create({
    data: {
      id: sessionId,
      userId: user.id,
      token,
      expiresAt,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    },
  });

  return {
    token,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      preferredLanguage: user.preferredLanguage,
      isVerified: user.isVerified,
      createdAt: user.createdAt.toISOString(),
    },
    isNewUser,
  };
}

/**
 * Logout — invalidate session.
 */
export async function logout(token: string): Promise<void> {
  try {
    const payload = jwt.verify(token, config.jwt.secret) as { sessionId: string };
    await prisma.userSession.delete({ where: { id: payload.sessionId } });
  } catch {
    // Session might already be expired/deleted — that's fine
  }
}

/**
 * Get current user profile.
 */
export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      farmerProfile: {
        include: { village: true },
      },
    },
  });

  if (!user) throw new AppError('User not found', 404);

  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    preferredLanguage: user.preferredLanguage,
    villageId: user.farmerProfile?.villageId || null,
    villageName: user.farmerProfile?.village?.nameEn || null,
    isVerified: user.isVerified,
    createdAt: user.createdAt.toISOString(),
  };
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
