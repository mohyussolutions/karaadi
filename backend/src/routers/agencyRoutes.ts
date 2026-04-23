import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

import express from "express";
import {
  createAgency,
  deleteAgency,
  getAgencyStats,
  getAllAgencies,
  updateAgency,
} from "src/controllers/agencyController.ts";

const agencyRoutes = express.Router();

agencyRoutes.get("/stats", ProtectRoute, adminAndManager, getAgencyStats);
agencyRoutes.get("/", getAllAgencies);
agencyRoutes.post("/", ProtectRoute, adminAndManager, createAgency);
agencyRoutes.put("/:id", ProtectRoute, adminAndManager, updateAgency);
agencyRoutes.delete("/:id", ProtectRoute, adminAndManager, deleteAgency);

export default agencyRoutes;
