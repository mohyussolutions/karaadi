import { Router } from "express";
import {
  deleteVisitor,
  getAllVisitors,
  trackVisitor,
  updateVisitor,
} from "src/controllers/vissedcontroller.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const visitorRoute = Router();

visitorRoute.post("/track-user", trackVisitor);
visitorRoute.get("/all", ProtectRoute, adminAndManager, getAllVisitors);
visitorRoute.patch("/:userId", ProtectRoute, updateVisitor);
visitorRoute.delete("/:userId", ProtectRoute, deleteVisitor);

export default visitorRoute;
