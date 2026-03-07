import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/db.ts";

interface AuthRequest extends Request {
  user?: any;
  accessToken?: string;
}

export const ProtectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : req.cookies?.idToken || req.cookies?.token || req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded: any = jwt.decode(token);
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { cognitoId: decoded.sub },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const session = await prisma.cookie.findUnique({
      where: { userId: user.id },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) await prisma.cookie.delete({ where: { id: session.id } });
      res.clearCookie("idToken");
      res.clearCookie("token");
      res.clearCookie("accessToken");
      return res.status(401).json({ message: "Session expired" });
    }

    const tokenIsAdmin = decoded["custom:isAdmin"] === "true";
    const tokenIsManager = decoded["custom:isManager"] === "true";
    const tokenIsSupport = decoded["custom:isSupport"] === "true";

    req.user = {
      ...user,
      id: user.id,
      email: user.email || decoded.email,
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
