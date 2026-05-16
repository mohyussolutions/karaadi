import { serverError } from "src/core/utils/serverError.ts";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cacheManager from "src/services/redis/cacheManager.ts";

import prisma from "src/core/utils/db.ts";
import {
  signUp,
  signIn,
  confirmSignUp,
  resendVerificationCode,
  signOut as cognitoSignOut,
  forgotPassword,
  resetPassword,
  refreshTokenLogic,
  deleteFromCognito,
} from "src/core/utils/cognitoauth.ts";
import { setAuthCookies } from "src/core/utils/cookiesDB.ts";

export const userSignupsByMonth = async (req: Request, res: Response) => {
  try {
    const rows = await prisma.$queryRaw<{ month: string; users: bigint }[]>`
      SELECT to_char("createdAt", 'YYYY-MM') AS month, COUNT(*)::bigint AS users
      FROM "User"
      GROUP BY month
      ORDER BY month ASC
    `;
    let running = 0;
    const results = rows.map((r) => {
      running += Number(r.users);
      return {
        month: r.month,
        users: Number(r.users),
        totalUsers: running,
      };
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user signups by month" });
  }
};

export const deleteMyAccount = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const user = (req as any).user;
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.split(" ")[1];

  const rawId = req.body.id || user?.id || user?.sub;
  const userId = Array.isArray(rawId)
    ? (rawId[0] as string)
    : (rawId as string);

  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { cognitoId: true },
    });

    if (!dbUser) return res.status(404).json({ error: "User not found" });

    const targetCognitoId = dbUser.cognitoId;

    await prisma.user.delete({ where: { id: userId } });

    if (targetCognitoId) {
      try {
        await deleteFromCognito(targetCognitoId);
      } catch (err: any) {
        console.error("Cognito Error:", err.message);
      }
    }

    ["idToken", "refreshToken", "accessToken", "token"].forEach((c) =>
      res.clearCookie(c),
    );

    return res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error: any) {
    return serverError(res, error);
  }
};

export const deleteUserByAdmin = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const requesterId = (req as any).user?.id || (req as any).user?.sub;

  const userId = Array.isArray(id) ? (id[0] as string) : (id as string);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (userId === requesterId) {
    return res.status(403).json({ error: "You cannot delete your own admin account." });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { cognitoId: true, isAdmin: true },
    });

    if (dbUser?.isAdmin) {
      return res.status(403).json({ error: "Admin accounts cannot be deleted." });
    }

    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const targetCognitoId = dbUser.cognitoId;

    await prisma.user.delete({
      where: { id: userId },
    });

    if (targetCognitoId) {
      try {
        await deleteFromCognito(targetCognitoId);
      } catch (err: any) {
        console.error("Admin: Cognito cleanup failed:", err.message);
      }
    }

    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to delete user" });
  }
};

export const registerUser = async (
  email: string,
  password: string,
  username: string,
  phone?: string,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, cognitoId: true },
  });
  if (existingUser?.cognitoId)
    throw new Error("This email is already in use. Please try another one.");

  let cognitoResult: any;
  try {
    cognitoResult = await signUp(email, password, username, phone);
  } catch (err: any) {
    const msg = err?.message || "Failed to sign up user in Cognito";
    if (/UsernameExistsException|already exists/i.test(msg))
      throw new Error("This email is already in use. Please try another one.");
    throw new Error(msg);
  }

  const cognitoSub = (cognitoResult as any).UserSub;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if (existingUser) {
      await prisma.user.update({
        where: { email },
        data: { cognitoId: cognitoSub, username, password: hashedPassword, phone: phone || "" },
      });
    } else {
      await prisma.user.create({
        data: {
          cognitoId: cognitoSub, email, username,
          password: hashedPassword, phone: phone || "",
          isAdmin: false, isManager: false, isSupport: false,
        },
      });
    }
  } catch (dbErr: any) {
    throw new Error(dbErr?.message || "Failed to create user in database");
  }

  return cognitoResult;
};

