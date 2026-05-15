import { Router } from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  createSearchLogSchema,
  deleteSearchLogSchema,
} from "src/validation/historySearch.validation.ts";

import {
  ProtectRoute,
  adminAndManager,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import {
  createSearchLog,
  deleteSearchLogByQuery,
  getAdminLogs,
  getPopularSearches,
  getUserSearchLogs,
} from "src/controllers/historySearchController.ts";

const historySearchRoutes = Router();

historySearchRoutes.get("/", getUserSearchLogs);

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

historySearchRoutes.get(
  "/admin/popular",
  ProtectRoute,
  adminAndManager,
  getPopularSearches,
);

historySearchRoutes.delete(
  "/delete-by-query",
  ProtectRoute,
  adminAndManager,
  validateRequest(deleteSearchLogSchema, "query"),
  deleteSearchLogByQuery,
);

export default historySearchRoutes;
