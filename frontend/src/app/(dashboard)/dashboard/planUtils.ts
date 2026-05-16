const PLAN_LABEL = {
  PREMIUM: "Premium 90d",
  STANDARD: "Standard 60d",
  BASIC: "Basic 30d",
  SUBSCRIBED: "Subscribed",
  DIRECT: "Direct",
  NONE: "—",
} as const;

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};

type PlanItem = {
  isPremium90?: boolean;
  isStandard60?: boolean;
  isBasic30?: boolean;
  planAmount?: number;
  planId?: string | null;
  isPaid?: boolean;
  plan?: { premium90?: number; standard60?: number; basic30?: number } | null;
};

type ExpiryItem = {
  expiryDate?: string | Date | null;
};

export function getPlan(item: PlanItem): string {
  if (item.isPremium90) return PLAN_LABEL.PREMIUM;
  if (item.isStandard60) return PLAN_LABEL.STANDARD;
  if (item.isBasic30) return PLAN_LABEL.BASIC;
  if (item.plan && item.planAmount) {
    if (item.planAmount === item.plan.premium90) return PLAN_LABEL.PREMIUM;
    if (item.planAmount === item.plan.standard60) return PLAN_LABEL.STANDARD;
    if (item.planAmount === item.plan.basic30) return PLAN_LABEL.BASIC;
    return `Plan $${item.planAmount}`;
  }
  if (item.planId) return PLAN_LABEL.SUBSCRIBED;
  if (item.isPaid) return PLAN_LABEL.DIRECT;
  return PLAN_LABEL.NONE;
}

export function getExpiry(item: ExpiryItem): { label: string; expired: boolean } {
  if (!item.expiryDate) return { label: PLAN_LABEL.NONE, expired: false };
  const d = new Date(item.expiryDate);
  const expired = d < new Date();
  return { label: d.toLocaleDateString("en-GB", DATE_FORMAT), expired };
}
