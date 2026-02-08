import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { v4 as uuidv4 } from "uuid";
import { triggerSubscriptionWatch } from "../userController/subscriptionController.ts";

export const getTotalCars = async (_req: Request, res: Response) => {
  try {
    const total = await prisma.car.count({});
    return res.json({ totalCars: total });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getAllCarsIncludingUnpaid = async (
  _req: Request,
  res: Response,
) => {
  try {
    const cars = await prisma.car.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
      },
    });
    return res.json(cars);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getAllCars = async (req: Request, res: Response) => {
  try {
    const { type, listingType, region, city, district, subcategory, category } =
      req.query;

    const filter: any = {};
    if (type) filter.type = type;
    if (listingType) filter.listingType = listingType;
    if (region) filter.region = region;
    if (city) filter.city = city;
    if (district) filter.district = district;
    if (subcategory) filter.subcategory = { has: subcategory };
    if (category) filter.category = { has: category };

    const cars = await prisma.car.findMany({
      where: { ...filter, isPaid: true },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
      },
    });

    return res.json(cars);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getCarById = async (req: Request, res: Response) => {
  try {
    const car = await prisma.car.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
      },
    });
    if (!car) return res.status(404).json({ message: "Car not found" });
    return res.json(car);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const createCar = async (req: Request, res: Response) => {
  try {
    const carData = {
      ...req.body,
      category: Array.isArray(req.body.category)
        ? req.body.category
        : [req.body.category].filter(Boolean),
      subcategory: Array.isArray(req.body.subcategory)
        ? req.body.subcategory
        : [req.body.subcategory].filter(Boolean),
      images: Array.isArray(req.body.images) ? req.body.images : [],
    };

    if (!carData.id) carData.id = uuidv4();

    const userId = carData.userId;
    if (!userId)
      return res.status(400).json({ message: "Missing userId in request." });

    const subscription = await prisma.subscription.findFirst({
      where: { userId },
    });

    if (!subscription) {
      return res
        .status(403)
        .json({ message: "You need a subscription to create a car listing." });
    }

    const newCar = await prisma.car.create({
      data: { ...carData, isPaid: false },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
      },
    });

    await triggerSubscriptionWatch("car", newCar.id);
    return res.status(201).json(newCar);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to create car listing and notifications",
      error: error.message,
    });
  }
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const updatedCar = await prisma.car.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        user: {
          select: {
            username: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
      },
    });
    return res.json(updatedCar);
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "Car not found" });
    return res
      .status(400)
      .json({ message: "Update failed", error: error.message });
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  try {
    await prisma.car.delete({ where: { id: req.params.id } });
    return res.json({ message: "Car deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "Car not found" });
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
