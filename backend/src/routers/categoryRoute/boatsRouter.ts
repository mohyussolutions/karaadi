import { Router } from "express";
import {
  getAllBoats,
  getBoatById,
  createBoat,
  updateBoat,
  deleteBoat,
  getTotalBoats,
  getAllBoatsIncludingUnpaid,
  updateBoatPayment,
} from "../../controllers/categoryController/boatsController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const boatsRoutes = Router();

boatsRoutes.get("/total", ProtectRoute, adminAndManager, getTotalBoats);
boatsRoutes.get(
  "/all-including-unpaid",
  ProtectRoute,
  adminAndManager,
  getAllBoatsIncludingUnpaid,
);
boatsRoutes.get("/", getAllBoats);
boatsRoutes.get("/:id", getBoatById);
boatsRoutes.post("/", ProtectRoute, createBoat);
boatsRoutes.put("/:id/payment", updateBoatPayment);
boatsRoutes.put("/:id", updateBoat);
boatsRoutes.delete("/:id", deleteBoat);

export default boatsRoutes;
