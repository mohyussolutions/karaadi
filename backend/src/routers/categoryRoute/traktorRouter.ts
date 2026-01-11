import { Router } from "express";
import {
  getAllTractors,
  getAllTractorsIncludingUnpaid,
  getTotalTractors,
  getTractorById,
  createTractor,
  updateTractor,
  deleteTractor,
} from "../../controllers/categoryController/traktorController.ts";
import { ProtectRoute } from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";

const traktorRoutes = Router();

traktorRoutes.get("/", (req, res, next) =>
  getAllTractors(req, res).catch(next)
);
traktorRoutes.get("/all-including-unpaid", (req, res, next) =>
  getAllTractorsIncludingUnpaid(req, res).catch(next)
);
traktorRoutes.get("/total", (req, res, next) =>
  getTotalTractors(req, res).catch(next)
);
traktorRoutes.get("/:id", (req, res, next) =>
  getTractorById(req, res).catch(next)
);
traktorRoutes.post("/", ProtectRoute, (req, res, next) =>
  createTractor(req, res).catch(next)
);
traktorRoutes.patch("/:id", ProtectRoute, (req, res, next) =>
  updateTractor(req, res).catch(next)
);
traktorRoutes.delete("/:id", ProtectRoute, (req, res, next) =>
  deleteTractor(req, res).catch(next)
);

export default traktorRoutes;
