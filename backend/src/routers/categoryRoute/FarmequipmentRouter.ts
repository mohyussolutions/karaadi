import { Router } from "express";
import {
  getAllTractors,
  getAllTractorsIncludingUnpaid,
  getTotalTractors,
  getTractorById,
  updateTractor,
  deleteTractor,
  createfarmequipment,
} from "../../controllers/categoryController/FarmequipmentController.ts";
import {
  ProtectRoute,
  adminAndManager,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const traktorRoutes = Router();

traktorRoutes.get("/", (req, res, next) =>
  getAllTractors(req, res).catch(next),
);
traktorRoutes.get(
  "/all-including-unpaid",
  ProtectRoute,
  adminAndManager,
  (req, res, next) => getAllTractorsIncludingUnpaid(req, res).catch(next),
);
traktorRoutes.get("/total", ProtectRoute, adminAndManager, (req, res, next) =>
  getTotalTractors(req, res).catch(next),
);
traktorRoutes.get("/:id", (req, res, next) =>
  getTractorById(req, res).catch(next),
);
traktorRoutes.post("/", ProtectRoute, (req, res, next) =>
  createfarmequipment(req, res).catch(next),
);
traktorRoutes.patch("/:id", ProtectRoute, (req, res, next) =>
  updateTractor(req, res).catch(next),
);
traktorRoutes.delete("/:id", ProtectRoute, (req, res, next) =>
  deleteTractor(req, res).catch(next),
);

export default traktorRoutes;
