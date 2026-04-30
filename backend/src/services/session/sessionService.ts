import crypto from "crypto";
import redisServer from "../redis/redisServer.ts";

export async function createSession(user: {
  id?: any;
  _id?: any;
  isSupport: any;
  isManager: any;
  email: any;
}) {
  const sessionId = crypto.randomUUID();
  const redis = redisServer.getClient();
  const userId = user._id || user.id;

  await redis.setEx(
    `session:${sessionId}`,
    86400,
    JSON.stringify({
      userId: userId,
      role: user.isSupport ? "support" : user.isManager ? "manager" : "admin",
      email: user.email,
    }),
  );

  return sessionId;
}

export async function getSession(sessionId: any) {
  if (!sessionId) return null;

  const redis = redisServer.getClient();
  const sessionData = await redis.get(`session:${sessionId}`);

  if (!sessionData) return null;

  return JSON.parse(sessionData);
}

export async function deleteSession(sessionId: any) {
  if (!sessionId) return;

  const redis = redisServer.getClient();
  await redis.del(`session:${sessionId}`);
}

export function setSessionCookie(
  res: {
    cookie: (
      arg0: string,
      arg1: any,
      arg2: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: string;
        maxAge: number;
        path: string;
      },
    ) => void;
  },
  sessionId: any,
) {
  res.cookie("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearSessionCookie(res: {
  clearCookie: (arg0: string) => void;
}) {
  res.clearCookie("session_id");
}
