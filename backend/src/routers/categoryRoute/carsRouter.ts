import { Router, Request, Response } from "express";
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getTotalCars,
  getAllCarsIncludingUnpaid,
} from "src/controllers/categoryController/carsController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const carsRoutes = Router();

carsRoutes.get("/total", ProtectRoute, adminAndManager, getTotalCars);

carsRoutes.get(
  "/all-including-unpaid",
  ProtectRoute,
  adminAndManager,
  getAllCarsIncludingUnpaid,
);

carsRoutes.post("/", ProtectRoute, async (req: Request, res: Response) => {
  await createCar(req as any, res);
});

carsRoutes.put("/:id", ProtectRoute, async (req: Request, res: Response) => {
  await updateCar(req as any, res);
});

carsRoutes.delete("/:id", ProtectRoute, async (req: Request, res: Response) => {
  await deleteCar(req as any, res);
});

carsRoutes.get("/", async (req: Request, res: Response) => {
  await getAllCars(req, res);
});

carsRoutes.get("/:id", async (req: Request, res: Response) => {
  await getCarById(req as any, res);
});

export default carsRoutes;
