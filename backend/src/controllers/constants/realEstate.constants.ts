export const FIELD_NAMES = {
  CATEGORY: "category",
  SUBCATEGORY: "subcategory",
  PLAN_AMOUNT: "planAmount",
  PLAN_ID: "planId",
  IS_PAID: "isPaid",
  EXPIRY_DATE: "expiryDate",
  TITLE: "title",
  DESCRIPTION: "description",
  CREATED_AT: "createdAt",
  USER_ID: "userId",
  PRICE: "price",
  MAIN_CATEGORY: "mainCategory",
  REGION: "region",
  CITY: "city",
  COUNTY: "county",
  IMAGES: "images",
  BEDROOMS: "bedrooms",
  BATHROOMS: "bathrooms",
  SQUARE_FEET: "squareFeet",
  ADDRESS: "address",
  HAS_GARAGE: "hasGarage",
  HAS_GARDEN: "hasGarden",
} as const;

export const ERROR_MESSAGES = {
  SERVER_ERROR: "Server Error",
  PROPERTY_NOT_FOUND: "Property not found",
  MISSING_FIELDS: "Missing required fields",
  CREATION_FAILED: "Creation failed",
  UPDATE_FAILED: "Update failed",
  ITEM_NOT_FOUND: "Item not found",
} as const;

export const SUCCESS_MESSAGES = {
  DELETED: "Property deleted successfully",
} as const;

export const CACHE_KEYS = {
  ALL_ADMIN: "realestate:admin:all",
  TOTAL: "realestate:total",
  ALL_PAID: (page: number, limit: number) =>
    `realestate:paid:page:${page}:limit:${limit}`,
  DETAIL: (id: string) => `realestate:detail:${id}`,
};
