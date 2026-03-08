import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import type { Request, Response, NextFunction } from "express";
import compression from "compression";
import { monitorEventLoopDelay } from "node:perf_hooks";
import marketplaceRoutes from "./routers/categoryRoute/marketplaceRouter.js";
import realEstateRouter from "./routers/categoryRoute/realEstateRouter.js";
import boatsRoutes from "./routers/categoryRoute/boatsRouter.js";
import carsRoutes from "./routers/categoryRoute/carsRouter.js";
import motorcyclesRoutes from "./routers/categoryRoute/motorcyclesRouter.js";
import myAdsRouter from "./routers/categoryRoute/myAdRoutes.js";
import favoriteRoutes from "./routers/categoryRoute/favoriteRoutes.js";
import recommendationRoutes from "./routers/categoryRoute/recommendationsRoute.js";
import advertisementRouter from "./routers/categoryRoute/advertisementRoutes.js";
import notificationRoutes from "./routers/userRoute/notificationRoute.js";
import subscriptionRoute from "./routers/categoryRoute/subsRoute.js";
import chatRoutes from "./routers/userRoute/chatRoute.js";
import contactUsRouter from "./routers/userRoute/contactUsRoutes.js";
import messageRoutes from "./routers/userRoute/messageRoute.js";
import agencyRoutes from "./routers/agencyRoutes.js";
import authRouters from "./routers/userRoute/authRoute.js";
import paymentRoutes from "./routers/paymentRoute/paymentRoutes.js";
import FeeRoutes from "./routers/paymentRoute/FeeRoutes.js";
import customerSupportRoutes from "./routers/userRoute/customersupportRoute.js";
import searchRouter from "./routers/userRoute/searchRouter.js";
import filterRouter from "./routers/userRoute/filterRouter.js";
import visitorRoute from "./routers/userRoute/vissedRoute.js";
import uploadRouterSelector from "./routers/paymentRoute/uploadRouterSelector.js";
import locRoutes from "./routers/categoryRoute/locRoutes.js";
import redisStatsRouter from "./routers/redisStatsRouter.js";
import historySearchRoutes from "./routers/userRoute/historySearchRoutes.js";
import { setupSecurity } from "./core/middelware/securityMiddleware.ts";
import traktorRoutes from "./routers/categoryRoute/FarmequipmentRouter.ts";
import jobsRouter from "./routers/categoryRoute/jobsRouter.ts";
import hageRouter from "./AI/hageRouter.ts";
import reportRoutes from "./routers/categoryRoute/reportRoute.ts";
import { SESSION_TIME_MS } from "./constants/session-time.ts";

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
app.use((req, res, next) => {
  if (
    req.headers["x-forwarded-proto"] !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
setupSecurity(app);

app.use(cookieParser());
app.use(morgan("dev"));
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      maxAge: SESSION_TIME_MS,
      domain: process.env.COOKIE_DOMAIN,
    },
  }),
);

app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/boats", boatsRoutes);
app.use("/api/motorcycles", motorcyclesRoutes);
app.use("/api/real-estate", realEstateRouter);
app.use("/api/traktor", traktorRoutes);
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
app.use("/api/jobs", jobsRouter);
app.use("/api/locations", locRoutes);
app.use("/api/redis", redisStatsRouter);
app.use("/api/history-search", historySearchRoutes);
app.use("/api/reports", reportRoutes);
// AI Agency Route
app.use("/api/hage", hageRouter);
// Add more routes as needed
app.use("/assets", express.static(path.join(__dirname, "../assets")));

//app.use("/api/upload", uploadRouterSelector);
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/", (req, res) => res.send("API is running"));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
