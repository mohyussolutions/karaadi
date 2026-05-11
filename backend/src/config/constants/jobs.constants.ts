import { isExpired, getDaysUntilExpiry, formatExpiryDate } from "src/hooks/useExpire.ts";
import { LISTING_STATUS } from "src/config/shared.constants.ts";
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


export const selectUserBasic = {
  select: { username: true, email: true, phone: true, profileImage: true },
};

export const formatItem = (item: any) => ({
  ...item,
  isExpired: isExpired(item.expiryDate),
  status: isExpired(item.expiryDate)
    ? LISTING_STATUS.EXPIRED
    : item.isPaid
      ? LISTING_STATUS.ACTIVE
      : LISTING_STATUS.PENDING,
  daysUntilExpiry: getDaysUntilExpiry(item.expiryDate),
  formattedExpiry: formatExpiryDate(item.expiryDate),
});