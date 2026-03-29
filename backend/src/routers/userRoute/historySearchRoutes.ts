import { Router } from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  createSearchLogSchema,
  deleteSearchLogSchema,
} from "../../validation/historySearch.validation.ts";
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

historySearchRoutes.post(
  "/log",
  validateRequest(createSearchLogSchema),
  createSearchLog,
);

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
  validateRequest(deleteSearchLogSchema, "query"),
  deleteSearchLogByQuery,
);

export default historySearchRoutes;
