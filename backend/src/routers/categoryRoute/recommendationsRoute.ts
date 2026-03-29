import { ProtectRoute } from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";
import {
  createRecommendation,
  deleteByExternalId,
  deleteRecommendation,
  getRecommendations,
  incrementViews,
  getMostViewedCategories,
  getUserTopCategories,
  getMostClickedItems,
  getCategoryClickThroughRate,
  getTrendingCategories,
} from "../../controllers/categoryController/recommendationController.ts";
import { Router } from "express";

const recommendationRoutes = Router();

recommendationRoutes.get("/", getRecommendations);

recommendationRoutes.get(
  "/categories/most-viewed",
  ProtectRoute,
  getMostViewedCategories,
);

recommendationRoutes.get(
  "/categories/user-top",
  ProtectRoute,
  getUserTopCategories,
);

recommendationRoutes.get(
  "/categories/trending",
  ProtectRoute,
  getTrendingCategories,
);

recommendationRoutes.get(
  "/items/most-clicked",
  ProtectRoute,
  getMostClickedItems,
);

recommendationRoutes.get(
  "/categories/:category/ctr",
  ProtectRoute,
  getCategoryClickThroughRate,
);

recommendationRoutes.post("/", ProtectRoute, createRecommendation);

recommendationRoutes.delete("/:id", ProtectRoute, deleteRecommendation);

recommendationRoutes.delete(
  "/external/:externalId",
  ProtectRoute,
  deleteByExternalId,
);

recommendationRoutes.post("/track-view", ProtectRoute, incrementViews);

export default recommendationRoutes;
