import { Router } from "express";

import {
  getFavoritesCount,
  getFavoriteById,
  updateFavorite,
  getMyFavorites,
  createFavorite,
  deleteFavorite,
} from "src/controllers/favoriteController.ts";
import { ProtectRoute } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const favoriteRoutes = Router();

favoriteRoutes.get("/my", ProtectRoute, getMyFavorites);
favoriteRoutes.get("/count", ProtectRoute, getFavoritesCount);
favoriteRoutes.get("/:id", ProtectRoute, getFavoriteById);
favoriteRoutes.post("/", ProtectRoute, createFavorite);
favoriteRoutes.put("/:id", ProtectRoute, updateFavorite);
favoriteRoutes.delete("/:id", ProtectRoute, deleteFavorite);

export default favoriteRoutes;
