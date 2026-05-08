import { serverError } from "src/core/utils/serverError.ts";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "src/core/utils/db.ts";
import {
  signUp,
  confirmSignUp,
  resendVerificationCode,
  signOut as cognitoSignOut,
  forgotPassword,
  resetPassword,
  refreshTokenLogic,
  deleteFromCognito,
} from "src/core/utils/cognitoauth.ts";

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

  const userId = Array.isArray(id) ? (id[0] as string) : (id as string);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { cognitoId: true },
    });

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
  try {
    const emailExists = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (emailExists)
      throw new Error("This email is already in use. Please try another one.");
  } catch (err: any) {
    if (err?.message?.includes("already in use")) throw err;
  }

  let cognitoResult: any;
  try {
    cognitoResult = await signUp(email, password, username, phone);
  } catch (err: any) {
    const msg = err?.message || "Failed to sign up user in Cognito";
    if (/UsernameExistsException|already exists/i.test(msg)) {
      throw new Error("This email is already in use. Please try another one.");
    }
    throw new Error(msg);
  }

  const cognitoSub = (cognitoResult as any).UserSub;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        cognitoId: cognitoSub,
        username,
        email,
        password: hashedPassword,
        phone: phone || "",
        isAdmin: false,
        isManager: false,
        isSupport: false,
      },
    });
  } catch {
    // DB unavailable — record will be created on first login via upsert
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
    res.clearCookie("token");
    res.clearCookie("idToken");
    res.clearCookie("refreshToken");
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer "))
      await cognitoSignOut(authHeader.split(" ")[1]);
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
