import prisma from "core/utils/db.ts";
import { Request, Response } from "express";

export const getAds = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id || (req.user as any)?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const [boats, cars, marketplace, realEstate, motorcycle, tractor] =
      await Promise.all([
        prisma.boat.findMany({
          where: { userId } as any,
          include: { user: true },
        }),
        prisma.car.findMany({
          where: { userId } as any,
          include: { user: true },
        }),
        prisma.marketplace.findMany({
          where: { userId } as any,
          include: { user: true },
        }),
        prisma.realEstate.findMany({
          where: { userId } as any,
          include: { user: true },
        }),
        prisma.motorcycle.findMany({
          where: { userId } as any,
          include: { user: true },
        }),
        prisma.traktor.findMany({
          where: { userId } as any,
          include: { user: true },
        }),
      ]);

    const ads = [
      ...boats,
      ...cars,
      ...marketplace,
      ...realEstate,
      ...motorcycle,
      ...tractor,
    ];
    res.status(200).json(ads);
  } catch (err) {
    console.error("Get ads error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAd = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { maGaday, ...updateData } = req.body;
    const userId =
      (req.user as any)?.id || (req.user as any)?.sub || (req.user as any)?._id;
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let updatedAd = null;
    let foundModel = null;

    const models = [
      { name: "boat", model: prisma.boat },
      { name: "car", model: prisma.car },
      { name: "marketplace", model: prisma.marketplace },
      { name: "realEstate", model: prisma.realEstate },
      { name: "motorcycle", model: prisma.motorcycle },
      { name: "tractor", model: prisma.traktor },
    ];

    console.log(`Searching for ad ${id} for user ${userId}`);

    for (const { name, model } of models) {
      try {
        console.log(`Checking ${name} model`);

        const existingAd = await (model as any).findFirst({
          where: {
            id: id,
            userId: userId,
          },
        });

        if (existingAd) {
          console.log(`Found ad in ${name} model`);
          foundModel = { name, model };
          break;
        }
      } catch (error) {
        console.error(`Error checking ${name}:`, error);
        continue;
      }
    }

    if (!foundModel) {
      console.log(`Ad not found`);
      return res.status(404).json({
        message: "Ad not found or unauthorized",
      });
    }

    console.log(`Updating in ${foundModel.name} model`);

    try {
      const dataToUpdate: any = {
        maGaday: maGaday !== undefined ? maGaday : false,
        updatedAt: new Date(),
      };

      // Common fields for all models
      if (updateData.title !== undefined) dataToUpdate.title = updateData.title;
      if (updateData.description !== undefined)
        dataToUpdate.description = updateData.description;
      if (updateData.price !== undefined) dataToUpdate.price = updateData.price;

      // Car specific fields
      if (foundModel.name === "car") {
        if (updateData.brand !== undefined)
          dataToUpdate.brand = updateData.brand;
        if (updateData.model !== undefined)
          dataToUpdate.model = updateData.model;
      }

      // Motorcycle specific fields
      if (foundModel.name === "motorcycle") {
        if (updateData.brand !== undefined)
          dataToUpdate.brand = updateData.brand;
        if (updateData.cc !== undefined) dataToUpdate.cc = updateData.cc;
      }

      // Tractor specific fields
      if (foundModel.name === "tractor") {
        if (updateData.brand !== undefined)
          dataToUpdate.brand = updateData.brand;
        if (updateData.model !== undefined)
          dataToUpdate.model = updateData.model;
        if (updateData.horsepower !== undefined)
          dataToUpdate.horsepower = updateData.horsepower;
      }

      updatedAd = await (foundModel.model as any).update({
        where: { id: id },
        data: dataToUpdate,
        include: { user: true },
      });

      console.log(`Update successful`);
    } catch (updateError: any) {
      console.log(`Update failed: ${updateError.message}`);

      try {
        const dataToUpdate: any = {
          maGaday: maGaday !== undefined ? maGaday : false,
          updatedAt: new Date(),
        };

        // Common fields
        if (updateData.title !== undefined)
          dataToUpdate.title = updateData.title;
        if (updateData.description !== undefined)
          dataToUpdate.description = updateData.description;
        if (updateData.price !== undefined)
          dataToUpdate.price = updateData.price;

        // Car specific fields
        if (foundModel.name === "car") {
          if (updateData.brand !== undefined)
            dataToUpdate.brand = updateData.brand;
          if (updateData.model !== undefined)
            dataToUpdate.model = updateData.model;
        }

        // Motorcycle specific fields
        if (foundModel.name === "motorcycle") {
          if (updateData.brand !== undefined)
            dataToUpdate.brand = updateData.brand;
          if (updateData.cc !== undefined) dataToUpdate.cc = updateData.cc;
        }

        // Tractor specific fields
        if (foundModel.name === "tractor") {
          if (updateData.brand !== undefined)
            dataToUpdate.brand = updateData.brand;
          if (updateData.model !== undefined)
            dataToUpdate.model = updateData.model;
          if (updateData.horsepower !== undefined)
            dataToUpdate.horsepower = updateData.horsepower;
        }

        const updateResult = await (foundModel.model as any).updateMany({
          where: {
            id: id,
            userId: userId,
          },
          data: dataToUpdate,
        });

        if (updateResult.count === 0) {
          throw new Error("No records updated");
        }

        updatedAd = await (foundModel.model as any).findFirst({
          where: {
            id: id,
            userId: userId,
          },
          include: { user: true },
        });

        console.log(`Update successful with updateMany`);
      } catch (updateManyError: any) {
        throw new Error(`Update failed: ${updateManyError.message}`);
      }
    }

    if (!updatedAd) {
      return res.status(500).json({ message: "Update failed" });
    }

    const responseData = {
      ...updatedAd,
      id: updatedAd.id,
      _id: updatedAd.id,
      maGaday: updatedAd.maGaday || false,
      type: foundModel.name,
    };

    res.status(200).json(responseData);
  } catch (err: any) {
    console.error("Update ad error:", err);
    res.status(500).json({
      message: "Failed to update ad",
      error: err.message,
    });
  }
};

export const deleteAd = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const authUserId = (req.user as any)?.id || (req.user as any)?.sub;

    if (!authUserId) return res.status(401).json({ message: "Unauthorized" });

    const models = [
      "boat",
      "car",
      "marketplace",
      "realEstate",
      "motorcycle",
      "tractor",
    ];
    let deletedAd = null;

    for (const modelName of models) {
      const model = (prisma as any)[modelName];

      const existingAd = await model.findFirst({
        where: { id, userId: authUserId },
      });

      if (existingAd) {
        deletedAd = await model.delete({
          where: { id },
        });
        break;
      }
    }

    if (!deletedAd)
      return res.status(404).json({ message: "Ad not found or unauthorized" });
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete ad" });
  }
};
