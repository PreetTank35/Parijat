// ============================================
// PARIJAT API — Notification Service
// ============================================

import prisma from '../db/index';
import { AppError } from '../middleware/errorHandler';

/**
 * Get notifications for a user.
 */
export async function getNotifications(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return notifications.map((n) => ({
    id: n.id,
    titleEn: n.titleEn,
    titleMr: n.titleMr,
    titleHi: n.titleHi,
    messageEn: n.messageEn,
    messageMr: n.messageMr,
    messageHi: n.messageHi,
    type: n.type,
    isRead: n.isRead,
    linkUrl: n.linkUrl,
    createdAt: n.createdAt.toISOString(),
  }));
}

/**
 * Mark a notification as read.
 */
export async function markAsRead(notificationId: string, userId: string) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) throw new AppError('Notification not found', 404);
  if (notification.userId !== userId) throw new AppError('Not authorized', 403);

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}
