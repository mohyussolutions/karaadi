import prisma from "./db.ts";

export type BusinessListingFlags = {
  isPaidByBusiness: boolean;
  expiryDate: Date | null;
  isBasic30: boolean;
  isStandard60: boolean;
  isPremium90: boolean;
};

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
