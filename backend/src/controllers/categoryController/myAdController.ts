import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { User } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";
import { CACHE_TTL } from "src/config/contstanst.ts";

interface AuthRequest extends Request {
  user?: User & { _id?: string; sub?: string };
}

const getUserId = (req: AuthRequest): string | undefined =>
  req.user?.id || req.user?._id || req.user?.sub;

const CACHE_KEYS = {
  USER_ADS: (userId: string) => `user:ads:${userId}`,
};

const MODELS = [
  { name: "boat", model: prisma.boat },
  { name: "car", model: prisma.car },
  { name: "marketplace", model: prisma.marketplace },
  { name: "realEstate", model: prisma.realEstate },
  { name: "motorcycle", model: prisma.motorcycle },
  { name: "farmequipment", model: prisma.farmequipment },
];

const selectUserBasic = {
  select: {
    id: true,
    username: true,
    email: true,
    phone: true,
    profileImage: true,
  },
};

const addMetadata = (ad: any, type: string) => ({
  ...ad,
  type,
  isPaid: ad.isPaid ?? false,
  user: ad.user
    ? {
        id: ad.user.id,
        username: ad.user.username,
        email: ad.user.email,
        profileImage: ad.user.profileImage,
      }
    : null,
});

export const getAds = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const cacheKey = CACHE_KEYS.USER_ADS(userId);
    const ads = await cacheManager.withCache(
      cacheKey,
      async () => {
        const [
          boats,
          cars,
          marketplace,
          realEstate,
          motorcycle,
          farmequipment,
        ] = await Promise.all([
          prisma.boat.findMany({
            where: { userId },
            include: { user: selectUserBasic },
            take: 100,
          }),
          prisma.car.findMany({
            where: { userId },
            include: { user: selectUserBasic },
            take: 100,
          }),
          prisma.marketplace.findMany({
            where: { userId },
            include: { user: selectUserBasic },
            take: 100,
          }),
          prisma.realEstate.findMany({
            where: { userId },
            include: { user: selectUserBasic },
            take: 100,
          }),
          prisma.motorcycle.findMany({
            where: { userId },
            include: { user: selectUserBasic },
            take: 100,
          }),
          prisma.farmequipment.findMany({
            where: { userId },
            include: { user: selectUserBasic },
            take: 100,
          }),
        ]);

        return [
          ...boats.map((b) => addMetadata(b, "boat")),
          ...cars.map((c) => addMetadata(c, "car")),
          ...marketplace.map((m) => addMetadata(m, "marketplace")),
          ...realEstate.map((r) => addMetadata(r, "realEstate")),
          ...motorcycle.map((m) => addMetadata(m, "motorcycle")),
          ...farmequipment.map((f) => addMetadata(f, "farmequipment")),
        ];
      },
      CACHE_TTL.LIST,
    );

    res.status(200).json(ads);
  } catch (err) {
    console.error("[getAds]", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAd = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { maGaday, ...updateData } = req.body;
    const userId = getUserId(req);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let foundModel: any = null;
    for (const entry of MODELS) {
      const exists = await (entry.model as any).findFirst({
        where: { id, userId },
        select: { id: true },
      });
      if (exists) {
        foundModel = entry;
        break;
      }
    }

    if (!foundModel) {
      return res.status(404).json({ message: "Ad not found or unauthorized" });
    }

    const dataToUpdate: Record<string, any> = {
      maGaday: maGaday ?? false,
      updatedAt: new Date(),
    };

    const commonFields = ["title", "description", "price"];
    commonFields.forEach((field) => {
      if (updateData[field] !== undefined)
        dataToUpdate[field] = updateData[field];
    });

    const updatedAd = await (foundModel.model as any).update({
      where: { id },
      data: dataToUpdate,
      include: { user: selectUserBasic },
    });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.USER_ADS(userId)),
      cacheManager.deletePattern(`${foundModel.name}:*`),
    ]);

    res.status(200).json({
      ...updatedAd,
      type: foundModel.name,
    });
  } catch (err) {
    console.error("[updateAd]", err);
    const error = err as Error;
    res
      .status(500)
      .json({ message: "Failed to update ad", error: error.message });
  }
};

export const deleteAd = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let deleted = false;
    let deletedModelName = "";

    for (const entry of MODELS) {
      const ad = await (entry.model as any).findFirst({
        where: { id, userId },
        select: { id: true },
      });
      if (ad) {
        await (entry.model as any).delete({ where: { id } });
        deleted = true;
        deletedModelName = entry.name;
        break;
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: "Ad not found" });
    }

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.USER_ADS(userId)),
      cacheManager.deletePattern(`${deletedModelName}:*`),
    ]);

    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (err) {
    console.error("[deleteAd]", err);
    res.status(500).json({ message: "Failed to delete ad" });
  }
};