export const updatePhoneInDb = async (req: any, res: Response) => {
  try {
    const { phone } = req.body;
    const userId = req.user?.id || req.user?.sub;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!phone)
      return res.status(400).json({ error: "Phone number is required" });

    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith("+"))
      formattedPhone = `+252${formattedPhone}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { phone: formattedPhone },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        profileImage: true,
      },
    });

    res.json({
      success: true,
      message: "Phone number updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    serverError(res, error);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json({ users });
  } catch (error: any) {
    serverError(res, error);
  }
};

export const loginUsingDb = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
      profileImage: true,
      phone: true,
      isAdmin: true,
      isManager: true,
      isSupport: true,
    },
  });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return {
    token,
    refreshToken,
    userData: {
      id: user.id,
      email: user.email,
      name: user.username,
      profileImage: user.profileImage,
      phone: user.phone,
      isAdmin: user.isAdmin,
      isManager: user.isManager,
      isSupport: user.isSupport,
    },
  };
};

export const confirmUserSignUp = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    await confirmSignUp(email, code);
    res.json({ message: "Email confirmed! You can now sign in." });
  } catch (err: any) {
    res.status(400).json({ error: "Confirmation failed" });
  }
};

export const resetCodeUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await resendVerificationCode(email);
    res.json({ message: "New confirmation code sent! Check your email." });
  } catch (err: any) {
    res.status(400).json({ error: "Resend failed" });
  }
};

export const forgotPasswordIncontroller = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email } = req.body;
    res.cookie("email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });
    await forgotPassword(email);
    res.json({ message: "Password reset code sent! Check your email." });
  } catch (err: any) {
    res.status(400).json({ error: "Request failed" });
  }
};

export const resetPasswordIncontroller = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email, newPassword, resetCode } = req.body;
    if (!email || !newPassword || !resetCode)
      return res.status(400).json({ error: "Required fields missing." });
    await resetPassword(email, newPassword, resetCode);
    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error: any) {
    res.status(400).json({ error: "Reset failed" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : (req.cookies?.idToken ?? req.cookies?.token);

    if (token) {
      const decoded = jwt.decode(token) as { sub?: string } | null;
      if (decoded?.sub) {
        const user = await prisma.user.findUnique({
          where: { cognitoId: decoded.sub },
          select: { id: true },
        });
        if (user) {
          await prisma.cookie.deleteMany({ where: { userId: user.id } }).catch(() => {});
          await cacheManager.delete(`auth:session:${decoded.sub}`).catch(() => {});
        }
      }
      await cognitoSignOut(token).catch(() => {});
    }

    const isProd = process.env.NODE_ENV === "production";
    const cookieOpts = {
      httpOnly: true,
      secure: isProd,
      sameSite: (isProd ? "none" : "lax") as "none" | "lax",
      path: "/",
    };
    ["token", "idToken", "accessToken", "refreshToken"].forEach((c) =>
      res.clearCookie(c, cookieOpts),
    );
    res.status(200).json({ success: true });
  } catch {
    res.status(200).json({ success: true });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId =
      (req as any).user?.id || (req as any).user?.sub || (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        profileImage: true,
        isAdmin: true,
        isManager: true,
        isSupport: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateProfileImage = async (req: any, res: Response) => {
  try {
    const file = req.file || req.files?.profileImage;
    const userId = req.user?.id || req.user?.sub;
    if (!userId || !file)
      return res.status(400).json({ error: "Missing data" });
    const imageBase64 =
      file.buffer?.toString("base64") || file.data?.toString("base64");
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profileImage: imageBase64 },
      select: { id: true, username: true, email: true, profileImage: true },
    });
    res.json({ success: true, user: updatedUser });
  } catch (error: any) {
    serverError(res, error);
  }
};

export const getUsersCount = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    res.status(200).json({ totalUsers });
  } catch (error: any) {
    serverError(res, error);
  }
};

function parseUserAgent(ua: string) {
  const browser =
    /Edg\//.test(ua) ? "Edge" :
    /OPR\/|Opera/.test(ua) ? "Opera" :
    /Chrome\//.test(ua) ? "Chrome" :
    /Firefox\//.test(ua) ? "Firefox" :
    /Safari\//.test(ua) && /Version\//.test(ua) ? "Safari" :
    /MSIE|Trident/.test(ua) ? "IE" : "Other";

  const device =
    /iPhone/.test(ua) ? "iPhone" :
    /iPad/.test(ua) ? "iPad" :
    /Android/.test(ua) ? "Android" :
    /Windows/.test(ua) ? "Windows" :
    /Macintosh|Mac OS/.test(ua) ? "Mac" :
    /Linux/.test(ua) ? "Linux" : "Other";

  return { browser, device };
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { token, refreshToken, userData } = await signIn(email, password, req, res);
    await setAuthCookies(res, { idToken: token, refreshToken, accessToken: userData.accessToken }, undefined, userData.id);

    const ua = req.headers["user-agent"] || "";
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() || req.socket.remoteAddress || null;
    const { browser, device } = parseUserAgent(ua);
    prisma.loginHistory.create({
      data: { userId: userData.id, ipAddress: ip, userAgent: ua.slice(0, 300), browser, device },
    }).catch(() => {});

    recordSession(userData.id, userData.accessToken || token, req).catch(() => {});

    res.json({ token, user: userData });
  } catch (err: any) {
    console.error("[AUTH] signIn failed:", err?.name, err?.message ?? err);
    const name = err?.name ?? "";
    if (name === "UserNotConfirmedException")
      return res.status(401).json({ error: "Please confirm your email before logging in." });
    if (name === "NotAuthorizedException")
      return res.status(401).json({ error: "Incorrect email or password." });
    if (name === "UserNotFoundException")
      return res.status(401).json({ error: "No account found with this email." });
    if (name === "TooManyRequestsException")
      return res.status(429).json({ error: "Too many attempts. Please wait and try again." });
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
};

export const registerUserHandler = async (req: Request, res: Response) => {
  try {
    const { email, password, username, phone } = req.body;
    const cognitoResult = await registerUser(email, password, username, phone);
    res.json({ message: "User registered successfully", cognitoResult });
  } catch (error: any) {
    console.error("[REGISTER]", error?.name, error?.message);
    const name = error?.name ?? "";
    if (name === "UsernameExistsException")
      return res.status(400).json({ error: "This email is already in use." });
    if (name === "InvalidPasswordException")
      return res.status(400).json({ error: "Password does not meet requirements." });
    if (name === "InvalidParameterException")
      return res.status(400).json({ error: "Invalid registration details." });
    if (/already in use/i.test(error?.message ?? ""))
      return res.status(400).json({ error: "This email is already in use." });
    res.status(400).json({ error: "Registration failed. Please try again." });
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ error: "Refresh token required" });
    const newTokens = await refreshTokenLogic(refreshToken);
    res.status(200).json({ tokens: newTokens });
  } catch (error: any) {
    serverError(res, error);
  }
};

export const getLoginHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const history = await prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { loggedAt: "desc" },
      take: 20,
      select: { id: true, ipAddress: true, browser: true, device: true, loggedAt: true },
    });
    res.json(history);
  } catch (error: any) {
    serverError(res, error);
  }
};

export const deleteLoginHistoryEntry = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    await prisma.loginHistory.deleteMany({ where: { id, userId } });
    res.json({ ok: true });
  } catch (error: any) {
    serverError(res, error);
  }
};

export const clearLoginHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    await prisma.loginHistory.deleteMany({ where: { userId } });
    res.json({ ok: true });
  } catch (error: any) {
    serverError(res, error);
  }
};

function tokenHash(token: string): string {
  return token.slice(-40);
}

export async function recordSession(userId: string, accessToken: string, req: any) {
  const hash = tokenHash(accessToken);
  const ua = (req.headers?.["user-agent"] as string) || "";
  const ip = ((req.headers?.["x-forwarded-for"] as string)?.split(",")[0].trim()) || req.socket?.remoteAddress || null;
  const { browser, device } = parseUserAgent(ua);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await prisma.session.upsert({
    where: { tokenHash: hash },
    update: { isActive: true, expiresAt },
    create: { userId, tokenHash: hash, device, browser, ipAddress: ip, userAgent: ua.slice(0, 300), expiresAt },
  }).catch(() => {});
}

export const getActiveSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const rawToken = (req.headers.authorization?.replace("Bearer ", "") || "").trim();
    const currentHash = rawToken ? tokenHash(rawToken) : "";

    const sessions = await prisma.session.findMany({
      where: { userId, isActive: true, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    res.json(sessions.map((s) => ({
      id: s.id,
      device: s.device,
      browser: s.browser,
      ipAddress: s.ipAddress,
      lastActive: s.createdAt,
      active: currentHash ? s.tokenHash === currentHash : false,
    })));
  } catch (err: any) {
    serverError(res, err);
  }
};

export const revokeSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;
    const id = req.params.id as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    await prisma.session.updateMany({ where: { id, userId }, data: { isActive: false } });
    res.json({ ok: true });
  } catch (err: any) {
    serverError(res, err);
  }
};

export const revokeAllSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    await prisma.session.updateMany({ where: { userId }, data: { isActive: false } });
    res.json({ ok: true });
  } catch (err: any) {
    serverError(res, err);
  }
};
