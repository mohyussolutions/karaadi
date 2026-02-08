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

const marketplaceRoutes = Router();

marketplaceRoutes.get("/", (req, res, next) => {
  getAllMarketplaceItems(req, res).catch(next);
});
marketplaceRoutes.get("/total", (req, res, next) => {
  getTotalMarketplaceItems(req, res).catch(next);
});
marketplaceRoutes.get("/all-including-unpaid", (req, res, next) => {
  getAllMarketplaceItemsAdmin(req, res).catch(next);
});
marketplaceRoutes.get("/:id", (req, res, next) => {
  getMarketplaceItemById(req, res).catch(next);
});

marketplaceRoutes.post("/", (req, res, next) => {
  createMarketplaceItem(req, res).catch(next);
});

marketplaceRoutes.patch("/:id", (req, res, next) => {
  updateMarketplaceItem(req, res).catch(next);
});

marketplaceRoutes.delete("/:id", (req, res, next) => {
  deleteMarketplaceItem(req, res).catch(next);
});

export default marketplaceRoutes;
