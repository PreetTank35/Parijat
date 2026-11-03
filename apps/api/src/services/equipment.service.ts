// ============================================
// PARIJAT API — Equipment Service
// ============================================

import prisma from '../db/index';
import { AppError } from '../middleware/errorHandler';
import { haversineDistanceKm, maskPhone } from '@parijat/shared';

/**
 * Get all equipment categories.
 */
export async function getCategories() {
  return prisma.equipmentCategory.findMany({
    orderBy: { nameEn: 'asc' },
  });
}

/**
 * Search equipment listings with optional filters and location-based sorting.
 */
export async function searchEquipment(params: {
  categoryCode?: string;
  villageId?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  page?: number;
  limit?: number;
}) {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {
    status: 'ACTIVE',
  };

  if (params.categoryCode) {
    const category = await prisma.equipmentCategory.findUnique({
      where: { code: params.categoryCode },
    });
    if (category) {
      where.categoryId = category.id;
    }
  }

  if (params.villageId) {
    where.villageId = params.villageId;
  }

  const [listings, total] = await Promise.all([
    prisma.equipmentListing.findMany({
      where,
      include: {
        owner: true,
        category: true,
        village: true,
        images: { orderBy: { sortOrder: 'asc' } },
        reviews: true,
        bookings: {
          where: { status: 'COMPLETED' },
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.equipmentListing.count({ where }),
  ]);

  // Calculate distances and format
  const data = listings.map((listing) => {
    let distanceKm: number | null = null;
    if (params.latitude && params.longitude && listing.latitude && listing.longitude) {
      distanceKm = haversineDistanceKm(
        params.latitude,
        params.longitude,
        listing.latitude,
        listing.longitude
      );
    }

    const ratings = listing.reviews.map((r) => r.rating);
    const avgRating = ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : null;

    return {
      id: listing.id,
      owner: {
        id: listing.owner.id,
        name: listing.owner.name,
        maskedPhone: maskPhone(listing.owner.phone),
        villageName: listing.village.nameEn,
      },
      category: {
        id: listing.category.id,
        code: listing.category.code,
        nameEn: listing.category.nameEn,
        nameMr: listing.category.nameMr,
        nameHi: listing.category.nameHi,
        iconUrl: listing.category.iconUrl,
        emoji: listing.category.emoji,
      },
      titleEn: listing.titleEn,
      titleMr: listing.titleMr,
      titleHi: listing.titleHi,
      description: listing.description,
      rentalRate: listing.rentalRate,
      rentalUnit: listing.rentalUnit,
      securityDeposit: listing.securityDeposit,
      villageName: listing.village.nameEn,
      distanceKm,
      latitude: listing.latitude,
      longitude: listing.longitude,
      images: listing.images.map((img) => ({
        id: img.id,
        url: img.url,
        isPrimary: img.isPrimary,
      })),
      avgRating,
      reviewCount: listing.reviews.length,
      status: listing.status,
      isAvailable: listing.status === 'ACTIVE',
      createdAt: listing.createdAt.toISOString(),
    };
  });

  // Filter by radius if location provided
  let filteredData = data;
  if (params.latitude && params.longitude && params.radiusKm) {
    filteredData = data.filter(
      (d) => d.distanceKm !== null && d.distanceKm <= params.radiusKm!
    );
  }

  // Sort by distance if available
  if (params.latitude && params.longitude) {
    filteredData.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
  }

  return {
    data: filteredData,
    total: filteredData.length,
    page,
    limit,
    totalPages: Math.ceil(filteredData.length / limit),
  };
}

/**
 * Get a single equipment listing by ID.
 */
export async function getEquipmentById(id: string) {
  const listing = await prisma.equipmentListing.findUnique({
    where: { id },
    include: {
      owner: true,
      category: true,
      village: true,
      images: { orderBy: { sortOrder: 'asc' } },
      reviews: {
        include: { reviewer: true },
        orderBy: { createdAt: 'desc' },
      },
      availability: {
        where: { endDate: { gte: new Date() } },
        orderBy: { startDate: 'asc' },
      },
    },
  });

  if (!listing) throw new AppError('Equipment not found', 404);

  const ratings = listing.reviews.map((r) => r.rating);
  const avgRating = ratings.length > 0
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : null;

  return {
    id: listing.id,
    owner: {
      id: listing.owner.id,
      name: listing.owner.name,
      maskedPhone: maskPhone(listing.owner.phone),
      villageName: listing.village.nameEn,
    },
    category: {
      id: listing.category.id,
      code: listing.category.code,
      nameEn: listing.category.nameEn,
      nameMr: listing.category.nameMr,
      nameHi: listing.category.nameHi,
      iconUrl: listing.category.iconUrl,
      emoji: listing.category.emoji,
    },
    titleEn: listing.titleEn,
    titleMr: listing.titleMr,
    titleHi: listing.titleHi,
    description: listing.description,
    rentalRate: listing.rentalRate,
    rentalUnit: listing.rentalUnit,
    securityDeposit: listing.securityDeposit,
    villageName: listing.village.nameEn,
    latitude: listing.latitude,
    longitude: listing.longitude,
    images: listing.images.map((img) => ({
      id: img.id,
      url: img.url,
      isPrimary: img.isPrimary,
    })),
    avgRating,
    reviewCount: listing.reviews.length,
    reviews: listing.reviews.map((r) => ({
      id: r.id,
      reviewer: { id: r.reviewer.id, name: r.reviewer.name },
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    })),
    availability: listing.availability.map((a) => ({
      id: a.id,
      startDate: a.startDate.toISOString(),
      endDate: a.endDate.toISOString(),
      status: a.status,
    })),
    status: listing.status,
    isAvailable: listing.status === 'ACTIVE',
    createdAt: listing.createdAt.toISOString(),
  };
}

/**
 * Create a new equipment listing.
 */
export async function createEquipment(ownerId: string, data: {
  categoryCode: string;
  titleEn: string;
  titleMr?: string;
  titleHi?: string;
  description?: string;
  rentalRate: number;
  rentalUnit: string;
  securityDeposit?: number;
  villageId: string;
  latitude?: number;
  longitude?: number;
  imageUrls?: string[];
}) {
  // Validate category
  const category = await prisma.equipmentCategory.findUnique({
    where: { code: data.categoryCode },
  });
  if (!category) throw new AppError('Invalid equipment category', 400);

  // Validate village
  const village = await prisma.village.findUnique({ where: { id: data.villageId } });
  if (!village) throw new AppError('Invalid village', 400);

  const listing = await prisma.equipmentListing.create({
    data: {
      ownerId,
      categoryId: category.id,
      villageId: data.villageId,
      titleEn: data.titleEn,
      titleMr: data.titleMr || null,
      titleHi: data.titleHi || null,
      description: data.description || null,
      rentalRate: data.rentalRate,
      rentalUnit: data.rentalUnit,
      securityDeposit: data.securityDeposit || null,
      latitude: data.latitude || village.latitude,
      longitude: data.longitude || village.longitude,
      images: data.imageUrls
        ? {
            create: data.imageUrls.map((url, i) => ({
              url,
              isPrimary: i === 0,
              sortOrder: i,
            })),
          }
        : undefined,
    },
    include: {
      category: true,
      village: true,
      images: true,
    },
  });

  // Update farmer profile
  await prisma.farmerProfile.upsert({
    where: { userId: ownerId },
    update: { isEquipmentOwner: true },
    create: { userId: ownerId, isEquipmentOwner: true, villageId: data.villageId },
  });

  return listing;
}

/**
 * Update an equipment listing (owner only).
 */
export async function updateEquipment(id: string, ownerId: string, data: {
  titleEn?: string;
  titleMr?: string;
  titleHi?: string;
  description?: string;
  rentalRate?: number;
  rentalUnit?: string;
  securityDeposit?: number;
  status?: string;
}) {
  const listing = await prisma.equipmentListing.findUnique({ where: { id } });
  if (!listing) throw new AppError('Equipment not found', 404);
  if (listing.ownerId !== ownerId) throw new AppError('Not authorized', 403);

  return prisma.equipmentListing.update({
    where: { id },
    data,
    include: { category: true, village: true, images: true },
  });
}

/**
 * Delete (archive) an equipment listing.
 */
export async function deleteEquipment(id: string, ownerId: string) {
  const listing = await prisma.equipmentListing.findUnique({ where: { id } });
  if (!listing) throw new AppError('Equipment not found', 404);
  if (listing.ownerId !== ownerId) throw new AppError('Not authorized', 403);

  return prisma.equipmentListing.update({
    where: { id },
    data: { status: 'ARCHIVED' },
  });
}

/**
 * Get villages for location selection.
 */
export async function getVillages() {
  return prisma.village.findMany({
    orderBy: { nameEn: 'asc' },
  });
}
