import { Router } from "express";
import {
  waafiInitiate,
  waafiStatus,
  mobileInitiate,
  mobileStatus,
} from "src/controllers/initiateController.ts";

const initiateRouter = Router();

initiateRouter.post("/waafi/initiate", waafiInitiate);
initiateRouter.get("/waafi/status/:ref", waafiStatus);
initiateRouter.post("/mobile/initiate", mobileInitiate);
initiateRouter.get("/mobile/status/:ref", mobileStatus);

export default initiateRouter;
