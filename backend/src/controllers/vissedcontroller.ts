import { serverError } from "src/core/utils/serverError.ts";
import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { v4 as uuidv4 } from "uuid";

export const trackVisitor = async (req: Request, res: Response) => {
  try {
    let visitorId = req.cookies?.visitor_id;
    const ipAddress = req.ip || req.socket.remoteAddress || "Unknown";

    if (!visitorId) {
      visitorId = uuidv4();
      res.cookie("visitor_id", visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });
    }

    const userAgent = req.headers["user-agent"] || "Unknown";

    const visitor = await prisma.visitor.upsert({
      where: { userId: visitorId },
      update: {
        visitedAt: new Date(),
        ipAddress: ipAddress,
        userAgent: userAgent,
      },
      create: {
        userId: visitorId,
        visitedAt: new Date(),
        ipAddress: ipAddress,
        userAgent: userAgent,
      },
    });

    return res.json({ tracked: true, visitor });
  } catch (err: any) {
    console.error("Prisma Error:", err);
    return serverError(res, err);
  }
};

export const getAllVisitors = async (_req: Request, res: Response) => {
  try {
    const visitors = await prisma.visitor.findMany({
      orderBy: { visitedAt: "desc" },
    });
    return res.json({ total: visitors.length, visitors });
  } catch (err: any) {
    return serverError(res, err);
  }
};

export const updateVisitor = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const userIdValue = Array.isArray(userId) ? userId[0] : userId;
  const dataToUpdate = req.body;

  if (!userIdValue) return res.status(400).json({ error: "userId required" });

  try {
    const updatedVisitor = await prisma.visitor.update({
      where: { userId: userIdValue },
      data: dataToUpdate,
    });
    return res.json(updatedVisitor);
  } catch (err: any) {
    return serverError(res, err);
  }
};

export const deleteVisitor = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const userIdValue = Array.isArray(userId) ? userId[0] : userId;

  if (!userIdValue) return res.status(400).json({ error: "userId required" });

  try {
    const visitor = await prisma.visitor.findFirst({
      where: {
        OR: [{ id: userIdValue }, { userId: userIdValue }],
      },
    });

    if (!visitor) {
      return res.status(404).json({ error: "Visitor not found" });
    }

    await prisma.visitor.delete({ where: { id: visitor.id } });
    return res.json({ message: "Deleted" });
  } catch (err: any) {
    console.error("Delete visitor error:", err);
    return serverError(res, err);
  }
};
