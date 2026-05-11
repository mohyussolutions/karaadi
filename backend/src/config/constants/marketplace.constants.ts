import { isExpired, getDaysUntilExpiry, formatExpiryDate } from "src/hooks/useExpire.ts";
import { LISTING_STATUS } from "src/config/shared.constants.ts";
export const FIELD_NAMES = {
  ID: "id",
  TITLE: "title",
  PRICE: "price",
  DESCRIPTION: "description",
  MAIN_CATEGORY: "mainCategory",
  CATEGORY: "category",
  SUBCATEGORY: "subcategory",
  REGION: "region",
  CITY: "city",
  IMAGES: "images",
  CREATED_AT: "createdAt",
  EXPIRY_DATE: "expiryDate",
  IS_PAID: "isPaid",
  IS_BASIC_30: "isBasic30",
  IS_STANDARD_60: "isStandard60",
  IS_PREMIUM_90: "isPremium90",
  MA_GADAY: "maGaday",
  USER: "user",
  FEE: "fee",
  PLAN: "plan",
  USERNAME: "username",
  EMAIL: "email",
  PHONE: "phone",
  PROFILE_IMAGE: "profileImage",
  USER_ID: "userId",
  PLAN_ID: "planId",
  PLAN_AMOUNT: "planAmount",
  MARKETPLACE_ID: "marketplaceId",
  STATUS: "status",
  PAID_AT: "paidAt",
  SUCCESS: "success",
  DATA: "data",
  MESSAGE: "message",
  ERROR: "error",
  FOUND_BY_FALLBACK: "foundByFallback",
  SO: "so",
  EXTRA: "extra",
} as const;

export const ERROR_MESSAGES = {
  SERVER_ERROR: "Server Error",
  ITEM_NOT_FOUND: "Item not found",
  INVALID_DATA: "Invalid data",
  UPDATE_FAILED: "Update failed",
} as const;

export const SUCCESS_MESSAGES = {
  DELETED: "Item deleted successfully",
} as const;

export const CACHE_KEYS = {
  ALL_ADMIN: "marketplace:admin:all",
  TOTAL: "marketplace:total",
  PAID_TOTAL: "marketplace:paid:total",
  UNPAID_TOTAL: "marketplace:unpaid:total",
  ALL_PAID: () => `marketplace:all:v2`,
  DETAIL: (id: string) => `marketplace:detail:${id}`,
};


export const selectUserBasic = {
  select: {
    [FIELD_NAMES.ID]: true,
    [FIELD_NAMES.USERNAME]: true,
    [FIELD_NAMES.EMAIL]: true,
    [FIELD_NAMES.PHONE]: true,
    [FIELD_NAMES.PROFILE_IMAGE]: true,
  },
};

export const formatItem = (item: any) => ({
  ...item,
  isExpired: isExpired(item[FIELD_NAMES.EXPIRY_DATE]),
  [FIELD_NAMES.STATUS]: isExpired(item[FIELD_NAMES.EXPIRY_DATE])
    ? LISTING_STATUS.EXPIRED
    : item[FIELD_NAMES.IS_PAID]
      ? LISTING_STATUS.ACTIVE
      : LISTING_STATUS.PENDING,
  daysUntilExpiry: getDaysUntilExpiry(item[FIELD_NAMES.EXPIRY_DATE]),
  formattedExpiry: formatExpiryDate(item[FIELD_NAMES.EXPIRY_DATE]),
});