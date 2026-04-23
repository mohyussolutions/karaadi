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
  getReportsSummary,
} from "src/controllers/reportController.ts";

import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  createReportSchema,
  updateReportStatusSchema,
} from "src/validation/report.validation.ts";

const reportRoutes = Router();
reportRoutes.post(
  "/",
  ProtectRoute,
  validateRequest(createReportSchema),
  createReport,
);
reportRoutes.get("/summary", ProtectRoute, getReportsSummary);
reportRoutes.get("/user/:userId", ProtectRoute, getUserReports);
reportRoutes.get("/", ProtectRoute, getReports);
reportRoutes.get("/stats", ProtectRoute, getReportStats);
reportRoutes.get("/total", ProtectRoute, adminAndManager, getTotalReports);
reportRoutes.get("/:id", ProtectRoute, getReportById);
reportRoutes.patch(
  "/:id",
  ProtectRoute,
  validateRequest(updateReportStatusSchema),
  updateReportStatus,
);
reportRoutes.delete("/:id", ProtectRoute, adminAndManager, deleteReport);
export default reportRoutes;
