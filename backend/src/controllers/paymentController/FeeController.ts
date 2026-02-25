import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";

export const createMarketplaceFee = async (req: Request, res: Response) => {
  try {
    console.log("Create Marketplace Fee request body:", req.body);
    const keys = [
      "art",
      "electronics",
      "animal",
      "sports",
      "furniture",
      "fashion",
    ];
    if (!req.body || !keys.some((k) => k in req.body)) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const result = await prisma.marketplaceFee.create({ data: req.body });
    res.status(201).json(result);
  } catch (e: any) {
    console.error("Create Marketplace Fee error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const getAllMarketplaceFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.marketplaceFee.findMany({
      orderBy: { updatedAt: "desc" },
    });
    res.json(results);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getMarketplaceFeeById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.marketplaceFee.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const updateMarketplaceFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    console.log("Update Marketplace Fee request body:", req.body);
    const keys = [
      "art",
      "electronics",
      "animal",
      "sports",
      "furniture",
      "fashion",
      "isActive",
    ];
    const data: any = {};
    keys.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null)
        data[k] = rawData[k];
    });
    if (!Object.keys(data).length) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const existing = await prisma.marketplaceFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.marketplaceFee.update({ where: { id }, data });
      if (adminId) {
        await tx.feeChangeLog.create({
          data: {
            feeConfigId: id,
            changedBy: adminId,
            reason: reason || "Marketplace update",
            previousValues: existing as any,
            newValues: data as any,
            changes: data as any,
          },
        });
      }
      return updated;
    });
    res.json(result);
  } catch (e: any) {
    console.error("Update Marketplace Fee error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const deleteMarketplaceFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.marketplaceFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const createRealEstateFee = async (req: Request, res: Response) => {
  try {
    console.log("Create Real Estate Fee request body:", req.body);
    const keys = ["rent", "sale", "land", "farm", "business"];
    if (!req.body || !keys.some((k) => k in req.body)) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const result = await prisma.realEstateFee.create({ data: req.body });
    res.status(201).json(result);
  } catch (e: any) {
    console.error("Create Real Estate Fee error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const getAllRealEstateFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.realEstateFee.findMany({
      orderBy: { updatedAt: "desc" },
    });
    res.json(results);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getRealEstateFeeById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.realEstateFee.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const updateRealEstateFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    console.log("Update Real Estate Fee request body:", req.body);
    const keys = ["rent", "sale", "land", "farm", "business", "isActive"];
    const data: any = {};
    keys.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null)
        data[k] = rawData[k];
    });
    if (!Object.keys(data).length) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const existing = await prisma.realEstateFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.realEstateFee.update({ where: { id }, data });
      if (adminId) {
        await tx.feeChangeLog.create({
          data: {
            feeConfigId: id,
            changedBy: adminId,
            reason: reason || "Real Estate update",
            previousValues: existing as any,
            newValues: data as any,
            changes: data as any,
          },
        });
      }
      return updated;
    });
    res.json(result);
  } catch (e: any) {
    console.error("Update Real Estate Fee error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const deleteRealEstateFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.realEstateFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getAllCarFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.carFee.findMany({
      orderBy: { updatedAt: "desc" },
    });
    res.json(results);
  } catch (e: any) {
    console.error("Get Car Fees error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const getCarFeeById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.carFee.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const createCarFee = async (req: Request, res: Response) => {
  try {
    console.log("Create Car Fee request body:", req.body);
    const keys = [
      "carSale",
      "carRent",
      "trailer",
      "carParts",
      "truck",
      "electricCar",
    ];
    if (!req.body || !keys.some((k) => k in req.body)) {
      return res.status(400).json({ error: "Missing car fee fields" });
    }
    const result = await prisma.carFee.create({ data: req.body });
    res.status(201).json(result);
  } catch (e: any) {
    console.error("Create Car Fee error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const updateCarFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...data } = req.body;
    console.log("Update Car Fee request body:", req.body);
    const keys = [
      "carSale",
      "carRent",
      "trailer",
      "carParts",
      "truck",
      "electricCar",
      "isActive",
    ];
    const filtered = Object.fromEntries(
      Object.entries(data).filter(
        ([k, v]) => keys.includes(k) && v !== null && v !== undefined,
      ),
    );
    if (!Object.keys(filtered).length) {
      return res.status(400).json({ error: "Missing car fee fields" });
    }
    const existing = await prisma.carFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.carFee.update({
        where: { id },
        data: filtered,
      });
      if (adminId) {
        await tx.feeChangeLog.create({
          data: {
            feeConfigId: id,
            changedBy: adminId,
            reason: reason || "Car fee update",
            previousValues: existing as any,
            newValues: filtered as any,
            changes: filtered as any,
          },
        });
      }
      return updated;
    });
    res.json(result);
  } catch (e: any) {
    console.error("Update Car Fee error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const deleteCarFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.carFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getAllMotorcycleFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.motorcycleFee.findMany({
      orderBy: { updatedAt: "desc" },
    });
    res.json(results);
  } catch (e: any) {
    console.error("Get Motorcycle Fees error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const getMotorcycleFeeById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.motorcycleFee.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const createMotorcycleFee = async (req: Request, res: Response) => {
  try {
    console.log("Create Motorcycle Fee request body:", req.body);
    const keys = ["motoSale", "motoRent", "motoParts"];
    if (!req.body || !keys.some((k) => k in req.body)) {
      return res.status(400).json({ error: "Missing motorcycle fee fields" });
    }
    const result = await prisma.motorcycleFee.create({ data: req.body });
    res.status(201).json(result);
  } catch (e: any) {
    console.error("Create Motorcycle Fee error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const updateMotorcycleFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...data } = req.body;
    console.log("Update Motorcycle Fee request body:", req.body);
    const keys = ["motoSale", "motoRent", "motoParts", "isActive"];
    const filtered = Object.fromEntries(
      Object.entries(data).filter(
        ([k, v]) => keys.includes(k) && v !== null && v !== undefined,
      ),
    );
    if (!Object.keys(filtered).length) {
      return res.status(400).json({ error: "Missing motorcycle fee fields" });
    }
    const existing = await prisma.motorcycleFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.motorcycleFee.update({
        where: { id },
        data: filtered,
      });
      if (adminId) {
        await tx.feeChangeLog.create({
          data: {
            feeConfigId: id,
            changedBy: adminId,
            reason: reason || "Motorcycle fee update",
            previousValues: existing as any,
            newValues: filtered as any,
            changes: filtered as any,
          },
        });
      }
      return updated;
    });
    res.json(result);
  } catch (e: any) {
    console.error("Update Motorcycle Fee error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const deleteMotorcycleFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.motorcycleFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const createBoatFee = async (req: Request, res: Response) => {
  try {
    console.log("Create Boat Fee request body:", req.body);
    const keys = ["boatSale", "boatRent", "boatEngine", "boatParts"];
    if (!req.body || !keys.some((k) => k in req.body)) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const result = await prisma.boatFee.create({ data: req.body });
    res.status(201).json(result);
  } catch (e: any) {
    console.error("Create Boat Fee error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const getAllBoatFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.boatFee.findMany({
      orderBy: { updatedAt: "desc" },
    });
    res.json(results);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getBoatFeeById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.boatFee.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const updateBoatFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    console.log("Update Boat Fee request body:", req.body);
    const keys = [
      "boatSale",
      "boatRent",
      "boatEngine",
      "boatParts",
      "isActive",
    ];
    const data: any = {};
    keys.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null)
        data[k] = rawData[k];
    });
    if (!Object.keys(data).length) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const existing = await prisma.boatFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.boatFee.update({ where: { id }, data });
      if (adminId) {
        await tx.feeChangeLog.create({
          data: {
            feeConfigId: id,
            changedBy: adminId,
            reason: reason || "Boat update",
            previousValues: existing as any,
            newValues: data as any,
            changes: data as any,
          },
        });
      }
      return updated;
    });
    res.json(result);
  } catch (e: any) {
    console.error("Update Boat Fee error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const deleteBoatFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.boatFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const createEquipmentFee = async (req: Request, res: Response) => {
  try {
    const result = await prisma.equipmentFeeConfig.create({ data: req.body });
    res.status(201).json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getAllEquipmentFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.equipmentFeeConfig.findMany({
      orderBy: { updatedAt: "desc" },
    });
    res.json(results);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getEquipmentFeeById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.equipmentFeeConfig.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const updateEquipmentFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const keys = [
      "tractorSale",
      "agriTool",
      "harvester",
      "fullTime",
      "partTime",
      "freelance",
      "isActive",
    ];
    const data: any = {};
    keys.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null)
        data[k] = rawData[k];
    });
    const existing = await prisma.equipmentFeeConfig.findUnique({
      where: { id },
    });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.equipmentFeeConfig.update({
        where: { id },
        data,
      });
      if (adminId) {
        await tx.feeChangeLog.create({
          data: {
            feeConfigId: id,
            changedBy: adminId,
            reason: reason || "Equipment update",
            previousValues: existing as any,
            newValues: data as any,
            changes: data as any,
          },
        });
      }
      return updated;
    });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteEquipmentFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.equipmentFeeConfig.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const createSystemConfig = async (req: Request, res: Response) => {
  try {
    const result = await prisma.systemConfig.create({ data: req.body });
    res.status(201).json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getSystemConfig = async (req: Request, res: Response) => {
  try {
    const result = await prisma.systemConfig.findFirst();
    res.json(result || {});
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const updateSystemConfig = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const keys = ["taxRate", "platformFee", "waafiFee", "currency"];
    const data: any = {};
    keys.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null)
        data[k] = rawData[k];
    });
    const existing = await prisma.systemConfig.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.systemConfig.update({ where: { id }, data });
      if (adminId) {
        await tx.feeChangeLog.create({
          data: {
            feeConfigId: id,
            changedBy: adminId,
            reason: reason || "System update",
            previousValues: existing as any,
            newValues: data as any,
            changes: data as any,
          },
        });
      }
      return updated;
    });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteSystemConfig = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.systemConfig.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const createSubPlan = async (req: Request, res: Response) => {
  try {
    const result = await prisma.subPlan.create({ data: req.body });
    res.status(201).json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getAllSubPlans = async (req: Request, res: Response) => {
  try {
    const results = await prisma.subPlan.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(results);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getSubPlanById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.subPlan.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const updateSubPlan = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const keys = ["subStandard", "subStandard60", "subPremium", "isActive"];
    const data: any = {};
    keys.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null)
        data[k] = rawData[k];
    });
    const existing = await prisma.subPlan.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.subPlan.update({ where: { id }, data });
      if (adminId) {
        await tx.feeChangeLog.create({
          data: {
            feeConfigId: id,
            changedBy: adminId,
            reason: reason || "SubPlan update",
            previousValues: existing as any,
            newValues: data as any,
            changes: data as any,
          },
        });
      }
      return updated;
    });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteSubPlan = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.subPlan.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};
