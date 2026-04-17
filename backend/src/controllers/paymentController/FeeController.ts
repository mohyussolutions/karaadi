import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import type { Prisma } from "@prisma/client";

const MARKETPLACE_FEE_KEYS = [
  "art",
  "electronics",
  "animal",
  "sports",
  "furniture",
  "fashion",
  "isActive",
];

export const createMarketplaceFee = async (req: Request, res: Response) => {
  try {
    const data: Prisma.MarketplaceFeeCreateInput = req.body;
    if (!data || !MARKETPLACE_FEE_KEYS.some((k) => k in data)) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const result = await prisma.marketplaceFee.create({ data });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllMarketplaceFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.marketplaceFee.findMany({
      select: {
        id: true,
        art: true,
        electronics: true,
        animal: true,
        sports: true,
        furniture: true,
        fashion: true,
        isActive: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
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
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateMarketplaceFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const data: Prisma.MarketplaceFeeUpdateInput = {};
    MARKETPLACE_FEE_KEYS.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null) {
        (data as any)[k] = rawData[k];
      }
    });
    if (!Object.keys(data).length) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const existing = await prisma.marketplaceFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.marketplaceFee.update({ where: { id }, data });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "Marketplace update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(data)),
          changes: JSON.parse(JSON.stringify(data)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteMarketplaceFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.marketplaceFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createRealEstateFee = async (req: Request, res: Response) => {
  try {
    const keys = ["rent", "sale", "land", "farm", "business"];
    const data: Prisma.RealEstateFeeCreateInput = req.body;
    if (!data || !keys.some((k) => k in data)) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const result = await prisma.realEstateFee.create({ data });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllRealEstateFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.realEstateFee.findMany({
      select: {
        id: true,
        rent: true,
        sale: true,
        land: true,
        farm: true,
        business: true,
        isActive: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
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
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateRealEstateFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const keys = ["rent", "sale", "land", "farm", "business", "isActive"];
    const data: Prisma.RealEstateFeeUpdateInput = {};
    keys.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null) {
        (data as any)[k] = rawData[k];
      }
    });
    if (!Object.keys(data).length) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const existing = await prisma.realEstateFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.realEstateFee.update({ where: { id }, data });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "Real Estate update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(data)),
          changes: JSON.parse(JSON.stringify(data)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteRealEstateFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.realEstateFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllCarFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.carFee.findMany({
      select: {
        id: true,
        carSale: true,
        carRent: true,
        trailer: true,
        carParts: true,
        truck: true,
        electricCar: true,
        isActive: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
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
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createCarFee = async (req: Request, res: Response) => {
  try {
    const keys = [
      "carSale",
      "carRent",
      "trailer",
      "carParts",
      "truck",
      "electricCar",
    ];
    const data: Prisma.CarFeeCreateInput = req.body;
    if (!data || !keys.some((k) => k in data)) {
      return res.status(400).json({ error: "Missing car fee fields" });
    }
    const result = await prisma.carFee.create({ data });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateCarFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...data } = req.body;
    const keys = [
      "carSale",
      "carRent",
      "trailer",
      "carParts",
      "truck",
      "electricCar",
      "isActive",
    ];
    const filtered: Prisma.CarFeeUpdateInput = Object.fromEntries(
      Object.entries(data).filter(
        ([k, v]) => keys.includes(k) && v !== null && v !== undefined,
      ),
    );
    if (!Object.keys(filtered).length) {
      return res.status(400).json({ error: "Missing car fee fields" });
    }
    const existing = await prisma.carFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.carFee.update({
      where: { id },
      data: filtered,
    });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "Car fee update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(filtered)),
          changes: JSON.parse(JSON.stringify(filtered)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteCarFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.carFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllMotorcycleFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.motorcycleFee.findMany({
      select: {
        id: true,
        motoSale: true,
        motoRent: true,
        motoParts: true,
        isActive: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
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
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createMotorcycleFee = async (req: Request, res: Response) => {
  try {
    const keys = ["motoSale", "motoRent", "motoParts"];
    const data: Prisma.MotorcycleFeeCreateInput = req.body;
    if (!data || !keys.some((k) => k in data)) {
      return res.status(400).json({ error: "Missing motorcycle fee fields" });
    }
    const result = await prisma.motorcycleFee.create({ data });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateMotorcycleFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...data } = req.body;
    const keys = ["motoSale", "motoRent", "motoParts", "isActive"];
    const filtered: Prisma.MotorcycleFeeUpdateInput = Object.fromEntries(
      Object.entries(data).filter(
        ([k, v]) => keys.includes(k) && v !== null && v !== undefined,
      ),
    );
    if (!Object.keys(filtered).length) {
      return res.status(400).json({ error: "Missing motorcycle fee fields" });
    }
    const existing = await prisma.motorcycleFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.motorcycleFee.update({
      where: { id },
      data: filtered,
    });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "Motorcycle fee update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(filtered)),
          changes: JSON.parse(JSON.stringify(filtered)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteMotorcycleFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.motorcycleFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createBoatFee = async (req: Request, res: Response) => {
  try {
    const keys = ["boatSale", "boatRent", "boatEngine", "boatParts"];
    const data: Prisma.BoatFeeCreateInput = req.body;
    if (!data || !keys.some((k) => k in data)) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const result = await prisma.boatFee.create({ data });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllBoatFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.boatFee.findMany({
      select: {
        id: true,
        boatSale: true,
        boatRent: true,
        boatEngine: true,
        boatParts: true,
        isActive: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
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
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateBoatFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const keys = [
      "boatSale",
      "boatRent",
      "boatEngine",
      "boatParts",
      "isActive",
    ];
    const data: Prisma.BoatFeeUpdateInput = {};
    keys.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null) {
        (data as any)[k] = rawData[k];
      }
    });
    if (!Object.keys(data).length) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const existing = await prisma.boatFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.boatFee.update({ where: { id }, data });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "Boat update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(data)),
          changes: JSON.parse(JSON.stringify(data)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteBoatFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.boatFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createEquipmentFee = async (req: Request, res: Response) => {
  try {
    const result = await prisma.equipmentFeeConfig.create({ data: req.body });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllEquipmentFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.equipmentFeeConfig.findMany({
      select: {
        id: true,
        tractorSale: true,
        agriTool: true,
        harvester: true,
        isActive: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
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
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
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
    const data: Prisma.EquipmentFeeConfigUpdateInput = {};
    keys.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null) {
        (data as any)[k] = rawData[k];
      }
    });
    const existing = await prisma.equipmentFeeConfig.findUnique({
      where: { id },
    });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.equipmentFeeConfig.update({
      where: { id },
      data,
    });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "Equipment update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(data)),
          changes: JSON.parse(JSON.stringify(data)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteEquipmentFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.equipmentFeeConfig.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createSystemConfig = async (req: Request, res: Response) => {
  try {
    const result = await prisma.systemConfig.create({ data: req.body });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getSystemConfig = async (req: Request, res: Response) => {
  try {
    const result = await prisma.systemConfig.findFirst({
      select: {
        id: true,
        taxRate: true,
        platformFee: true,
        waafiFee: true,
        currency: true,
        updatedAt: true,
      },
    });
    res.json(result || {});
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateSystemConfig = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const keys = ["taxRate", "platformFee", "waafiFee", "currency"];
    const data: Prisma.SystemConfigUpdateInput = {};
    for (const k of keys) {
      const value = rawData[k];
      if (value !== undefined && value !== null) {
        if (k === "currency") {
          data.currency = String(value);
        } else if (k === "taxRate") {
          data.taxRate = Number(value);
        } else if (k === "platformFee") {
          data.platformFee = Number(value);
        } else if (k === "waafiFee") {
          data.waafiFee = Number(value);
        }
      }
    }
    const existing = await prisma.systemConfig.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.systemConfig.update({ where: { id }, data });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "System update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(data)),
          changes: JSON.parse(JSON.stringify(data)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteSystemConfig = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.systemConfig.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};
export const createSubPlan = async (req: Request, res: Response) => {
  try {
    const keys = ["basic30", "standard60", "premium90", "isActive"];
    const data: Prisma.SubPlanCreateInput = req.body;
    if (!data || !keys.some((k) => k in data)) {
      return res
        .status(400)
        .json({ error: "Missing subscription plan fields" });
    }
    const result = await prisma.subPlan.create({ data });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};
export const getAllSubPlans = async (req: Request, res: Response) => {
  try {
    const results = await prisma.subPlan.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
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
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};
export const updateSubPlan = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const keys = ["basic30", "standard60", "premium90", "isActive"];
    const data: Prisma.SubPlanUpdateInput = {};

    keys.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null) {
        (data as Record<string, unknown>)[k] = rawData[k];
      }
    });

    if (!Object.keys(data).length) {
      return res
        .status(400)
        .json({ error: "Missing subscription plan fields" });
    }

    const existing = await prisma.subPlan.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const result = await prisma.subPlan.update({ where: { id }, data });

    if (adminId) {
      await prisma.feeChangeLog.create({
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
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};
export const deleteSubPlan = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.subPlan.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};
