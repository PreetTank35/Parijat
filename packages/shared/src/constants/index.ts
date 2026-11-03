// ============================================
// PARIJAT — Constants & Reference Data
// ============================================
// Seed-friendly data for Maharashtra pilot demonstration.

import type { EquipmentCategoryCode, CropCategory, InputCategory } from '../enums';

/** Equipment category display data with emoji fallback icons */
export const EQUIPMENT_CATEGORIES: Array<{
  code: EquipmentCategoryCode;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  emoji: string;
}> = [
  { code: 'TRACTOR', nameEn: 'Tractor', nameMr: 'ट्रॅक्टर', nameHi: 'ट्रैक्टर', emoji: '🚜' },
  { code: 'ROTAVATOR', nameEn: 'Rotavator', nameMr: 'रोटाव्हेटर', nameHi: 'रोटावेटर', emoji: '⚙️' },
  { code: 'CULTIVATOR', nameEn: 'Cultivator', nameMr: 'कल्टिव्हेटर', nameHi: 'कल्टीवेटर', emoji: '🌱' },
  { code: 'HARVESTER', nameEn: 'Harvester', nameMr: 'हार्वेस्टर', nameHi: 'हार्वेस्टर', emoji: '🌾' },
  { code: 'WATER_PUMP', nameEn: 'Water Pump', nameMr: 'पाण्याचा पंप', nameHi: 'पानी का पंप', emoji: '💧' },
  { code: 'SPRAYER', nameEn: 'Sprayer', nameMr: 'फवारणी यंत्र', nameHi: 'स्प्रेयर', emoji: '🔫' },
  { code: 'SEED_DRILL', nameEn: 'Seed Drill', nameMr: 'बियाणे पेरणी यंत्र', nameHi: 'बीज बोने की मशीन', emoji: '🌰' },
  { code: 'THRESHER', nameEn: 'Thresher', nameMr: 'मळणी यंत्र', nameHi: 'थ्रेशर', emoji: '🏭' },
  { code: 'PLOUGH', nameEn: 'Plough', nameMr: 'नांगर', nameHi: 'हल', emoji: '🔧' },
  { code: 'TRAILER', nameEn: 'Trailer', nameMr: 'ट्रेलर', nameHi: 'ट्रेलर', emoji: '🚛' },
];

/** Crops relevant to Pune district / Maharashtra agriculture */
export const CROPS: Array<{
  code: string;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  emoji: string;
  category: CropCategory;
}> = [
  { code: 'WHEAT', nameEn: 'Wheat', nameMr: 'गहू', nameHi: 'गेहूँ', emoji: '🌾', category: 'CEREAL' },
  { code: 'RICE', nameEn: 'Rice', nameMr: 'तांदूळ', nameHi: 'चावल', emoji: '🍚', category: 'CEREAL' },
  { code: 'JOWAR', nameEn: 'Sorghum (Jowar)', nameMr: 'ज्वारी', nameHi: 'ज्वार', emoji: '🌿', category: 'CEREAL' },
  { code: 'BAJRA', nameEn: 'Pearl Millet (Bajra)', nameMr: 'बाजरी', nameHi: 'बाजरा', emoji: '🌿', category: 'CEREAL' },
  { code: 'SOYBEAN', nameEn: 'Soybean', nameMr: 'सोयाबीन', nameHi: 'सोयाबीन', emoji: '🫘', category: 'OILSEED' },
  { code: 'COTTON', nameEn: 'Cotton', nameMr: 'कापूस', nameHi: 'कपास', emoji: '☁️', category: 'CASH_CROP' },
  { code: 'SUGARCANE', nameEn: 'Sugarcane', nameMr: 'ऊस', nameHi: 'गन्ना', emoji: '🎋', category: 'CASH_CROP' },
  { code: 'ONION', nameEn: 'Onion', nameMr: 'कांदा', nameHi: 'प्याज़', emoji: '🧅', category: 'VEGETABLE' },
  { code: 'TOMATO', nameEn: 'Tomato', nameMr: 'टोमॅटो', nameHi: 'टमाटर', emoji: '🍅', category: 'VEGETABLE' },
  { code: 'TURMERIC', nameEn: 'Turmeric', nameMr: 'हळद', nameHi: 'हल्दी', emoji: '🟡', category: 'SPICE' },
  { code: 'GRAM', nameEn: 'Chickpea (Gram)', nameMr: 'हरभरा', nameHi: 'चना', emoji: '🫘', category: 'PULSE' },
  { code: 'TUR', nameEn: 'Pigeon Pea (Tur)', nameMr: 'तूर', nameHi: 'अरहर', emoji: '🫛', category: 'PULSE' },
];

