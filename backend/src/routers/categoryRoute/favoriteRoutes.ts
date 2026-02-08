import { Router } from "express";

import {
  getMyFavorites,
  getFavoritesCount,
  getFavoriteById,
  createFavorite,
  updateFavorite,
  deleteFavorite,
} from "../../controllers/categoryController/favoriteController.ts";
import { ProtectRoute } from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";

const favoriteRoutes = Router();

favoriteRoutes.get("/my", ProtectRoute, getMyFavorites);
favoriteRoutes.get("/count", ProtectRoute, getFavoritesCount);
favoriteRoutes.get("/:id", ProtectRoute, getFavoriteById);
favoriteRoutes.post("/", ProtectRoute, createFavorite);
favoriteRoutes.put("/:id", ProtectRoute, updateFavorite);
favoriteRoutes.delete("/:id", ProtectRoute, deleteFavorite);

export default favoriteRoutes;
