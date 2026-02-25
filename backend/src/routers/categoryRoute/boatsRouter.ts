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

const boatsRoutes = Router();

boatsRoutes.get("/total", getTotalBoats);
boatsRoutes.get("/all-including-unpaid", getAllBoatsIncludingUnpaid);
boatsRoutes.get("/", getAllBoats);
boatsRoutes.get("/:id", getBoatById);
boatsRoutes.post("/", createBoat);
boatsRoutes.put("/:id/payment", updateBoatPayment);
boatsRoutes.put("/:id", updateBoat);
boatsRoutes.delete("/:id", deleteBoat);

export default boatsRoutes;
