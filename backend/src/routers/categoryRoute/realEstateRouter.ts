import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import {
  createRealEstate,
  deleteRealEstate,
  getAllRealEstates,
  getAllRealEstatesIncludingUnpaid,
  getRealEstateById,
  getTotalRealEstates,
  updateRealEstate,
} from "../../controllers/categoryController/realEstateController.ts";
import { Router } from "express";

const realEstateRouter = Router();

realEstateRouter.get("/", (req, res, next) => {
  getAllRealEstates(req, res).catch(next);
});

realEstateRouter.get(
  "/all-including-unpaid",
  ProtectRoute,
  adminAndManager,
  (req, res, next) => {
    getAllRealEstatesIncludingUnpaid(req, res).catch(next);
  },
);

realEstateRouter.get(
  "/total",
  ProtectRoute,
  adminAndManager,
  (req, res, next) => {
    getTotalRealEstates(req, res).catch(next);
  },
);

realEstateRouter.get("/:id", (req, res, next) => {
  getRealEstateById(req, res).catch(next);
});

realEstateRouter.post("/", ProtectRoute, (req, res, next) => {
  createRealEstate(req, res).catch(next);
});

realEstateRouter.patch("/:id", ProtectRoute, (req, res, next) => {
  updateRealEstate(req, res).catch(next);
});

realEstateRouter.delete("/:id", ProtectRoute, (req, res, next) => {
  deleteRealEstate(req, res).catch(next);
});

export default realEstateRouter;
