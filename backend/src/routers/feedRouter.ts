import { Router } from "express";
import { getFeed } from "../controllers/feedController.ts";

const feedRouter = Router();

feedRouter.get("/", getFeed);

export default feedRouter;
