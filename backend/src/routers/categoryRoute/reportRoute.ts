import { Router } from "express";
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  getReportStats,
  getUserReports,
  deleteReport,
  getTotalReports,
} from "src/controllers/categoryController/reportController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const reportRoutes = Router();

reportRoutes.post("/", ProtectRoute, createReport);
reportRoutes.get("/user/:userId", ProtectRoute, getUserReports);
reportRoutes.get("/", ProtectRoute, getReports);
reportRoutes.get("/stats", ProtectRoute, getReportStats);
reportRoutes.get("/total", ProtectRoute, adminAndManager, getTotalReports);
reportRoutes.get("/:id", ProtectRoute, getReportById);
reportRoutes.patch("/:id", ProtectRoute, updateReportStatus);
reportRoutes.delete("/:id", ProtectRoute, adminAndManager, deleteReport);

export default reportRoutes;
