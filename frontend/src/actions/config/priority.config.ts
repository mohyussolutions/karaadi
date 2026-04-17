export const PRIORITY_CONFIG = {
  PREMIUM: { label: "PREMIUM", color: "bg-amber-500" },
  STANDARD: { label: "STANDARD", color: "bg-blue-500" },
  BASIC: { label: "BASIC", color: "bg-gray-500" },
} as const;

export const getPriorityBadge = (
  isPremium90?: boolean,
  isStandard60?: boolean,
  isBasic30?: boolean,
) => {
  if (isPremium90) return PRIORITY_CONFIG.PREMIUM;
  if (isStandard60) return PRIORITY_CONFIG.STANDARD;
  if (isBasic30) return PRIORITY_CONFIG.BASIC;
  return null;
};
