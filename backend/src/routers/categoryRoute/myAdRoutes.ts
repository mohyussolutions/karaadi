import {
  deleteAd,
  getAds,
  updateAd,
} from "controllers/categoryController/myAdController.ts";
import { ProtectRoute } from "core/middelware/authMiddlewareBothDbAndCognito.ts";
import express from "express";
import { Response, Request } from "express";

const myAdsRouter = express.Router();

myAdsRouter.get("/my-ads", ProtectRoute, (req: Request, res: Response) => {
  getAds(req, res);
});

myAdsRouter.put("/update/:id", ProtectRoute, (req: Request, res: Response) => {
  updateAd(req, res);
});

myAdsRouter.delete(
  "/delete/:id",
  ProtectRoute,
  (req: Request, res: Response) => {
    deleteAd(req, res);
  }
);

export default myAdsRouter;
