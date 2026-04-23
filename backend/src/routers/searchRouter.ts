import { Router } from "express";
import { globalSearch } from "src/controllers/searchController.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import { globalSearchQuerySchema } from "src/validation/search.validation.ts";

const searchRouter = Router();

searchRouter.get(
  "/",
  validateRequest(globalSearchQuerySchema, "query"),
  globalSearch,
);

export default searchRouter;
