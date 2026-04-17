import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import session from "express-session";
import { RedisStore } from "connect-redis";
import cookieParser from "cookie-parser";
import compression from "compression";
import redisServer from "./services/redisserver/redisServer.js";
import { setupSecurity } from "./core/middelware/securityMiddleware.js";
import { logger } from "./core/middelware/logger.js";

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
import locRoutes from "./routers/categoryRoute/locRoutes.js";
import redisStatsRouter from "./routers/redisStatsRouter.js";
import historySearchRoutes from "./routers/userRoute/historySearchRoutes.js";
import traktorRoutes from "./routers/categoryRoute/FarmequipmentRouter.js";
import jobsRouter from "./routers/categoryRoute/jobsRouter.js";
import hageRouter from "./AI/hageRouter.js";
import reportRoutes from "./routers/categoryRoute/reportRoute.js";
import { setupServerUtils } from "./core/utils/serverUtils.ts";
import { overloadMiddleware } from "./core/middelware/overloadMiddleware.js";
import { SESSION_TIME_MS } from "./config/session-time.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const isProd = process.env.NODE_ENV === "production";

app.get("/health", (req, res) =>
  res.status(200).json({ status: "OK", pid: process.pid }),
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../assets"), { maxAge: "1d" }),
);

setupSecurity(app);
setupServerUtils(app);

app.use(cookieParser());
if (!isProd) app.use(morgan("dev"));
app.use(compression());

app.use(
  session({
    store: new RedisStore({ client: redisServer.getClient() }),
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    proxy: isProd,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: SESSION_TIME_MS,
      domain: process.env.COOKIE_DOMAIN,
    },
  }),
);

app.use(overloadMiddleware);

const apiRouter = express.Router();
apiRouter.use("/marketplace", marketplaceRoutes);
apiRouter.use("/cars", carsRoutes);
apiRouter.use("/boats", boatsRoutes);
apiRouter.use("/motorcycles", motorcyclesRoutes);
apiRouter.use("/real-estate", realEstateRouter);
apiRouter.use("/traktor", traktorRoutes);
apiRouter.use("/ads", myAdsRouter);
apiRouter.use("/favorites", favoriteRoutes);
apiRouter.use("/recommendations", recommendationRoutes);
apiRouter.use("/advertisements", advertisementRouter);
apiRouter.use("/notifications", notificationRoutes);
apiRouter.use("/subscription", subscriptionRoute);
apiRouter.use("/chats", chatRoutes);
apiRouter.use("/messages", messageRoutes);
apiRouter.use("/contactUs", contactUsRouter);
apiRouter.use("/agencies", agencyRoutes);
apiRouter.use("/users", authRouters);
apiRouter.use("/payments", paymentRoutes);
apiRouter.use("/Fee", FeeRoutes);
apiRouter.use("/customers", customerSupportRoutes);
apiRouter.use("/visitors", visitorRoute);
apiRouter.use("/search", searchRouter);
apiRouter.use("/filtering", filterRouter);
apiRouter.use("/jobs", jobsRouter);
apiRouter.use("/locations", locRoutes);
apiRouter.use("/redis", redisStatsRouter);
apiRouter.use("/history-search", historySearchRoutes);
apiRouter.use("/reports", reportRoutes);
apiRouter.use("/hage", hageRouter);
app.use("/api", apiRouter);

app.use(
  (
    err: unknown,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    try {
      logger.error((err as any)?.stack || err);
    } catch {}
    const msg =
      typeof (req as any).t === "function"
        ? (req as any).t("api_errors.server_error")
        : "Server error";
    res.status(500).json({ message: msg });
  },
);

app.use((req: express.Request, res: express.Response) => {
  const msg =
    typeof (req as any).t === "function"
      ? (req as any).t("api_errors.not_found")
      : "Not found";
  res.status(404).json({ message: msg });
});

export default app;
