// ============================================
// PARIJAT API — Message Service
// ============================================

import prisma from '../db/index';
import { AppError } from '../middleware/errorHandler';

/**
 * Get all conversations for a user.
 */
export async function getUserConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ participant1Id: userId }, { participant2Id: userId }],
    },
    include: {
      participant1: true,
      participant2: true,
      listing: { include: { images: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return Promise.all(
    conversations.map(async (conv) => {
      const otherParticipant =
        conv.participant1Id === userId ? conv.participant2 : conv.participant1;

      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: userId },
          isRead: false,
        },
      });

      return {
        id: conv.id,
        otherParticipant: {
          id: otherParticipant.id,
          name: otherParticipant.name,
        },
        listing: conv.listing
          ? {
              id: conv.listing.id,
              titleEn: conv.listing.titleEn,
              titleMr: conv.listing.titleMr,
              primaryImage: conv.listing.images?.[0]?.url || null,
            }
          : null,
        lastMessage: conv.messages[0]?.text || null,
        lastMessageAt: conv.messages[0]?.createdAt?.toISOString() || null,
        unreadCount,
      };
    })
  );
}

/**
 * Create or get existing conversation.
 */
export async function createConversation(userId: string, participantId: string, listingId?: string) {
  if (userId === participantId) throw new AppError('Cannot message yourself', 400);

  // Check if conversation already exists
  const existing = await prisma.conversation.findFirst({
    where: {
      OR: [
        { participant1Id: userId, participant2Id: participantId, listingId: listingId || null },
        { participant1Id: participantId, participant2Id: userId, listingId: listingId || null },
      ],
    },
  });

  if (existing) return existing;

  return prisma.conversation.create({
    data: {
      participant1Id: userId,
      participant2Id: participantId,
      listingId: listingId || null,
    },
  });
}

/**
 * Get messages for a conversation.
 */
export async function getMessages(userId: string, conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) throw new AppError('Conversation not found', 404);
  if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
    throw new AppError('Not authorized', 403);
  }

  // Mark messages as read
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      isRead: false,
    },
    data: { isRead: true },
  });

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    take: 100,
  });

  return messages.map((m) => ({
    id: m.id,
    senderId: m.senderId,
    text: m.text,
    isRead: m.isRead,
    createdAt: m.createdAt.toISOString(),
  }));
}

/**
 * Send a message in a conversation.
 */
export async function sendMessage(userId: string, conversationId: string, text: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) throw new AppError('Conversation not found', 404);
  if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
    throw new AppError('Not authorized', 403);
  }

  const [message] = await Promise.all([
    prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        text,
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    }),
  ]);

  // Notify the other participant
  const recipientId =
    conversation.participant1Id === userId
      ? conversation.participant2Id
      : conversation.participant1Id;

  await prisma.notification.create({
    data: {
      userId: recipientId,
      titleEn: 'New Message',
      titleMr: 'नवीन संदेश',
      titleHi: 'नया संदेश',
      messageEn: text.slice(0, 100),
      messageMr: text.slice(0, 100),
      messageHi: text.slice(0, 100),
      type: 'NEW_MESSAGE',
      linkUrl: `/messages/${conversationId}`,
    },
  });

  return {
    id: message.id,
    senderId: message.senderId,
    text: message.text,
    isRead: message.isRead,
    createdAt: message.createdAt.toISOString(),
  };
}
