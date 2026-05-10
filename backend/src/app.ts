import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import session from "express-session";
import { RedisStore } from "connect-redis";
import cookieParser from "cookie-parser";
import compression from "compression";
import { setupSecurity } from "./core/middelware/securityMiddleware.js";
import { logger } from "./core/middelware/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const isProd = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: "https://main.d2vxkvyn6xd6kq.amplifyapp.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires", "X-Access-Token"],
  }),
);

app.disable("x-powered-by");
if (isProd) app.set("trust proxy", 1);

app.use(
  "/assets",
  express.static(path.join(__dirname, "../assets"), { maxAge: "1d" }),
);
app.use(
  "/imagesStore",
  express.static(path.join(process.cwd(), "imagesStore"), { maxAge: "1d" }),
);

setupSecurity(app);

app.get("/health", (req, res) =>
  res.status(200).json({ status: "OK", pid: process.pid }),
);

app.use(cookieParser());
if (!isProd) app.use(morgan("dev"));
app.use(compression());

app.use(
  session({
    store: cacheManager.isReady()
      ? new RedisStore({ client: redisServer.getClient() })
      : undefined,
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

app.use(overloadMiddleware);

const apiRouter = express.Router();

import prisma from "./core/utils/db.ts";
import { getDashboardSummary } from "./controllers/dashboardController.ts";
import { setupServerUtils } from "./core/utils/serverUtils.ts";
import { SESSION_TIME_MS } from "./config/session-time.ts";
import { overloadMiddleware } from "./core/middelware/overloadMiddleware.ts";
import marketplaceRoutes from "./routers/marketplaceRouter.ts";
import boatsRoutes from "./routers/boatsRouter.ts";
import carsRoutes from "./routers/carsRouter.ts";
import motorcyclesRoutes from "./routers/motorcyclesRouter.ts";
import realEstateRouter from "./routers/realEstateRouter.ts";
import traktorRoutes from "./routers/FarmequipmentRouter.ts";
import myAdsRouter from "./routers/myAdRoutes.ts";
import favoriteRoutes from "./routers/favoriteRoutes.ts";
import recommendationRoutes from "./routers/recommendationsRoute.ts";
import advertisementRouter from "./routers/advertisementRoutes.ts";
import notificationRoutes from "./routers/notificationRoute.ts";
import subscriptionRoute from "./routers/subsRoute.ts";
import chatRoutes from "./routers/chatRoute.ts";
import contactUsRouter from "./routers/contactUsRoutes.ts";
import messageRoutes from "./routers/messageRoute.ts";
import hageRouter from "./AI/hageRouter.ts";
import socialRouter from "./routers/socialRouter.ts";
import feedRouter from "./routers/feedRouter.ts";
import imageRouter from "./routers/imageRouter.ts";
import businessPlanRoute from "./routers/businessPlanRoute.ts";
import businessRoute from "./routers/businessRoute.ts";
import reportRoutes from "./routers/reportRoute.ts";
import historySearchRoutes from "./routers/historySearchRoutes.ts";
import redisStatsRouter from "./routers/redisStatsRouter.ts";
import locRoutes from "./routers/locRoutes.ts";
import jobsRouter from "./routers/jobsRouter.ts";
import filterRouter from "./routers/filterRouter.ts";
import searchRouter from "./routers/searchRouter.ts";
import visitorRoute from "./routers/vissedRoute.ts";
import customerSupportRoutes from "./routers/customersupportRoute.ts";
import paymentRoutes from "./routers/paymentRoutes.ts";
import FeeRoutes from "./routers/FeeRoutes.ts";
import initiateRouter from "./routers/initiateRouter.ts";
import authRouters from "./routers/authRoute.ts";
import redisServer from "./services/redis/redisServer.ts";
import cacheManager from "./services/redis/cacheManager.ts";

setupServerUtils(app);

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
apiRouter.use("/users", authRouters);
apiRouter.use("/payments", initiateRouter);
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
apiRouter.use("/businesses", businessRoute);
apiRouter.use("/business-plans", businessPlanRoute);
apiRouter.use("/feed", feedRouter);
apiRouter.use("/images", imageRouter);

apiRouter.get("/items/:id", async (req, res) => {
  const { id } = req.params;
  const include = {
    user: {
      select: { id: true, username: true, profileImage: true, phone: true },
    },
  };
  const [marketplace, car, realEstate, boat, motorcycle, farm] =
    await Promise.all([
      (prisma as any).marketplace
        .findUnique({ where: { id }, include })
        .catch(() => null),
      (prisma as any).car
        .findUnique({ where: { id }, include })
        .catch(() => null),
      (prisma as any).realEstate
        .findUnique({ where: { id }, include })
        .catch(() => null),
      (prisma as any).boat
        .findUnique({ where: { id }, include })
        .catch(() => null),
      (prisma as any).motorcycle
        .findUnique({ where: { id }, include })
        .catch(() => null),
      (prisma as any).farmequipment
        .findUnique({ where: { id }, include })
        .catch(() => null),
    ]);

  let item = car || marketplace || realEstate || boat || motorcycle || farm;
  let table = car
    ? "cars"
    : marketplace
      ? "marketplace"
      : realEstate
        ? "real-estate"
        : boat
          ? "boats"
          : motorcycle
            ? "motorcycles"
            : farm
              ? "traktor"
              : "";

  if (!item) return res.status(404).json({ error: "Not found" });
  const images = ((item.images ?? []) as string[])
    .map((img, idx) =>
      img && img.startsWith("data:") ? `api/images/${table}/${id}/${idx}` : img,
    )
    .filter((img) => img && img.trim() !== "");
  res.json({ ...item, images });
});

apiRouter.use("/social", socialRouter);
apiRouter.use("/hage", hageRouter);
apiRouter.get("/dashboard/summary", getDashboardSummary);

app.use("/api", apiRouter);

app.use((req: express.Request, res: express.Response) => {
  const msg =
    typeof (req as any).t === "function"
      ? (req as any).t("api_errors.not_found")
      : "Not found";
  res.status(404).json({ message: msg });
});

export default app;
