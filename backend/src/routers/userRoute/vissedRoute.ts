import { Router } from "express";
import {
  deleteVisitor,
  getAllVisitors,
  trackVisitor,
  updateVisitor,
} from "controllers/userController/vissedcontroller.ts";

const visitorRoute = Router();

visitorRoute.post("/track-user", trackVisitor);
visitorRoute.get("/all", getAllVisitors);
visitorRoute.patch("/:userId", updateVisitor);
visitorRoute.delete("/:userId", deleteVisitor);

export default visitorRoute;
