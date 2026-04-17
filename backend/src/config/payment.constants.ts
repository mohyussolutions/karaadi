import { ItemCategory } from "src/types/payment.types.ts";

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
  [ItemCategory.MARKETPLACE]: "marketplace",
  [ItemCategory.FARMEQUIPMENT]: "farmequipment",
  [ItemCategory.JOB]: "job",
} as const;

export const CATEGORY_FIELD_MAP: Record<ItemCategory, string> = {
  [ItemCategory.CAR]: "carId",
  [ItemCategory.BOAT]: "boatId",
  [ItemCategory.REAL_ESTATE]: "realEstateId",
  [ItemCategory.MOTORCYCLE]: "motorcycleId",
  [ItemCategory.MARKETPLACE]: "marketplaceId",
  [ItemCategory.FARMEQUIPMENT]: "farmequipmentId",
  [ItemCategory.JOB]: "jobId",
} as const;

export const EXPIRY_CONFIG = {
  BASIC_DAYS: 30,
  STANDARD_DAYS: 60,
  PREMIUM_DAYS: 90,
  A_DAY: 24 * 60 * 60 * 1000,
};

export const EXPIRY_MESSAGES = {
  NO_EXPIRY: "No expiry",
};

export const EXPIRY_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  PENDING: "pending",
};
