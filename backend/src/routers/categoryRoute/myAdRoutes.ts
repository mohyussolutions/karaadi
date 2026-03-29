import express from "express";
import { ProtectRoute } from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import { updateAdSchema } from "../../validation/myAd.validation.ts";
import {
  deleteAd,
  getAds,
  updateAd,
} from "../../controllers/categoryController/myAdController.ts";

const myAdsRouter = express.Router();

myAdsRouter.get("/my-ads", ProtectRoute, getAds);

myAdsRouter.put(
  "/update/:id",
  ProtectRoute,
  validateRequest(updateAdSchema),
  updateAd,
);

myAdsRouter.delete("/delete/:id", ProtectRoute, deleteAd);

export default myAdsRouter;
