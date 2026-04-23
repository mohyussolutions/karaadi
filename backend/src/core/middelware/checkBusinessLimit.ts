import { Response, NextFunction } from "express";
import prisma from "../utils/db.ts";
import { AuthRequest } from "src/types/index.ts";

const getUserId = (req: AuthRequest): string | undefined =>
  req.user?.id || req.user?._id || req.user?.sub;


export const checkBusinessLimit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    if (!userId) return next();

    const business = await (prisma as any).business.findFirst({
      where: {
        OR: [{ userId }, { members: { some: { id: userId } } }],
        status: "active",
      },
      select: {
        id: true,
        isVerified: true,
        planId: true,
        plan: { select: { maxListings: true, durationDays: true } },
      },
    });

    if (!business) return next();

    if (!business.isVerified) {
      return res.status(403).json({
        error: "Your business account is pending admin approval. You cannot post ads until verified.",
      });
    }

    if (business.planId && business.plan) {
      const count = await countActiveListings(userId);
      if (count >= business.plan.maxListings) {
        return res.status(403).json({
          error: `Ad limit reached. Your plan allows a maximum of ${business.plan.maxListings} active listings.`,
        });
      }
    }

    next();
  } catch {
    next();
  }
};

async function countActiveListings(userId: string): Promise<number> {
  const now = new Date();
  const [cars, motorcycles, realEstates, marketplaces, boats, jobs, traktors] =
    await Promise.all([
      (prisma as any).car.count({ where: { userId, expiryDate: { gt: now } } }),
      (prisma as any).motorcycle.count({ where: { userId, expiryDate: { gt: now } } }),
      (prisma as any).realEstate.count({ where: { userId, expiryDate: { gt: now } } }),
      (prisma as any).marketplace.count({ where: { userId, expiryDate: { gt: now } } }),
      (prisma as any).boat.count({ where: { userId, expiryDate: { gt: now } } }),
      (prisma as any).job.count({ where: { userId, expiryDate: { gt: now } } }),
      (prisma as any).farmequipment.count({ where: { userId, expiryDate: { gt: now } } }),
    ]);
  return cars + motorcycles + realEstates + marketplaces + boats + jobs + traktors;
}
