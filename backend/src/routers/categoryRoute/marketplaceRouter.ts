import {
  adminAndManager,
  ProtectRoute,
} from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";
import {
  createMarketplaceItem,
  deleteMarketplaceItem,
  getAllMarketplaceItems,
  getAllMarketplaceItemsAdmin,
  getMarketplaceItemById,
  getTotalMarketplaceItems,
  updateMarketplaceItem,
} from "../../controllers/categoryController/marketplaceController.ts";
import { Router } from "express";
import { createMarketplaceItemSchema } from "../../validation/marketplace.validation.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";

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

marketplaceRoutes.patch(
  "/:id",
  ProtectRoute,
  validateRequest(createMarketplaceItemSchema),
  updateMarketplaceItem,
);

marketplaceRoutes.delete("/:id", ProtectRoute, deleteMarketplaceItem);

export default marketplaceRoutes;