/** Pilot villages in Pune district with approximate coordinates */
export const PILOT_VILLAGES: Array<{
  nameEn: string;
  nameMr: string;
  nameHi: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
}> = [
  {
    nameEn: 'Hinjewadi',
    nameMr: 'हिंजवडी',
    nameHi: 'हिंजेवाड़ी',
    taluka: 'Mulshi',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '411057',
    latitude: 18.5912,
    longitude: 73.7389,
  },
  {
    nameEn: 'Baramati',
    nameMr: 'बारामती',
    nameHi: 'बारामती',
    taluka: 'Baramati',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '413102',
    latitude: 18.1514,
    longitude: 74.5771,
  },
  {
    nameEn: 'Junnar',
    nameMr: 'जुन्नर',
    nameHi: 'जुन्नर',
    taluka: 'Junnar',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '410502',
    latitude: 19.2094,
    longitude: 73.8744,
  },
  {
    nameEn: 'Indapur',
    nameMr: 'इंदापूर',
    nameHi: 'इंदापुर',
    taluka: 'Indapur',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '413106',
    latitude: 18.1088,
    longitude: 75.0168,
  },
  {
    nameEn: 'Shirur',
    nameMr: 'शिरूर',
    nameHi: 'शिरूर',
    taluka: 'Shirur',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '412210',
    latitude: 18.8269,
    longitude: 74.3741,
  },
  {
    nameEn: 'Bhor',
    nameMr: 'भोर',
    nameHi: 'भोर',
    taluka: 'Bhor',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '412206',
    latitude: 18.1537,
    longitude: 73.8448,
  },
];

/** Mandis (agricultural markets) in Pune district */
export const PILOT_MARKETS: Array<{
  nameEn: string;
  nameMr: string;
  nameHi: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
}> = [
  { nameEn: 'Pune Market Yard', nameMr: 'पुणे मार्केट यार्ड', nameHi: 'पुणे मार्केट यार्ड', district: 'Pune', state: 'Maharashtra', latitude: 18.5015, longitude: 73.8689 },
  { nameEn: 'Baramati Mandi', nameMr: 'बारामती बाजार', nameHi: 'बारामती मंडी', district: 'Pune', state: 'Maharashtra', latitude: 18.1514, longitude: 74.5771 },
  { nameEn: 'Junnar Mandi', nameMr: 'जुन्नर बाजार', nameHi: 'जुन्नर मंडी', district: 'Pune', state: 'Maharashtra', latitude: 19.2094, longitude: 73.8744 },
  { nameEn: 'Indapur Mandi', nameMr: 'इंदापूर बाजार', nameHi: 'इंदापुर मंडी', district: 'Pune', state: 'Maharashtra', latitude: 18.1088, longitude: 75.0168 },
];

/** Farm input category display labels */
export const INPUT_CATEGORY_LABELS: Array<{
  category: InputCategory;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  emoji: string;
}> = [
  { category: 'SEEDS', nameEn: 'Seeds', nameMr: 'बियाणे', nameHi: 'बीज', emoji: '🌱' },
  { category: 'FERTILIZERS', nameEn: 'Fertilizers', nameMr: 'खते', nameHi: 'उर्वरक', emoji: '🧪' },
  { category: 'PESTICIDES', nameEn: 'Pesticides', nameMr: 'कीटकनाशके', nameHi: 'कीटनाशक', emoji: '🛡️' },
  { category: 'TOOLS', nameEn: 'Tools', nameMr: 'अवजारे', nameHi: 'औज़ार', emoji: '🔧' },
];

/**
 * Haversine distance between two lat/lng points in kilometres.
 * Used for "nearby equipment" search — simple enough for prototype,
 * designed as a clean abstraction for future PostGIS migration.
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Mask a phone number for privacy: "9876543210" → "98****3210"
 */
export function maskPhone(phone: string): string {
  if (phone.length < 10) return '****';
  return phone.slice(0, 2) + '****' + phone.slice(-4);
}
