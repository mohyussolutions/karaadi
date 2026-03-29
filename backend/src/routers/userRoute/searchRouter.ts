import { globalSearch } from "../../controllers/userController/searchController.ts";
import { Router } from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import { globalSearchQuerySchema } from "../../validation/search.validation.ts";

const searchRouter = Router();

searchRouter.get(
  "/",
  validateRequest(globalSearchQuerySchema, "query"),
  globalSearch,
);

export default searchRouter;
