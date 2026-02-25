import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  signUp,
  confirmSignUp,
  resendVerificationCode,
  signOut as cognitoSignOut,
  forgotPassword,
  resetPassword,
  refreshTokenLogic,
  deleteFromCognito,
  updateUserProfileCognito,
  cognitoClient,
} from "../../core/utils/cognitoauth.ts";
import prisma from "../../core/utils/db.ts";

export const registerUser = async (
  email: string,
  password: string,
  username: string,
) => {
  const emailExists = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (emailExists)
    throw new Error("This email is already in use. Please try another one.");

  const cognitoCheck = await cognitoClient
    .adminGetUser({
      UserPoolId: process.env.TOORTO_AWS_COGNITO_USER_POOL_ID!,
      Username: email,
    })
    .promise()
    .catch(() => null);

  if (cognitoCheck)
    throw new Error("This email is already in use. Please try another one.");

  const cognitoResult = await signUp(email, password, username);
  const cognitoSub = (cognitoResult as any).UserSub;
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      cognitoId: cognitoSub,
      username,
      email,
      password: hashedPassword,
      isAdmin: false,
      isManager: false,
      isSupport: false,
    },
  });

  return cognitoResult;
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
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
    res.status(400).json({ error: err.message || "Confirm failed" });
  }
};

export const resetCodeUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await resendVerificationCode(email);
    res.json({ message: "New confirmation code sent! Check your email." });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Resend failed" });
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
    res.status(400).json({ error: err.message || "Forgot password failed" });
  }
};

export const resetPasswordIncontroller = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email, newPassword, resetCode } = req.body;
    if (!email || !newPassword || !resetCode) {
      return res
        .status(400)
        .json({ error: "Email, new password, and reset code are required." });
    }
    await resetPassword(email, newPassword, resetCode);
    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Reset failed" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.clearCookie("idToken");
    res.clearCookie("refreshToken");

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      await cognitoSignOut(authHeader.split(" ")[1]);
    }
    res.status(200).json({ success: true });
  } catch {
    res.clearCookie("token");
    res.clearCookie("idToken");
    res.clearCookie("refreshToken");
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

export const updateUserProfile = async (req: any, res: Response) => {
  try {
    const { username, email, phone } = req.body;
    const profileImage = req.file;
    const userId = req.user?.id || req.user?.sub || req.user?._id;

    const updateData: any = { username, email, phone, updatedAt: new Date() };

    if (profileImage) {
      updateData.profileImage = `${process.env.CDN_BASE_URL || ""}/uploads/${profileImage.originalname}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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

    await updateUserProfileCognito(req);
    res.json(updatedUser);
  } catch {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const getUsersCount = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    res.status(200).json({ totalUsers });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to get total users" });
  }
};

export const deleteAccount = async (req: any, res: Response) => {
  const userId = req.user?.id || req.user?.sub || req.user?._id;
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    await deleteFromCognito(user.email || "");
    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Server error", details: error.message || error });
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const newTokens = await refreshTokenLogic(refreshToken);
    res
      .status(200)
      .json({ message: "Token refreshed successfully", tokens: newTokens });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to refresh token" });
  }
};
