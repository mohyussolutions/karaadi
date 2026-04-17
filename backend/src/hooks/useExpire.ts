import { EXPIRY_CONFIG } from "src/config/payment.constants.ts";

const toDate = (date: Date | string | null | undefined): Date | null => {
  if (!date) return null;
  return typeof date === "string" ? new Date(date) : date;
};

export const calculateExpiryDate = (
  subPlan: { basic30: number; standard60: number; premium90: number } | null,
  planAmount: number,
  fromDate?: Date,
): Date | null => {
  if (!subPlan || planAmount <= 0) return null;
  const baseDate = fromDate ? new Date(fromDate) : new Date();

  if (planAmount === subPlan.premium90) {
    return new Date(
      baseDate.getTime() + EXPIRY_CONFIG.PREMIUM_DAYS * EXPIRY_CONFIG.A_DAY,
    );
  }
  if (planAmount === subPlan.standard60) {
    return new Date(
      baseDate.getTime() + EXPIRY_CONFIG.STANDARD_DAYS * EXPIRY_CONFIG.A_DAY,
    );
  }
  if (planAmount === subPlan.basic30) {
    return new Date(
      baseDate.getTime() + EXPIRY_CONFIG.BASIC_DAYS * EXPIRY_CONFIG.A_DAY,
    );
  }
  return new Date(
    baseDate.getTime() + EXPIRY_CONFIG.BASIC_DAYS * EXPIRY_CONFIG.A_DAY,
  );
};

export const getDefaultExpiryDate = (
  days: number = EXPIRY_CONFIG.BASIC_DAYS,
  fromDate?: Date,
): Date => {
  const baseDate = fromDate ? new Date(fromDate) : new Date();
  return new Date(baseDate.getTime() + days * EXPIRY_CONFIG.A_DAY);
};

export const isExpired = (
  expiryDate: Date | string | null | undefined,
): boolean => {
  const date = toDate(expiryDate);
  if (!date) return false;
  return new Date() > date;
};

export const getDaysUntilExpiry = (
  expiryDate: Date | string | null | undefined,
): number => {
  const date = toDate(expiryDate);
  if (!date) return 0;
  const diff = date.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / EXPIRY_CONFIG.A_DAY));
};

export const formatExpiryDate = (
  expiryDate: Date | string | null | undefined,
): string => {
  const date = toDate(expiryDate);
  if (!date) return "No expiry";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
