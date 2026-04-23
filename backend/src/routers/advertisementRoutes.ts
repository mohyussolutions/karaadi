import { Router } from "express";

import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";

import {
  createAdvertisement,
  deleteAdvertisement,
  getAdStats,
  getAdvertisementById,
  getAllAdvertisements,
  getTodayAdStats,
  incrementAdClicks,
  updateAdvertisement,
  getUserAdvertisements,
} from "src/controllers/advertisementController.ts";
import { createAdvertisementSchema } from "src/validation/advertisement.validation.ts";

const advertisementRouter = Router();

advertisementRouter.get("/", getAllAdvertisements);
advertisementRouter.get("/stats", getAdStats);
advertisementRouter.get("/today-stats", getTodayAdStats);
advertisementRouter.get("/:id", getAdvertisementById);
advertisementRouter.get("/user/:userId", getUserAdvertisements);
advertisementRouter.post(
  "/",
  ProtectRoute,
  adminAndManager,
  validateRequest(createAdvertisementSchema),
  createAdvertisement,
);
advertisementRouter.put(
  "/:id",
  ProtectRoute,
  adminAndManager,
  validateRequest(createAdvertisementSchema),
  updateAdvertisement,
);
advertisementRouter.delete(
  "/:id",
  ProtectRoute,
  adminAndManager,
  deleteAdvertisement,
);
advertisementRouter.post("/:id/click", incrementAdClicks);

export default advertisementRouter;
