import express from "express";
import { getVapidPublicKey, subscribe, unsubscribe, toggleNotifications } from "../controllers/pushController.ts";
import { ProtectRoute } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const pushRoutes = express.Router();

pushRoutes.get("/vapid-public-key", getVapidPublicKey);
pushRoutes.post("/subscribe", ProtectRoute, subscribe);
pushRoutes.post("/unsubscribe", ProtectRoute, unsubscribe);
pushRoutes.post("/toggle", ProtectRoute, toggleNotifications);

export default pushRoutes;
