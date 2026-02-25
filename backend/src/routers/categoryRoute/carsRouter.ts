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

const carsRoutes = Router();

carsRoutes.get("/total", getTotalCars);

carsRoutes.get("/all-including-unpaid", getAllCarsIncludingUnpaid);

carsRoutes.post("/", async (req: Request, res: Response) => {
  await createCar(req as any, res);
});

carsRoutes.put("/:id", async (req: Request, res: Response) => {
  await updateCar(req as any, res);
});

carsRoutes.delete("/:id", async (req: Request, res: Response) => {
  await deleteCar(req as any, res);
});

carsRoutes.get("/", async (req: Request, res: Response) => {
  await getAllCars(req, res);
});

carsRoutes.get("/:id", async (req: Request, res: Response) => {
  await getCarById(req as any, res);
});

export default carsRoutes;
