import { Router } from "express";
import {
  getAllRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  syncAllLocations,
  getLocationStats,
  getAllCities,
  createCity,
  deleteCity,
} from "../../controllers/categoryController/IocController.ts";

const locRoutes = Router();

locRoutes.get("/stats", getLocationStats);
locRoutes.post("/sync", syncAllLocations);

locRoutes.get("/regions", getAllRegions);
locRoutes.get("/regions/:id", getRegionById);
locRoutes.post("/regions", createRegion);
locRoutes.put("/regions/:id", updateRegion);
locRoutes.delete("/regions/:id", deleteRegion);

locRoutes.get("/cities", getAllCities);
locRoutes.post("/cities", createCity);
locRoutes.delete("/cities/:id", deleteCity);

export default locRoutes;
