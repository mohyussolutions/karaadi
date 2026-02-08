import { globalSearch } from "../../controllers/userController/searchController.ts";
import { Router } from "express";

const searchRouter = Router();

searchRouter.get("/", globalSearch);

export default searchRouter;
