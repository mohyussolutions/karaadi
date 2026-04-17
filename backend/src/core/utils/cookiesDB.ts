import jwt from "jsonwebtoken";
import prisma from "./db.js";
import { SESSION_TIME_MS } from "src/config/session-time.ts";

export const setAuthCookies = async (
  res: any,
  tokens: { idToken: string; refreshToken: string; accessToken?: string },
  userInfo?: { username?: string; profileImage?: string; email?: string },
  userId?: string,
) => {
  const { idToken, refreshToken, accessToken } = tokens;

  let resolvedUserId = userId;

  if (!resolvedUserId) {
    const decoded = jwt.decode(idToken) as {
      sub?: string;
      email?: string;
      name?: string;
    };

    if (!decoded?.sub) throw new Error("Invalid token: missing user ID");

    const cognitoId = decoded.sub;
    const email = decoded.email ?? userInfo?.email;

    let user = await prisma.user.findUnique({ where: { cognitoId } });

    if (!user && email) {
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUserByEmail) {
        user = await prisma.user.update({
          where: { email },
          data: {
            cognitoId,
            username:
              userInfo?.username ??
              decoded.name ??
              existingUserByEmail.username ??
              "",
            profileImage:
              userInfo?.profileImage ?? existingUserByEmail.profileImage ?? "",
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            cognitoId,
            email,
            username: userInfo?.username ?? decoded.name ?? "",
            profileImage: userInfo?.profileImage ?? "",
            password: "",
          },
        });
      }
    }

    if (!user) throw new Error("User not found");
    resolvedUserId = user.id;
  }

  const expiresAt = new Date(Date.now() + SESSION_TIME_MS);

  const session = await prisma.cookie.upsert({
    where: { userId: resolvedUserId },
    update: {
      token: idToken,
      accessToken: accessToken || null,
      expiresAt,
    },
    create: {
      userId: resolvedUserId,
      token: idToken,
      accessToken: accessToken || null,
      expiresAt,
    },
  });

  if (!res.headersSent) {
    res.cookie("idToken", session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_TIME_MS,
    });

    res.cookie("accessToken", accessToken || session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_TIME_MS,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  return {
    userId: resolvedUserId,
    idToken: session.token,
    refreshToken,
    accessToken,
  };
};
