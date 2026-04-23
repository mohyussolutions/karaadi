import express from "express";
import localUploadRouter from "./uploadRouter.ts";

const uploadRouterSelector = express.Router();
uploadRouterSelector.use(localUploadRouter);

export default uploadRouterSelector;
