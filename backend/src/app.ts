import express from "express";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import type { Request, Response, NextFunction } from "express";
import marketplaceRoutes from "routers/categoryRoute/marketplaceRouter.ts";
import realEstateRouter from "routers/categoryRoute/realEstateRouter.ts";
import carsRoutes from "routers/categoryRoute/carsRouter.ts";
import boatsRoutes from "routers/categoryRoute/boatsRouter.ts";
import traktorRoutes from "routers/categoryRoute/traktorRouter.ts";
import motorcyclesRoutes from "routers/categoryRoute/motorcyclesRouter.ts";
import myAdsRouter from "routers/categoryRoute/myAdRoutes.ts";
import notificationRoutes from "routers/userRoute/notificationRoute.ts";
import chatRoutes from "routers/userRoute/chatRoute.ts";
import messageRoutes from "routers/userRoute/messageRoute.ts";
import authRouters from "routers/userRoute/authRoute.ts";
import customerSupportRoutes from "routers/userRoute/customersupportRoute.ts";
import visitorRoute from "routers/userRoute/vissedRoute.ts";
import favoriteRoutes from "routers/categoryRoute/favoriteRoutes.ts";
import subscriptionRoute from "routers/userRoute/subsRoute.ts";
import contactUsRouter from "routers/userRoute/contactUsRoutes.ts";
import recommendationRoutes from "routers/categoryRoute/recommendationsRoute.ts";
import advertisementRouter from "routers/categoryRoute/advertisementRoutes.ts";
import FeeRoutes from "routers/paymentRoute/FeeRoutes.ts";
import uploadRouterSelector from "routers/paymentRoute/uploadRouterSelector.ts";
import paymentRoutes from "routers/paymentRoute/paymentRoutes.ts";
import agencyRoutes from "routers/agencyRoutes.ts";
import searchRouter from "routers/userRoute/searchRouter.ts";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    exposedHeaders: ["set-cookie"],
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

app.use(
  session({
    secret: process.env.SESSION_SECRET || "strong-secret-here",
    resave: false,
    saveUninitialized: false,
    proxy: process.env.NODE_ENV === "production",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
app.use("/api/Subscription", subscriptionRoute);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/apicontactUs", contactUsRouter);
app.use("/api/agencies", agencyRoutes);
app.use("/api/users", authRouters);
app.use("/api/payments", paymentRoutes);
app.use("/api/Fee", FeeRoutes);
app.use("/api/customers", customerSupportRoutes);
app.use("/api/visitors", visitorRoute);
app.use("/api/search", searchRouter);
app.use("/api/upload", uploadRouterSelector);
app.use("/imagesStore", express.static(path.join(__dirname, "imagesStore")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
