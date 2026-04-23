import {
  createMarketplaceItem,
  deleteMarketplaceItem,
  getAllMarketplaceItems,
  getAllMarketplaceItemsAdmin,
  getMarketplaceItemById,
  getTotalMarketplaceItems,
  updateMarketplaceItem,
} from "../controllers/marketplaceController.ts";
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import { createMarketplaceItemSchema } from "src/validation/marketplace.validation.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const marketplaceRoutes = Router();

marketplaceRoutes.get("/", getAllMarketplaceItems);
marketplaceRoutes.get(
  "/total",
  ProtectRoute,
  adminAndManager,
  getTotalMarketplaceItems,
);
marketplaceRoutes.get(
  "/all-including-unpaid",
  ProtectRoute,
  adminAndManager,
  getAllMarketplaceItemsAdmin,
);
marketplaceRoutes.get("/:id", getMarketplaceItemById);

marketplaceRoutes.post(
  "/",
  ProtectRoute,
  validateRequest(createMarketplaceItemSchema),
  createMarketplaceItem,
);

const updateMarketplaceItemSchema = createMarketplaceItemSchema.partial();
marketplaceRoutes.patch(
  "/:id",
  ProtectRoute,
  validateRequest(updateMarketplaceItemSchema),
  updateMarketplaceItem,
);

marketplaceRoutes.delete("/:id", ProtectRoute, deleteMarketplaceItem);

export default marketplaceRoutes;
