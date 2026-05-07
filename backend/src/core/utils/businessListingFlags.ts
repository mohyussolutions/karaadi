import prisma from "./db.ts";

export type BusinessListingFlags = {
  isPaidByBusiness: boolean;
  expiryDate: Date | null;
  isBasic30: boolean;
  isStandard60: boolean;
  isPremium90: boolean;
};

export type BusinessLimitCheck = {
  limitReached: boolean;
  current: number;
  max: number;
};

export async function checkBusinessListingLimit(
  businessId: string | undefined | null,
): Promise<BusinessLimitCheck> {
  if (!businessId) return { limitReached: false, current: 0, max: Infinity };

  const business = await (prisma as any).business.findUnique({
    where: { id: businessId },
    select: {
      maxListingsOverride: true,
      plan: { select: { maxListings: true } },
    },
  });

  if (!business) return { limitReached: false, current: 0, max: Infinity };

  const max: number =
    business.maxListingsOverride ?? business.plan?.maxListings ?? Infinity;

  if (!isFinite(max)) return { limitReached: false, current: 0, max: Infinity };

  const models = [
    "car", "motorcycle", "realEstate", "marketplace",
    "boat", "job", "farmequipment",
  ] as const;

  const counts = await Promise.all(
    models.map((m) =>
      (prisma as any)[m].count({ where: { businessId } }),
    ),
  );
  const current = counts.reduce((a: number, b: number) => a + b, 0);

  return { limitReached: current >= max, current, max };
}

export async function getBusinessListingFlags(
  businessId: string | undefined | null,
): Promise<BusinessListingFlags> {
  const none: BusinessListingFlags = {
    isPaidByBusiness: false,
    expiryDate: null,
    isBasic30: false,
    isStandard60: false,
    isPremium90: false,
  };

  if (!businessId) return none;

  const business = await (prisma as any).business.findUnique({
    where: { id: businessId },
    select: {
      status: true,
      expiryDate: true,
      isAdminEnabled: true,
      plan: { select: { durationDays: true } },
    },
  });

  if (
    !business ||
    business.status !== "active" ||
    !business.isAdminEnabled ||
    !business.expiryDate ||
    business.expiryDate <= new Date()
  ) {
    return none;
  }

  const days: number = business.plan?.durationDays ?? 0;

  return {
    isPaidByBusiness: true,
    expiryDate: business.expiryDate,
    isBasic30: days >= 30 && days < 60,
    isStandard60: days >= 60 && days < 90,
    isPremium90: days >= 90,
  };
}
