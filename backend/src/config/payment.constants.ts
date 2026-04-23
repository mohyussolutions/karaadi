import { ItemCategory } from "src/types/payment.types.ts";

export const PAYMENT_CACHE_TTL = 600
export const DEV_AUTO_SUCCEED_MS = 4_000
export const WAAFI_TIMEOUT_MS = 90_000
export const WAAFI_DEFAULT_URL = "https://api.waafipay.net/asm"

export function isWaafiApproved(result: any): boolean {
  const state: string | undefined = result?.params?.state
  const code = String(result?.responseCode ?? "")
  if (state) return state === "APPROVED"
  return code === "2001"
}

export function payRef(): string {
  return `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`
}

export function toAccountNo(phone: string): string {
  const clean = phone.replace(/\s/g, "")
  if (clean.startsWith("+252")) return clean.slice(4)
  if (clean.startsWith("252")) return clean.slice(3)
  return clean
}

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
