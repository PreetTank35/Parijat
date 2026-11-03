// ============================================
// PARIJAT API — Crop Price Service
// ============================================
// Dual-mode pricing: verified market data vs. transparent demo estimates.
// Designed for easy future integration with real data sources (e.g., AgriMarket API).

import prisma from '../db/index';
import { AppError } from '../middleware/errorHandler';

/**
 * Get all supported crops.
 */
export async function getCrops() {
  return prisma.crop.findMany({
    orderBy: { nameEn: 'asc' },
  });
}

/**
 * Get all markets/mandis.
 */
export async function getMarkets() {
  return prisma.market.findMany({
    orderBy: { nameEn: 'asc' },
  });
}

/**
 * Get market price observations with optional filters.
 */
export async function getMarketPrices(params: {
  cropId?: string;
  marketId?: string;
  fromDate?: string;
  toDate?: string;
}) {
  const where: any = {};
  if (params.cropId) where.cropId = params.cropId;
  if (params.marketId) where.marketId = params.marketId;
  if (params.fromDate || params.toDate) {
    where.date = {};
    if (params.fromDate) where.date.gte = new Date(params.fromDate);
    if (params.toDate) where.date.lte = new Date(params.toDate);
  }

  const observations = await prisma.marketPriceObservation.findMany({
    where,
    include: {
      crop: true,
      market: true,
    },
    orderBy: { date: 'desc' },
    take: 50,
  });

  return observations.map((obs) => ({
    id: obs.id,
    crop: {
      id: obs.crop.id,
      code: obs.crop.code,
      nameEn: obs.crop.nameEn,
      nameMr: obs.crop.nameMr,
      nameHi: obs.crop.nameHi,
      imageUrl: obs.crop.imageUrl,
      emoji: obs.crop.emoji,
      category: obs.crop.category,
    },
    market: {
      id: obs.market.id,
      nameEn: obs.market.nameEn,
      nameMr: obs.market.nameMr,
      nameHi: obs.market.nameHi,
      district: obs.market.district,
      state: obs.market.state,
    },
    date: obs.date.toISOString(),
    minPrice: obs.minPrice,
    maxPrice: obs.maxPrice,
    modalPrice: obs.modalPrice,
    unit: obs.unit,
    sourceName: obs.sourceName,
    isVerified: obs.isVerified,
  }));
}

/**
 * Generate a transparent demo price estimate.
 * Uses seeded market observations to calculate a simple average range.
 * Clearly labelled as a demonstration estimate — NOT a prediction or ML model.
 *
 * Future: Replace with authenticated market-price API or trained ML model.
 */
export async function generatePriceEstimate(params: {
  cropId: string;
  marketId?: string;
}) {
  const crop = await prisma.crop.findUnique({ where: { id: params.cropId } });
  if (!crop) throw new AppError('Crop not found', 404);

  let market = null;
  if (params.marketId) {
    market = await prisma.market.findUnique({ where: { id: params.marketId } });
  }

  // Fetch recent observations for this crop
  const where: any = { cropId: params.cropId };
  if (params.marketId) where.marketId = params.marketId;

  const observations = await prisma.marketPriceObservation.findMany({
    where,
    orderBy: { date: 'desc' },
    take: 10,
  });

  if (observations.length === 0) {
    return {
      cropId: crop.id,
      cropName: crop.nameEn,
      marketId: market?.id || null,
      marketName: market?.nameEn || null,
      estimatedMin: 0,
      estimatedMax: 0,
      estimatedModal: 0,
      unit: 'QUINTAL',
      confidence: 'NO_DATA',
      explanationEn: 'No market observations available for this crop. Check back when data from local mandis is collected.',
      explanationMr: 'या पिकासाठी बाजारभावाची माहिती उपलब्ध नाही. स्थानिक बाजारातून माहिती जमा झाल्यावर पुन्हा तपासा.',
      explanationHi: 'इस फसल के लिए बाजार भाव की जानकारी उपलब्ध नहीं है। स्थानीय मंडी से डेटा आने पर फिर से देखें।',
      isDemo: true,
      dataSource: 'No data available',
      generatedAt: new Date().toISOString(),
    };
  }

  // Simple statistical summary — honest and transparent
  const minPrices = observations.map((o) => o.minPrice);
  const maxPrices = observations.map((o) => o.maxPrice);
  const modalPrices = observations.map((o) => o.modalPrice);

  const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  const min = (arr: number[]) => Math.min(...arr);
  const max = (arr: number[]) => Math.max(...arr);

  const estimatedMin = avg(minPrices);
  const estimatedMax = avg(maxPrices);
  const estimatedModal = avg(modalPrices);

  const hasVerified = observations.some((o) => o.isVerified);
  const confidence = hasVerified
    ? observations.length >= 5
      ? 'MODERATE'
      : 'LOW'
    : 'DEMO';

  const observationCount = observations.length;
  const priceRange = `₹${min(minPrices)} – ₹${max(maxPrices)}`;

  return {
    cropId: crop.id,
    cropName: crop.nameEn,
    marketId: market?.id || null,
    marketName: market?.nameEn || null,
    estimatedMin,
    estimatedMax,
    estimatedModal,
    unit: 'QUINTAL',
    confidence,
    explanationEn: `Demo estimate based on ${observationCount} sample observation(s). Recent range: ${priceRange} per quintal. This is NOT a verified market rate — it is an illustrative demonstration using seed data. Always confirm at your local mandi.`,
    explanationMr: `${observationCount} नमुना निरीक्षणांवर आधारित अंदाज. अलीकडील श्रेणी: ${priceRange} प्रति क्विंटल. हा सत्यापित बाजारभाव नाही — हे बीज डेटा वापरून प्रात्यक्षिक आहे. नेहमी तुमच्या स्थानिक बाजारात खात्री करा.`,
    explanationHi: `${observationCount} नमूना अवलोकनों पर आधारित अनुमान। हालिया सीमा: ${priceRange} प्रति क्विंटल। यह सत्यापित बाजार दर नहीं है — यह बीज डेटा का उपयोग करके एक प्रदर्शन है। हमेशा अपनी स्थानीय मंडी में पुष्टि करें।`,
    isDemo: true,
    dataSource: `${observationCount} seed observations (demo data)`,
    generatedAt: new Date().toISOString(),
  };
}
