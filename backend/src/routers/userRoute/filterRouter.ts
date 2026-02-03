import { Router } from "express";
import {
  globalFiltering,
  getFilterMetadata,
} from "controllers/userController/globalFilteringController.ts";

const filterRouter = Router();

filterRouter.get("/global-filter", globalFiltering);
filterRouter.get("/metadata", getFilterMetadata);

export default filterRouter;
