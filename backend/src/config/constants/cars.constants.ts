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
  CAR_ID: "carId",
  STATUS: "status",
  PAID_AT: "paidAt",
  SUCCESS: "success",
  DATA: "data",
  MESSAGE: "message",
  ERROR: "error",
  BRAND: "brand",
  VEHICLE_MODEL: "vehicleModel",
  YEAR: "year",
  MILEAGE: "mileage",
  TRANSMISSION: "transmission",
  FUEL_TYPE: "fuelType",
  COLOR: "color",
  FEE_ID: "feeId",
  FEE_AMOUNT: "feeAmount",
  IS_EXPIRED: "isExpired",
  DAYS_UNTIL_EXPIRY: "daysUntilExpiry",
  FORMATTED_EXPIRY: "formattedExpiry",
  FOUND_BY_FALLBACK: "foundByFallback",
} as const;

export const ERROR_MESSAGES = {
  SERVER_ERROR: "Server Error",
  NOT_FOUND: "Car not found",
  INVALID_ID: "Invalid ID",
  MISSING_USER_ID: "Missing userId in request",
  CREATE_FAILED: "Failed to create car listing",
  UPDATE_FAILED: "Update failed",
  IS_PAID_MUST_BE_BOOLEAN: "isPaid must be boolean",
} as const;

export const SUCCESS_MESSAGES = {
  DELETED: "Car deleted successfully",
} as const;

export const CACHE_KEYS = {
  TOTAL: "cars:total",
  UNFILTERED: "cars:all:unfiltered",
  PAID_PREFIX: "cars:all:paid",
  DETAIL_PREFIX: "car:detail",
};


export const selectUserBasic = {
  select: {
    [FIELD_NAMES.ID]: true,
    [FIELD_NAMES.USERNAME]: true,
    [FIELD_NAMES.EMAIL]: true,
    [FIELD_NAMES.PHONE]: true,
    [FIELD_NAMES.PROFILE_IMAGE]: true,
    ownedBusinesses: {
      where: { isVerified: true, status: "active" },
      select: { name: true },
      take: 1,
    },
  },
};

export const selectUserMinimal = {
  select: {
    [FIELD_NAMES.USERNAME]: true,
  },
};

export const formatItem = (item: any) => ({
  [FIELD_NAMES.ID]: item[FIELD_NAMES.ID],
  [FIELD_NAMES.TITLE]: item[FIELD_NAMES.TITLE],
  [FIELD_NAMES.DESCRIPTION]: item[FIELD_NAMES.DESCRIPTION],
  [FIELD_NAMES.PRICE]: item[FIELD_NAMES.PRICE],
  [FIELD_NAMES.REGION]: item[FIELD_NAMES.REGION],
  [FIELD_NAMES.CITY]: item[FIELD_NAMES.CITY],
  [FIELD_NAMES.IMAGES]: item[FIELD_NAMES.IMAGES],
  [FIELD_NAMES.CREATED_AT]: item[FIELD_NAMES.CREATED_AT],
  [FIELD_NAMES.EXPIRY_DATE]: item[FIELD_NAMES.EXPIRY_DATE],
  [FIELD_NAMES.IS_PAID]: item[FIELD_NAMES.IS_PAID],
  [FIELD_NAMES.IS_BASIC_30]: item[FIELD_NAMES.IS_BASIC_30],
  [FIELD_NAMES.IS_STANDARD_60]: item[FIELD_NAMES.IS_STANDARD_60],
  [FIELD_NAMES.IS_PREMIUM_90]: item[FIELD_NAMES.IS_PREMIUM_90],
  [FIELD_NAMES.MA_GADAY]: item[FIELD_NAMES.MA_GADAY],
  [FIELD_NAMES.USER]: item[FIELD_NAMES.USER],
  sellerName:
    item[FIELD_NAMES.USER]?.ownedBusinesses?.[0]?.name ??
    item[FIELD_NAMES.USER]?.[FIELD_NAMES.USERNAME] ??
    null,
  [FIELD_NAMES.IS_EXPIRED]: isExpired(item[FIELD_NAMES.EXPIRY_DATE]),
  [FIELD_NAMES.STATUS]: isExpired(item[FIELD_NAMES.EXPIRY_DATE])
    ? LISTING_STATUS.EXPIRED
    : item[FIELD_NAMES.IS_PAID]
      ? LISTING_STATUS.ACTIVE
      : LISTING_STATUS.PENDING,
  [FIELD_NAMES.DAYS_UNTIL_EXPIRY]: getDaysUntilExpiry(
    item[FIELD_NAMES.EXPIRY_DATE],
  ),
  [FIELD_NAMES.FORMATTED_EXPIRY]: formatExpiryDate(
    item[FIELD_NAMES.EXPIRY_DATE],
  ),
});