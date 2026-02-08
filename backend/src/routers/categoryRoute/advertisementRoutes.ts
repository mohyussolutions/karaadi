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

const advertisementRouter = Router();

advertisementRouter.get("/", getAllAdvertisements);
advertisementRouter.get("/stats", getAdStats);
advertisementRouter.get("/today-stats", getTodayAdStats);
advertisementRouter.get("/:id", getAdvertisementById);
advertisementRouter.get("/user/:userId", getUserAdvertisements);
advertisementRouter.post("/", createAdvertisement);
advertisementRouter.put("/:id", updateAdvertisement);
advertisementRouter.delete("/:id", deleteAdvertisement);
advertisementRouter.post("/:id/click", incrementAdClicks);

export default advertisementRouter;
