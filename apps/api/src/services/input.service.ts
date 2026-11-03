// ============================================
// PARIJAT API — Farm Input & Group Purchase Service
// ============================================

import prisma from '../db/index';
import { AppError } from '../middleware/errorHandler';

/**
 * Browse farm input products with optional category filter.
 */
export async function getInputProducts(params: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params.category) where.category = params.category;
  if (params.search) {
    where.OR = [
      { nameEn: { contains: params.search } },
      { nameMr: { contains: params.search } },
      { nameHi: { contains: params.search } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.farmInputProduct.findMany({
      where,
      include: {
        supplier: true,
        groupPurchases: {
          where: { status: 'OPEN' },
          include: { participants: true, village: true },
        },
      },
      skip,
      take: limit,
      orderBy: { nameEn: 'asc' },
    }),
    prisma.farmInputProduct.count({ where }),
  ]);

  return {
    data: products.map((p) => ({
      id: p.id,
      supplier: { id: p.supplier.id, name: p.supplier.name, village: p.supplier.village },
      category: p.category,
      nameEn: p.nameEn,
      nameMr: p.nameMr,
      nameHi: p.nameHi,
      packSize: p.packSize,
      price: p.price,
      mrp: p.mrp,
      imageUrl: p.imageUrl,
      inStock: p.inStock,
      activeGroupPurchases: p.groupPurchases.map((gp) => ({
        id: gp.id,
        villageName: gp.village.nameEn,
        targetQuantity: gp.targetQuantity,
        currentQuantity: gp.currentQuantity,
        unit: gp.unit,
        targetDate: gp.targetDate.toISOString(),
        discountPercent: gp.discountPercent,
        status: gp.status,
        participantCount: gp.participants.length,
      })),
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single product by ID.
 */
export async function getInputProductById(id: string) {
  const product = await prisma.farmInputProduct.findUnique({
    where: { id },
    include: {
      supplier: true,
      groupPurchases: {
        where: { status: { in: ['OPEN', 'TARGET_MET'] } },
        include: { participants: true, village: true },
      },
    },
  });

  if (!product) throw new AppError('Product not found', 404);
  return {
    id: product.id,
    supplier: { id: product.supplier.id, name: product.supplier.name, village: product.supplier.village },
    category: product.category,
    nameEn: product.nameEn,
    nameMr: product.nameMr,
    nameHi: product.nameHi,
    packSize: product.packSize,
    price: product.price,
    mrp: product.mrp,
    imageUrl: product.imageUrl,
    inStock: product.inStock,
    activeGroupPurchases: product.groupPurchases.map((gp) => ({
      id: gp.id,
      villageName: gp.village.nameEn,
      targetQuantity: gp.targetQuantity,
      currentQuantity: gp.currentQuantity,
      unit: gp.unit,
      targetDate: gp.targetDate.toISOString(),
      discountPercent: gp.discountPercent,
      status: gp.status,
      participantCount: gp.participants.length,
    })),
  };
}

/**
 * Create a group purchase request for a village.
 */
export async function createGroupPurchase(userId: string, data: {
  productId: string;
  villageId: string;
  targetQuantity: number;
  unit: string;
  targetDate: string;
}) {
  const product = await prisma.farmInputProduct.findUnique({ where: { id: data.productId } });
  if (!product) throw new AppError('Product not found', 404);

  const village = await prisma.village.findUnique({ where: { id: data.villageId } });
  if (!village) throw new AppError('Village not found', 404);

  const gp = await prisma.groupPurchaseRequest.create({
    data: {
      productId: data.productId,
      villageId: data.villageId,
      targetQuantity: data.targetQuantity,
      unit: data.unit,
      targetDate: new Date(data.targetDate),
      discountPercent: 10, // Default demo discount
    },
    include: { village: true, product: true },
  });

  return gp;
}

/**
 * Join an existing group purchase.
 */
export async function joinGroupPurchase(userId: string, groupPurchaseId: string, quantity: number) {
  const gp = await prisma.groupPurchaseRequest.findUnique({
    where: { id: groupPurchaseId },
    include: { participants: true },
  });

  if (!gp) throw new AppError('Group purchase not found', 404);
  if (gp.status !== 'OPEN') throw new AppError('Group purchase is no longer accepting participants', 400);

  // Check if already participating
  const existing = gp.participants.find((p) => p.userId === userId);
  if (existing) throw new AppError('Already participating in this group purchase', 400);

  const newQuantity = gp.currentQuantity + quantity;

  const [participant] = await Promise.all([
    prisma.groupPurchaseParticipant.create({
      data: {
        groupPurchaseId,
        userId,
        quantity,
      },
    }),
    prisma.groupPurchaseRequest.update({
      where: { id: groupPurchaseId },
      data: {
        currentQuantity: newQuantity,
        status: newQuantity >= gp.targetQuantity ? 'TARGET_MET' : 'OPEN',
      },
    }),
  ]);

  return participant;
}

/**
 * Get user's group purchase participations.
 */
export async function getUserGroupPurchases(userId: string) {
  const participations = await prisma.groupPurchaseParticipant.findMany({
    where: { userId },
    include: {
      groupPurchase: {
        include: {
          product: true,
          village: true,
          participants: true,
        },
      },
    },
    orderBy: { pledgedAt: 'desc' },
  });

  return participations.map((p) => ({
    id: p.groupPurchase.id,
    product: {
      id: p.groupPurchase.product.id,
      nameEn: p.groupPurchase.product.nameEn,
      nameMr: p.groupPurchase.product.nameMr,
      nameHi: p.groupPurchase.product.nameHi,
    },
    villageName: p.groupPurchase.village.nameEn,
    targetQuantity: p.groupPurchase.targetQuantity,
    currentQuantity: p.groupPurchase.currentQuantity,
    unit: p.groupPurchase.unit,
    targetDate: p.groupPurchase.targetDate.toISOString(),
    discountPercent: p.groupPurchase.discountPercent,
    status: p.groupPurchase.status,
    participantCount: p.groupPurchase.participants.length,
    myPledge: p.quantity,
  }));
}
