import {
  createAgency,
  deleteAgency,
  getAllAgencies,
  updateAgency,
  getAgencyStats,
} from "../controllers/categoryController/agencyController.ts";
import express from "express";

const agencyRoutes = express.Router();

agencyRoutes.get("/stats", getAgencyStats);
agencyRoutes.get("/", getAllAgencies);
agencyRoutes.post("/", createAgency);
agencyRoutes.put("/:id", updateAgency);
agencyRoutes.delete("/:id", deleteAgency);

export default agencyRoutes;
