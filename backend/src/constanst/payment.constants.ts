import { ItemCategory } from "../types/payment.ts";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

export const WaaFiConfig = {
  baseUrl: process.env.WAAFIPAY_PRODUCTION_URL || "",
  credentials: {
    apiKey: process.env.WAAFIPAY_API_KEY || "",
    merchantUid: process.env.WAAFIPAY_MERCHANT_UID || "",
    apiUserId: process.env.WAAFIPAY_API_USER_ID || "",
  },
  defaults: {
    currency: "USD",
    paymentMethod: "MWALLET_ACCOUNT",
  },
} as const;

export const MODEL_MAP: Record<ItemCategory, string> = {
  [ItemCategory.CAR]: "car",
  [ItemCategory.BOAT]: "boat",
  [ItemCategory.REAL_ESTATE]: "realEstate",
  [ItemCategory.MOTORCYCLE]: "motorcycle",
  [ItemCategory.TRAKTOR]: "traktor",
  [ItemCategory.MARKETPLACE]: "marketplace",
  [ItemCategory.SUBSCRIPTION]: "subscription",
} as const;

export const CATEGORY_FIELD_MAP: Record<ItemCategory, string> = {
  [ItemCategory.CAR]: "carId",
  [ItemCategory.BOAT]: "boatId",
  [ItemCategory.REAL_ESTATE]: "realEstateId",
  [ItemCategory.MOTORCYCLE]: "motorcycleId",
  [ItemCategory.TRAKTOR]: "traktorId",
  [ItemCategory.MARKETPLACE]: "marketplaceId",
  [ItemCategory.SUBSCRIPTION]: "subscriptionId",
} as const;
