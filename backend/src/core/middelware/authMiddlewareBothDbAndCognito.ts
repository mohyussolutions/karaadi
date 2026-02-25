import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/cognitoauth.ts";
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
    const token: string | undefined = req.headers.authorization?.startsWith(
      "Bearer ",
    )
      ? req.headers.authorization.split(" ")[1]
      : req.cookies?.idToken;

    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded: any = await verifyToken(token);
    if (!decoded || !decoded.sub)
      return res.status(401).json({ message: "Invalid token" });

    const userId = decoded.sub;

    const session = await prisma.cookie.findUnique({ where: { userId } });
    if (!session || session.expiresAt < new Date()) {
      if (session) await prisma.cookie.delete({ where: { id: session.id } });
      res.clearCookie("idToken");
      return res.status(401).json({ message: "Session expired" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("idToken");
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const adminAndManager = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  const isAdmin = req.user["custom:isAdmin"] === "true";
  const isManager = req.user["custom:isManager"] === "true";

  if (!isAdmin && !isManager) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  next();
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
