import express from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  deleteAd,
  getAdById,
  getAds,
  patchAd,
  updateAd,
} from "src/controllers/myAdController.ts";
import { ProtectRoute } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import { updateAdSchema } from "src/validation/myAd.validation.ts";

const myAdsRouter = express.Router();

myAdsRouter.get("/my-ads", ProtectRoute, getAds);
myAdsRouter.get("/:id", ProtectRoute, getAdById);

myAdsRouter.put(
  "/update/:id",
  ProtectRoute,
  validateRequest(updateAdSchema),
  updateAd,
);

myAdsRouter.patch("/:id", ProtectRoute, patchAd);
myAdsRouter.delete("/delete/:id", ProtectRoute, deleteAd);

export default myAdsRouter;
