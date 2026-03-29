import { Router } from "express";
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getTotalCars,
  getAllCarsIncludingUnpaid,
} from "../../controllers/categoryController/carsController.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import { createCarSchema } from "../../validation/cars.validation.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";

const carsRoutes = Router();

carsRoutes.get("/total", ProtectRoute, adminAndManager, getTotalCars);

carsRoutes.get(
  "/all-including-unpaid",
  ProtectRoute,
  adminAndManager,
  getAllCarsIncludingUnpaid,
);

carsRoutes.post("/", ProtectRoute, validateRequest(createCarSchema), createCar);

carsRoutes.put(
  "/:id",
  ProtectRoute,
  validateRequest(createCarSchema),
  updateCar,
);

carsRoutes.delete("/:id", ProtectRoute, deleteCar);

carsRoutes.get("/", getAllCars);

carsRoutes.get("/:id", getCarById);

export default carsRoutes;
