import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import {
  createAgency,
  deleteAgency,
  getAllAgencies,
  updateAgency,
  getAgencyStats,
} from "../controllers/categoryController/agencyController.ts";
import express from "express";

const agencyRoutes = express.Router();

agencyRoutes.get("/stats", ProtectRoute, adminAndManager, getAgencyStats);
agencyRoutes.get("/", getAllAgencies);
agencyRoutes.post("/", ProtectRoute, adminAndManager, createAgency);
agencyRoutes.put("/:id", ProtectRoute, adminAndManager, updateAgency);
agencyRoutes.delete("/:id", ProtectRoute, adminAndManager, deleteAgency);

export default agencyRoutes;
