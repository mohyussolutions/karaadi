import { Router } from "express";
import { serveImage } from "../controllers/imageController.ts";

const imageRouter = Router();
imageRouter.get("/:table/:id/:index", serveImage);
imageRouter.get("/:table/:id", serveImage);
export default imageRouter;
