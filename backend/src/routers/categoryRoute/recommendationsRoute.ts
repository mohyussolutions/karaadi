import { ProtectRoute } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
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

recommendationRoutes.get("/", (req, res, next) =>
  getRecommendations(req, res).catch(next),
);

recommendationRoutes.get(
  "/categories/most-viewed",
  ProtectRoute,
  (req, res, next) => getMostViewedCategories(req, res).catch(next),
);

recommendationRoutes.get(
  "/categories/user-top",
  ProtectRoute,
  (req, res, next) => getUserTopCategories(req, res).catch(next),
);

recommendationRoutes.get(
  "/categories/trending",
  ProtectRoute,
  (req, res, next) => getTrendingCategories(req, res).catch(next),
);

recommendationRoutes.get(
  "/items/most-clicked",
  ProtectRoute,
  (req, res, next) => getMostClickedItems(req, res).catch(next),
);

recommendationRoutes.get(
  "/categories/:category/ctr",
  ProtectRoute,
  (req, res, next) => getCategoryClickThroughRate(req, res).catch(next),
);

recommendationRoutes.post(
  "/",
  ProtectRoute,

  (req, res, next) => createRecommendation(req, res).catch(next),
);

recommendationRoutes.delete(
  "/:id",
  ProtectRoute,

  (req, res, next) => deleteRecommendation(req, res).catch(next),
);

recommendationRoutes.delete(
  "/external/:externalId",
  ProtectRoute,
  (req, res, next) => deleteByExternalId(req, res).catch(next),
);

recommendationRoutes.post("/track-view", ProtectRoute, (req, res, next) =>
  incrementViews(req, res).catch(next),
);

export default recommendationRoutes;
