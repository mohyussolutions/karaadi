export const EXPIRY_CONFIG = {
  BASIC_DAYS: 30,
  STANDARD_DAYS: 60,
  PREMIUM_DAYS: 90,
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
      baseDate.getTime() + EXPIRY_CONFIG.PREMIUM_DAYS * 24 * 60 * 60 * 1000,
    );
  }
  if (planAmount === subPlan.standard60) {
    return new Date(
      baseDate.getTime() + EXPIRY_CONFIG.STANDARD_DAYS * 24 * 60 * 60 * 1000,
    );
  }
  if (planAmount === subPlan.basic30) {
    return new Date(
      baseDate.getTime() + EXPIRY_CONFIG.BASIC_DAYS * 24 * 60 * 60 * 1000,
    );
  }
  return new Date(
    baseDate.getTime() + EXPIRY_CONFIG.BASIC_DAYS * 24 * 60 * 60 * 1000,
  );
};

export const getDefaultExpiryDate = (
  days: number = EXPIRY_CONFIG.BASIC_DAYS,
  fromDate?: Date,
): Date => {
  const baseDate = fromDate ? new Date(fromDate) : new Date();
  return new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);
};

export const isExpired = (expiryDate: Date | null | undefined): boolean => {
  if (!expiryDate) return false;
  return new Date() > expiryDate;
};

export const getDaysUntilExpiry = (
  expiryDate: Date | null | undefined,
): number => {
  if (!expiryDate) return 0;
  const diff = expiryDate.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const formatExpiryDate = (
  expiryDate: Date | null | undefined,
): string => {
  if (!expiryDate) return "No expiry";
  return expiryDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
