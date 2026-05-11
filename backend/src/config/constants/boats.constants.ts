import prisma from "src/core/utils/db.ts";
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
  BOAT_ID: "boatId",
  STATUS: "status",
  PAID_AT: "paidAt",
  SUCCESS: "success",
  DATA: "data",
  MESSAGE: "message",
  ERROR: "error",
  TYPE: "type",
  BOAT_MODEL: "boatModel",
  TRANSMISSION: "transmission",
  COLOR: "color",
  FEE_ID: "feeId",
  FEE_AMOUNT: "feeAmount",
  IS_EXPIRED: "isExpired",
  DAYS_UNTIL_EXPIRY: "daysUntilExpiry",
  FORMATTED_EXPIRY: "formattedExpiry",
  SELECTED_PLAN: "selectedPlan",
  NAME: "name",
  DURATION: "duration",
  DETAILS: "details",
  COUNT: "count",
} as const;

export const ERROR_MESSAGES = {
  SERVER_ERROR: "Server Error",
  NOT_FOUND: "Boat not found",
  INVALID_ID: "Invalid ID",
  USER_ID_REQUIRED: "User ID required",
  CREATE_FAILED: "Failed to create boat listing",
  UPDATE_FAILED: "Update failed",
  IS_PAID_MUST_BE_BOOLEAN: "isPaid must be boolean",
} as const;

export const SUCCESS_MESSAGES = {
  DELETED: "Boat deleted successfully",
} as const;

export const DEFAULT_VALUES = {
  MAIN_CATEGORY: "Boats",
  PRICE: 0,
  FEE_AMOUNT: 0,
  PLAN_AMOUNT: 0,
} as const;

export const CACHE_KEYS = {
  ALL_ADMIN: "boats:admin:all",
  TOTAL: "boats:total",
  PAID_TOTAL: "boats:paid:total",
  UNPAID_TOTAL: "boats:unpaid:total",
  ALL_PAID: (page: number, limit: number) =>
    `boats:paid:page:${page}:limit:${limit}`,
  DETAIL: (id: string) => `boat:detail:${id}`,
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

export const selectUserMinimal = {
  select: {
    [FIELD_NAMES.USERNAME]: true,
  },
};

export const boatInclude = {
  [FIELD_NAMES.USER]: selectUserBasic,
  [FIELD_NAMES.FEE]: true,
  [FIELD_NAMES.PLAN]: true,
};

export const ensureSingleString = (id: any): string => {
  return Array.isArray(id) ? id[0] : id || "";
};

export const formatBoat = (boat: any) => {
  if (!boat) return null;

  const expired = isExpired(boat[FIELD_NAMES.EXPIRY_DATE]);

  if (expired && boat[FIELD_NAMES.IS_PAID]) {
    prisma.boat
      .update({
        where: { [FIELD_NAMES.ID]: boat[FIELD_NAMES.ID] },
        data: { [FIELD_NAMES.IS_PAID]: false },
      })
      .catch(() => {});
    boat[FIELD_NAMES.IS_PAID] = false;
  }

  let planName = "Basic 30 Days";
  if (boat[FIELD_NAMES.PLAN]) {
    if (boat[FIELD_NAMES.PLAN_AMOUNT] === boat[FIELD_NAMES.PLAN].premium90)
      planName = "Premium 90 Days";
    else if (
      boat[FIELD_NAMES.PLAN_AMOUNT] === boat[FIELD_NAMES.PLAN].standard60
    )
      planName = "Standard 60 Days";
  }

  return {
    ...boat,
    [FIELD_NAMES.IS_EXPIRED]: expired,
    [FIELD_NAMES.STATUS]: expired
      ? LISTING_STATUS.EXPIRED
      : boat[FIELD_NAMES.IS_PAID]
        ? LISTING_STATUS.ACTIVE
        : LISTING_STATUS.PENDING,
    [FIELD_NAMES.DAYS_UNTIL_EXPIRY]: getDaysUntilExpiry(
      boat[FIELD_NAMES.EXPIRY_DATE],
    ),
    [FIELD_NAMES.FORMATTED_EXPIRY]: formatExpiryDate(
      boat[FIELD_NAMES.EXPIRY_DATE],
    ),
    [FIELD_NAMES.SELECTED_PLAN]: boat[FIELD_NAMES.PLAN]
      ? {
          [FIELD_NAMES.NAME]: planName,
          [FIELD_NAMES.DURATION]: expired
            ? 0
            : getDaysUntilExpiry(boat[FIELD_NAMES.EXPIRY_DATE]),
          [FIELD_NAMES.PRICE]: boat[FIELD_NAMES.PLAN_AMOUNT],
          [FIELD_NAMES.DETAILS]: boat[FIELD_NAMES.PLAN],
        }
      : null,
  };
};