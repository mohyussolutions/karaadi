import { Router } from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  getFilterMetadata,
  globalFiltering,
  rangePriceAndRooms,
} from "src/controllers/globalFilteringController.ts";
import { globalFilteringQuerySchema } from "src/validation/globalFiltering.validation.ts";

const filterRouter = Router();

filterRouter.get(
  "/global-filter",
  validateRequest(globalFilteringQuerySchema, "query"),
  globalFiltering,
);
filterRouter.get("/metadata", getFilterMetadata);
filterRouter.get("/range-price-rooms", rangePriceAndRooms);

export default filterRouter;
