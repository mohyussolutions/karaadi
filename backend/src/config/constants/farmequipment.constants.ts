import prisma from "src/core/utils/db.ts";
import { isExpired, getDaysUntilExpiry, formatExpiryDate } from "src/hooks/useExpire.ts";
import { LISTING_STATUS } from "src/config/shared.constants.ts";
import { convertImages } from "src/core/utils/imageUtils.ts";
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
  FARM_EQUIPMENT_ID: "farmequipmentId",
  STATUS: "status",
  PAID_AT: "paidAt",
  SUCCESS: "success",
  DATA: "data",
  MESSAGE: "message",
  ERROR: "error",
  MAKE: "make",
  MODEL: "farmequipmentModel",
  TYPE: "type",
  CONDITION: "condition",
  ENGINE_POWER: "enginePower",
  FUEL_TYPE: "fuelType",
  YEAR: "year",
  HOURS: "hours",
  IS_EXPIRED: "isExpired",
  DAYS_UNTIL_EXPIRY: "daysUntilExpiry",
  FORMATTED_EXPIRY: "formattedExpiry",
  FOUND_BY_FALLBACK: "foundByFallback",
} as const;

export const ERROR_MESSAGES = {
  SERVER_ERROR: "Server Error",
  NOT_FOUND: "Tractor not found",
  UNAUTHORIZED: "User authentication required",
  CREATE_FAILED: "Failed to create",
  UPDATE_FAILED: "Update failed",
  DELETE_FAILED: "Delete failed",
  FETCH_ERROR: "Error fetching",
} as const;

export const SUCCESS_MESSAGES = {
  DELETED: "Tractor deleted successfully",
} as const;

export const DEFAULT_VALUES = {
  MAIN_CATEGORY: "Farmequipment",
  HOURS: 0,
} as const;

export const CACHE_KEYS = {
  ADMIN_ALL: (page: number, limit: number) =>
    `tractors:admin:all:page:${page}:limit:${limit}`,
  PUBLIC_ALL: (page: number, limit: number) =>
    `tractors:public:all:page:${page}:limit:${limit}`,
  TOTAL: "tractors:total",
  DETAIL: (id: string) => `tractor:detail:${id}`,
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
    [FIELD_NAMES.PHONE]: true,
  },
};

export const prepareTractorData = async (
  body: CreateFarmequipmentBody,
  userId: string,
) => {
  let expiryDate = null;
  let finalPlanAmount = 0;

  if (body.planId && body.planAmount) {
    const plan = await prisma.subPlan.findUnique({
      where: { [FIELD_NAMES.ID]: body.planId },
    });
    if (plan) {
      expiryDate = calculateExpiryDate(plan, body.planAmount);
      finalPlanAmount = body.planAmount;
    }
  }

  return {
    [FIELD_NAMES.USER_ID]: userId,
    [FIELD_NAMES.TITLE]: body.title,
    [FIELD_NAMES.DESCRIPTION]: body.description,
    [FIELD_NAMES.MAIN_CATEGORY]:
      body.mainCategory || DEFAULT_VALUES.MAIN_CATEGORY,
    [FIELD_NAMES.CATEGORY]: Array.isArray(body.category)
      ? body.category
      : [body.category].filter(Boolean),
    [FIELD_NAMES.SUBCATEGORY]: Array.isArray(body.subcategory)
      ? body.subcategory
      : [body.subcategory].filter(Boolean),
    [FIELD_NAMES.REGION]: body.region,
    [FIELD_NAMES.CITY]: body.city,
    [FIELD_NAMES.MAKE]: body.make || body.brand || "",
    [FIELD_NAMES.MODEL]: body.farmequipmentModel || "",
    [FIELD_NAMES.TYPE]: body.type || body.equipmentType || "",
    [FIELD_NAMES.CONDITION]: body.condition || "",
    [FIELD_NAMES.ENGINE_POWER]: body.enginePower || "",
    [FIELD_NAMES.FUEL_TYPE]: body.fuelType || "",
    [FIELD_NAMES.PRICE]: Number(body.price),
    [FIELD_NAMES.YEAR]: body.year ? Number(body.year) : 0,
    [FIELD_NAMES.HOURS]: body.hours ? Number(body.hours) : DEFAULT_VALUES.HOURS,
    [FIELD_NAMES.IMAGES]: Array.isArray(body.images) ? body.images : [],
    [FIELD_NAMES.IS_PAID]:
      body.isPaid !== undefined ? Boolean(body.isPaid) : false,
    [FIELD_NAMES.PLAN_ID]: body.planId || null,
    [FIELD_NAMES.PLAN_AMOUNT]: finalPlanAmount,
    [FIELD_NAMES.EXPIRY_DATE]: expiryDate,
  };
};

export const formatItem = (item: any) => ({
  ...item,
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