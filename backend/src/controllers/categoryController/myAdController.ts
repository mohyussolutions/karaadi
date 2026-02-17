import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { User, Prisma } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";

interface AuthRequest extends Request {
  user?: User & { _id?: string; sub?: string };
}

const getUserId = (req: AuthRequest): string | undefined =>
  req.user?.id || req.user?._id || req.user?.sub;

export const getAds = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const cacheKey = `user:ads:${userId}`;
    const ads = await cacheManager.withCache(cacheKey, async () => {
      const [boats, cars, marketplace, realEstate, motorcycle, tractor] =
        await Promise.all([
          prisma.boat.findMany({ where: { userId }, include: { user: true } }),
          prisma.car.findMany({ where: { userId }, include: { user: true } }),
          prisma.marketplace.findMany({
            where: { userId },
            include: { user: true },
          }),
          prisma.realEstate.findMany({
            where: { userId },
            include: { user: true },
          }),
          prisma.motorcycle.findMany({
            where: { userId },
            include: { user: true },
          }),
          prisma.traktor.findMany({
            where: { userId },
            include: { user: true },
          }),
        ]);

      return [
        ...boats,
        ...cars,
        ...marketplace,
        ...realEstate,
        ...motorcycle,
        ...tractor,
      ];
    });

    res.status(200).json(ads);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAd = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { maGaday, ...updateData } = req.body;
    const userId = getUserId(req);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const models = [
      { name: "boat", model: prisma.boat },
      { name: "car", model: prisma.car },
      { name: "marketplace", model: prisma.marketplace },
      { name: "realEstate", model: prisma.realEstate },
      { name: "motorcycle", model: prisma.motorcycle },
      { name: "tractor", model: prisma.traktor },
    ];

    let foundModel: any = null;
    for (const entry of models) {
      const exists = await (entry.model as any).findFirst({
        where: { id, userId },
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

    if (foundModel.name === "car" || foundModel.name === "tractor") {
      if (updateData.brand) dataToUpdate.brand = updateData.brand;
      if (updateData.model) dataToUpdate.model = updateData.model;
      if (updateData.horsepower)
        dataToUpdate.horsepower = updateData.horsepower;
    }

    if (foundModel.name === "motorcycle") {
      if (updateData.brand) dataToUpdate.brand = updateData.brand;
      if (updateData.cc) dataToUpdate.cc = updateData.cc;
    }

    const updatedAd = await (foundModel.model as any).update({
      where: { id },
      data: dataToUpdate,
      include: { user: true },
    });

    await Promise.all([
      cacheManager.delete(`user:ads:${userId}`),
      cacheManager.deletePattern(`${foundModel.name}:*`),
    ]);

    res.status(200).json({
      ...updatedAd,
      type: foundModel.name,
    });
  } catch (err) {
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

    const models = [
      "boat",
      "car",
      "marketplace",
      "realEstate",
      "motorcycle",
      "traktor",
    ];
    let deleted = false;

    for (const modelName of models) {
      const model = (prisma as any)[modelName];
      const ad = await model.findFirst({ where: { id, userId } });

      if (ad) {
        await model.delete({ where: { id } });
        deleted = true;
        await Promise.all([
          cacheManager.delete(`user:ads:${userId}`),
          cacheManager.deletePattern(`${modelName}:*`),
        ]);
        break;
      }
    }

    if (!deleted) return res.status(404).json({ message: "Ad not found" });
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete ad" });
  }
};
