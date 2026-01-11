import prisma from "core/utils/db.ts";
import { Request, Response } from "express";

export const getAgencyStats = async (req: Request, res: Response) => {
  try {
    const total = await prisma.agency.count();
    const verified = await prisma.agency.count({
      where: { status: "Verified" },
    });
    res.status(200).json({ success: true, total, verified });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createAgency = async (req: Request, res: Response) => {
  try {
    const { name, type, location, specialty, image, link, userId } = req.body;

    const agency = await prisma.agency.create({
      data: {
        name,
        type,
        location,
        specialty: specialty || "",
        image: image || "",
        link: link || "",
        userId,
      },
    });

    res.status(201).json({ success: true, agency });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getAllAgencies = async (req: Request, res: Response) => {
  try {
    const agencies = await prisma.agency.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, agencies });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAgency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agency = await prisma.agency.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json({ success: true, agency });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteAgency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.agency.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
