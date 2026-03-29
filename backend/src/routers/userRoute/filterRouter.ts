import { Router } from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import { globalFilteringQuerySchema } from "../../validation/globalFiltering.validation.ts";
import {
  globalFiltering,
  getFilterMetadata,
  rangePriceAndRooms,
} from "../../controllers/userController/globalFilteringController.ts";

const filterRouter = Router();

filterRouter.get(
  "/global-filter",
  validateRequest(globalFilteringQuerySchema, "query"),
  globalFiltering,
);
filterRouter.get("/metadata", getFilterMetadata);
filterRouter.get("/range-price-rooms", rangePriceAndRooms);

export default filterRouter;
