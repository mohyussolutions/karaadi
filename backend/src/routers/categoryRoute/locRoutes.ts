import {
  citiesWithMostItemListings,
  regionsWithMostItemListings,
} from "../../controllers/categoryController/IocController.ts";

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
import { ProtectRoute } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  createRegionSchema,
  createCitySchema,
} from "../../validation/region.validation.ts";

const locRoutes = Router();

locRoutes.get(
  "/analytics/regions-with-most-item-listings",
  regionsWithMostItemListings,
);
locRoutes.get(
  "/analytics/cities-with-most-item-listings",
  citiesWithMostItemListings,
);

locRoutes.get("/stats", getLocationStats);
locRoutes.post("/sync", ProtectRoute, syncAllLocations);

locRoutes.get("/regions", getAllRegions);
locRoutes.get("/regions/:id", getRegionById);
locRoutes.post(
  "/regions",
  ProtectRoute,
  validateRequest(createRegionSchema),
  createRegion,
);
locRoutes.put(
  "/regions/:id",
  ProtectRoute,
  validateRequest(createRegionSchema),
  updateRegion,
);
locRoutes.delete("/regions/:id", ProtectRoute, deleteRegion);

locRoutes.get("/cities", getAllCities);
locRoutes.post(
  "/cities",
  ProtectRoute,
  validateRequest(createCitySchema),
  createCity,
);
locRoutes.delete("/cities/:id", ProtectRoute, deleteCity);

export default locRoutes;
