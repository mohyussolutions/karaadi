import { Router } from "express";
import {
  getAllMotorcycles,
  getMotorcycleById,
  createMotorcycle,
  updateMotorcycle,
  deleteMotorcycle,
  getTotalMotorcycles,
  getAllMotorcyclesIncludingUnpaid,
} from "../../controllers/categoryController/motorcyclesController.ts";
import { ProtectRoute } from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";

const motorcyclesRoutes = Router();

motorcyclesRoutes.get("/", (req, res, next) => {
  getAllMotorcycles(req, res).catch(next);
});

motorcyclesRoutes.get("/all-including-unpaid", (req, res, next) => {
  getAllMotorcyclesIncludingUnpaid(req, res).catch(next);
});

motorcyclesRoutes.get("/total", (req, res, next) => {
  getTotalMotorcycles(req, res).catch(next);
});

motorcyclesRoutes.get("/:id", (req, res, next) => {
  getMotorcycleById(req, res).catch(next);
});

motorcyclesRoutes.post("/", ProtectRoute, (req, res, next) => {
  createMotorcycle(req, res).catch(next);
});

motorcyclesRoutes.patch("/:id", ProtectRoute, (req, res, next) => {
  updateMotorcycle(req, res).catch(next);
});

motorcyclesRoutes.delete("/:id", ProtectRoute, (req, res, next) => {
  deleteMotorcycle(req, res).catch(next);
});

export default motorcyclesRoutes;
