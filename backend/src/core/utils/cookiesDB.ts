import jwt from "jsonwebtoken";
import prisma from "./db.js";

export const setAuthCookies = async (
  res: any,
  tokens: { idToken: string; refreshToken: string; accessToken?: string },
  userInfo?: { username?: string; profileImage?: string; email?: string }
) => {
  const { idToken, refreshToken } = tokens;

  const decoded = jwt.decode(idToken) as {
    sub?: string;
    email?: string;
    name?: string;
  };

  if (!decoded?.sub) throw new Error("Invalid token: missing user ID");

  const userId = decoded.sub;
  const email = decoded.email ?? userInfo?.email;

  let user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user && email) {
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      user = await prisma.user.update({
        where: { email },
        data: {
          id: userId,
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
      const existingUserPassword = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });

      const passwordToUse = existingUserPassword?.password ?? "";

      user = await prisma.user.create({
        data: {
          id: userId,
          email: email,
          username: userInfo?.username ?? decoded.name ?? "",
          profileImage: userInfo?.profileImage ?? "",
          password: passwordToUse,
        },
      });
    }
  }

  let session = await prisma.cookie.findUnique({ where: { userId } });
  const now = new Date();
  if (session && session.expiresAt > now) {
    console.log("User already has a valid stored session.");
  } else {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    session = await prisma.cookie.upsert({
      where: { userId },
      update: { token: idToken, expiresAt },
      create: { userId, token: idToken, expiresAt },
    });
  }

  if (!res.headersSent) {
    res.cookie("idToken", session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  return { userId, idToken: session.token, refreshToken };
};
