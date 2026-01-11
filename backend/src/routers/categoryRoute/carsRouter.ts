import { Router, Request, Response } from "express";
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getTotalCars,
  getAllCarsIncludingUnpaid,
} from "controllers/categoryController/carsController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "core/middelware/authMiddlewareBothDbAndCognito.ts";

const carsRoutes = Router();

carsRoutes.get("/total", getTotalCars);
carsRoutes.get(
  "/all-including-unpaid",

  getAllCarsIncludingUnpaid
);

carsRoutes.post(
  "/",
  ProtectRoute,
  adminAndManager,
  async (req: Request, res: Response) => {
    await createCar(req, res);
  }
);

carsRoutes.put("/:id", async (req: Request, res: Response) => {
  await updateCar(req, res);
});

carsRoutes.delete(
  "/:id",

  async (req: Request, res: Response) => {
    await deleteCar(req, res);
  }
);

// --- PUBLIC ROUTES ---

carsRoutes.get("/", async (req: Request, res: Response) => {
  await getAllCars(req, res);
});

carsRoutes.get("/:id", async (req: Request, res: Response) => {
  await getCarById(req, res);
});

export default carsRoutes;
