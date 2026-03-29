import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/db.ts";
import { AuthRequest, DecodedToken } from "../../types/authProtection.ts";

const extractToken = (authHeader?: string, cookies?: any): string | null => {
  const fromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const fromCookie = cookies?.idToken || cookies?.token || cookies?.accessToken;
  return fromHeader || fromCookie || null;
};

const validateSession = async (userId: string, res: Response) => {
  const session = await prisma.cookie.findUnique({
    where: { userId },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.cookie.delete({ where: { id: session.id } });
    res.clearCookie("idToken");
    res.clearCookie("token");
    res.clearCookie("accessToken");
    return false;
  }
  return true;
};

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

    const user = await prisma.user.findUnique({
      where: { cognitoId: decoded.sub },
    });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isValid = await validateSession(user.id, res);
    if (!isValid) return res.status(401).json({ message: "Session expired" });

    const tokenIsAdmin = decoded["custom:isAdmin"] === "true";
    const tokenIsManager = decoded["custom:isManager"] === "true";
    const tokenIsSupport = decoded["custom:isSupport"] === "true";

    req.user = {
      ...user,
      id: user.id,
      email: user.email || decoded.email || null,
      username: user.username || decoded.preferred_username || "",
      "custom:isAdmin": tokenIsAdmin ? "true" : "false",
      "custom:isManager": tokenIsManager ? "true" : "false",
      "custom:isSupport": tokenIsSupport ? "true" : "false",
      isAdmin: tokenIsAdmin,
      isManager: tokenIsManager,
      isSupport: tokenIsSupport,
    };

    next();
  } catch (err) {
    res.clearCookie("idToken");
    res.clearCookie("token");
    res.clearCookie("accessToken");
    res.status(401).json({ message: "Unauthorized" });
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

    const isAdmin = req.user.isAdmin === true;
    const isManager = req.user.isManager === true;

    if (!isAdmin && !isManager) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteExpiredTokens = async () => {
  try {
    const now = new Date();
    await prisma.cookie.deleteMany({
      where: { expiresAt: { lte: now } },
    });
  } catch (e) {
    console.error(e);
  }
};
