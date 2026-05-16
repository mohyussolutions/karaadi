import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/db.ts";
import { AuthRequest, DecodedToken } from "../../types/index.ts";
import cacheManager from "src/services/redis/cacheManager.ts";
import { SESSION_TIME_MS } from "src/config/session-time.ts";
import { CACHE_TTL } from "src/config/config.constants.ts";

const extractToken = (authHeader?: string, cookies?: any): string | null => {
  const fromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const fromCookie = cookies?.idToken || cookies?.token || cookies?.accessToken;
  return fromHeader || fromCookie || null;
};

const getAuthCacheKey = (sub: string) => `auth:session:${sub}`;

const loadUserAndSession = async (sub: string, token: string) => {
  const cacheKey = getAuthCacheKey(sub);

  const cached = await cacheManager
    .get<{ user: any; valid: boolean }>(cacheKey)
    .catch(() => null);
  if (cached) {
    if (!cached.valid) return null;
    return cached.user;
  }

  const user = await prisma.user.findUnique({ where: { cognitoId: sub } });
  if (!user) return null;

  const newExpiry = new Date(Date.now() + SESSION_TIME_MS);
  const session = await prisma.cookie.findUnique({ where: { userId: user.id } });

  if (!session || session.expiresAt < new Date()) {
    await prisma.cookie.upsert({
      where: { userId: user.id },
      update: { token, expiresAt: newExpiry },
      create: { userId: user.id, token, expiresAt: newExpiry },
    }).catch(() => {});
  } else {
    await prisma.cookie.update({ where: { userId: user.id }, data: { expiresAt: newExpiry } }).catch(() => {});
  }

  await cacheManager.set(cacheKey, { user, valid: true }, CACHE_TTL.AUTH).catch(() => {});
  return user;
};

const COOKIE_OPTS = (isProd: boolean) => ({
  httpOnly: true,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  secure: isProd,
  maxAge: SESSION_TIME_MS,
});

export const ProtectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractToken(req.headers.authorization, req.cookies);
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.decode(token) as DecodedToken;
    if (!decoded?.sub)
      return res.status(401).json({ message: "Invalid token" });

    const user = await loadUserAndSession(decoded.sub, token);
    if (!user)
      return res.status(401).json({ message: "Session expired or not found" });

    const isProd = process.env.NODE_ENV === "production";
    const base = { sameSite: (isProd ? "none" : "lax") as "none" | "lax", secure: isProd, maxAge: SESSION_TIME_MS };
    res.cookie("idToken", token, { ...base, httpOnly: true });
    res.cookie("accessToken", token, { ...base, httpOnly: false });

    req.user = {
      ...user,
      id: user.id,
      email: user.email || null,
      username: user.username || "",
      isAdmin: user.isAdmin === true,
      isManager: user.isManager === true,
      isSupport: user.isSupport === true,
      "custom:isAdmin": user.isAdmin ? "true" : "false",
      "custom:isManager": user.isManager ? "true" : "false",
      "custom:isSupport": user.isSupport ? "true" : "false",
    };

    next();
  } catch {
    res.status(503).json({ message: "Service temporarily unavailable" });
  }
};

export const adminAndManager = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    if (!req.user.isAdmin && !req.user.isManager) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteExpiredTokens = async () => {
  try {
    const now = new Date();
    await prisma.cookie.deleteMany({ where: { expiresAt: { lte: now } } });
  } catch (e) {
    console.error(e);
  }
};
