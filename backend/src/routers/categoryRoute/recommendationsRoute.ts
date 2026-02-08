import {
  createRecommendation,
  deleteByExternalId,
  deleteRecommendation,
  getRecommendations,
  incrementViews,
} from "../../controllers/categoryController/recommendationController.ts";

import { Router } from "express";
import { ProtectRoute } from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";

const recommendationRoutes = Router();

recommendationRoutes.get("/", (req, res, next) =>
  getRecommendations(req, res).catch(next),
);

recommendationRoutes.post("/", ProtectRoute, (req, res, next) =>
  createRecommendation(req, res).catch(next),
);

recommendationRoutes.delete("/:id", ProtectRoute, (req, res, next) =>
  deleteRecommendation(req, res).catch(next),
);

recommendationRoutes.delete(
  "/external/:externalId",
  ProtectRoute,
  (req, res, next) => deleteByExternalId(req, res).catch(next),
);

recommendationRoutes.post("/track-view", (req, res, next) =>
  incrementViews(req, res).catch(next),
);

export default recommendationRoutes;
