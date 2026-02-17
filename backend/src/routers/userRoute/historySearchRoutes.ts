import { Router } from "express";
import {
  createSearchLog,
  deleteSearchLogByQuery,
  getAdminLogs,
  getPopularSearches,
} from "src/controllers/userController/historySearchController.ts";

const historySearchRoutes = Router();

historySearchRoutes.post("/log", createSearchLog);
historySearchRoutes.get("/admin/logs", getAdminLogs);
historySearchRoutes.get("/admin/popular", getPopularSearches);
historySearchRoutes.delete("/delete-by-query", deleteSearchLogByQuery);
export default historySearchRoutes;
