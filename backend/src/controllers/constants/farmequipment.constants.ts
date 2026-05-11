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
