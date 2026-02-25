export const EXPIRY_CONFIG = {
  DEFAULT_DAYS: 30,
  PREMIUM_DAYS: 60,
  ENTERPRISE_DAYS: 90,
  THRESHOLD: {
    PREMIUM: 50,
    ENTERPRISE: 100,
  },
};

export const calculateExpiryDate = (
  planId: string | null,
  planAmount: number,
): Date | null => {
  if (!planId && planAmount === 0) return null;

  const now = new Date();

  if (planAmount > 0) {
    if (
      planId?.includes("60") ||
      planAmount > EXPIRY_CONFIG.THRESHOLD.PREMIUM
    ) {
      return new Date(now.setDate(now.getDate() + EXPIRY_CONFIG.PREMIUM_DAYS));
    }
    if (
      planId?.includes("90") ||
      planAmount > EXPIRY_CONFIG.THRESHOLD.ENTERPRISE
    ) {
      return new Date(
        now.setDate(now.getDate() + EXPIRY_CONFIG.ENTERPRISE_DAYS),
      );
    }
    return new Date(now.setDate(now.getDate() + EXPIRY_CONFIG.DEFAULT_DAYS));
  }

  return null;
};

export const getDefaultExpiryDate = (
  days: number = EXPIRY_CONFIG.DEFAULT_DAYS,
): Date => {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
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
