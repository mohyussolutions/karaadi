import { Router } from "express";
import {
  createSearchLog,
  deleteSearchLogByQuery,
  getAdminLogs,
  getPopularSearches,
} from "src/controllers/userController/historySearchController.ts";
import {
  ProtectRoute,
  adminAndManager,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const historySearchRoutes = Router();

historySearchRoutes.post("/log", createSearchLog);

historySearchRoutes.get(
  "/admin/logs",
  ProtectRoute,
  adminAndManager,
  getAdminLogs,
);

historySearchRoutes.get("/admin/popular", getPopularSearches);

historySearchRoutes.delete(
  "/delete-by-query",
  ProtectRoute,
  adminAndManager,
  deleteSearchLogByQuery,
);

export default historySearchRoutes;
