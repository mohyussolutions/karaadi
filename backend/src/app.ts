import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import type { Request, Response, NextFunction } from "express";
import compression from "compression";

import marketplaceRoutes from "./routers/categoryRoute/marketplaceRouter.ts";
import realEstateRouter from "./routers/categoryRoute/realEstateRouter.ts";
import boatsRoutes from "./routers/categoryRoute/boatsRouter.ts";
import carsRoutes from "./routers/categoryRoute/carsRouter.ts";
import traktorRoutes from "./routers/categoryRoute/traktorRouter.ts";
import motorcyclesRoutes from "./routers/categoryRoute/motorcyclesRouter.ts";
import myAdsRouter from "./routers/categoryRoute/myAdRoutes.ts";
import favoriteRoutes from "./routers/categoryRoute/favoriteRoutes.ts";
import recommendationRoutes from "./routers/categoryRoute/recommendationsRoute.ts";
import advertisementRouter from "./routers/categoryRoute/advertisementRoutes.ts";
import notificationRoutes from "./routers/userRoute/notificationRoute.ts";
import subscriptionRoute from "./routers/userRoute/subsRoute.ts";
import chatRoutes from "./routers/userRoute/chatRoute.ts";
import contactUsRouter from "./routers/userRoute/contactUsRoutes.ts";
import messageRoutes from "./routers/userRoute/messageRoute.ts";
import agencyRoutes from "./routers/agencyRoutes.ts";
import authRouters from "./routers/userRoute/authRoute.ts";
import paymentRoutes from "./routers/paymentRoute/paymentRoutes.ts";
import FeeRoutes from "./routers/paymentRoute/FeeRoutes.ts";
import customerSupportRoutes from "./routers/userRoute/customersupportRoute.ts";
import searchRouter from "./routers/userRoute/searchRouter.ts";
import filterRouter from "./routers/userRoute/filterRouter.ts";
import visitorRoute from "./routers/userRoute/vissedRoute.ts";
import uploadRouterSelector from "./routers/paymentRoute/uploadRouterSelector.ts";
import hageRouter from "./AIrRoute/hageRouter.ts";
import locRoutes from "./routers/categoryRoute/locRoutes.ts";
import redisStatsRouter from "./routers/redisStatsRouter.ts";
import { monitorEventLoopDelay } from "node:perf_hooks";
import historySearchRoutes from "./routers/userRoute/historySearchRoutes.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

const eventLoopDelay = monitorEventLoopDelay({ resolution: 20 });
eventLoopDelay.enable();

const EVENT_LOOP_LAG_THRESHOLD = 200;

app.use((req, res, next) => {
  if (eventLoopDelay.mean / 1e6 > EVENT_LOOP_LAG_THRESHOLD) {
    return res
      .status(503)
      .json({ message: "Server overloaded. Try again later." });
  }
  next();
});

app.use(
  cors({
    origin: (process.env.ALLOWED_ORIGINS || "").split(","),
    credentials: true,
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(compression());

const isProd = process.env.NODE_ENV === "production";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    proxy: isProd,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 86400000,
      domain: process.env.COOKIE_DOMAIN,
    },
  }),
);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/real-estate", realEstateRouter);
app.use("/api/cars", carsRoutes);
app.use("/api/boats", boatsRoutes);
app.use("/api/traktor", traktorRoutes);
app.use("/api/motorcycles", motorcyclesRoutes);
app.use("/api/ads", myAdsRouter);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/advertisements", advertisementRouter);
app.use("/api/notifications", notificationRoutes);
app.use("/api/subscription", subscriptionRoute);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/contactUs", contactUsRouter);
app.use("/api/agencies", agencyRoutes);
app.use("/api/users", authRouters);
app.use("/api/payments", paymentRoutes);
app.use("/api/Fee", FeeRoutes);
app.use("/api/customers", customerSupportRoutes);
app.use("/api/visitors", visitorRoute);
app.use("/api/search", searchRouter);
app.use("/api/filtering", filterRouter);
app.use("/api/upload", uploadRouterSelector);
app.use("/api/hage", hageRouter);
app.use("/api/locations", locRoutes);
app.use("/api/redis", redisStatsRouter);
app.use("/api/history-search", historySearchRoutes);
app.use("/imagesStore", express.static(path.join(__dirname, "imagesStore")));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("API is running"));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
