import { Router } from "express";
import {
  globalFiltering,
  getFilterMetadata,
  rangePriceAndRooms,
} from "../../controllers/userController/globalFilteringController.ts";

const filterRouter = Router();

filterRouter.get("/global-filter", globalFiltering);
filterRouter.get("/metadata", getFilterMetadata);
filterRouter.get("/range-price-rooms", rangePriceAndRooms);

export default filterRouter;
