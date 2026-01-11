import { Router } from "express";
import {
  getAllBoats,
  getBoatById,
  createBoat,
  updateBoat,
  deleteBoat,
  getTotalBoats,
  getAllBoatsIncludingUnpaid,
} from "../../controllers/categoryController/boatsController.ts";

const boatsRoutes = Router();
boatsRoutes.get("/total", getTotalBoats);

boatsRoutes.get("/all-including-unpaid", getAllBoatsIncludingUnpaid);
boatsRoutes.get("/", (req, res, next) => {
  getAllBoats(req, res).catch(next);
});

boatsRoutes.get("/:id", (req, res, next) => {
  getBoatById(req, res).catch(next);
});

boatsRoutes.post("/", (req, res, next) => {
  createBoat(req, res).catch(next);
});

boatsRoutes.put("/:id", (req, res, next) => {
  updateBoat(req, res).catch(next);
});

boatsRoutes.delete("/:id", (req, res, next) => {
  deleteBoat(req, res).catch(next);
});

export default boatsRoutes;
