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
  UPDATED_AT: "updatedAt",
} as const;

export const ERROR_MESSAGES = {
  SERVER_ERROR: "Server Error",
  INVALID_ID: "Invalid ID format",
  NOT_FOUND: "Job not found",
  CREATE_FAILED: "Create failed",
  UPDATE_FAILED: "Update failed",
  ITEM_NOT_FOUND: "Item not found",
} as const;

export const SUCCESS_MESSAGES = {
  DELETED: "Job deleted successfully",
} as const;
