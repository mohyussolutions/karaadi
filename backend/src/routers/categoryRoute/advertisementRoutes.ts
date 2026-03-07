import { Router } from "express";
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
} from "../../controllers/categoryController/advertisementController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

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
  createAdvertisement,
);
advertisementRouter.put(
  "/:id",
  ProtectRoute,
  adminAndManager,
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
