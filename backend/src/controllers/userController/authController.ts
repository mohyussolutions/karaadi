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
  updateUserAttributes,
  adminUpdateUser,
} from "../../core/utils/cognitoauth.ts";
import prisma from "../../core/utils/db.ts";

export const registerUser = async (
  email: string,
  password: string,
  username: string,
  phone?: string,
) => {
  const emailExists = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (emailExists)
    throw new Error("This email is already in use. Please try another one.");
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
  } catch (dbErr: any) {
    try {
      await deleteFromCognito(email);
    } catch (cleanupErr: any) {
      console.error(
        "Failed to rollback Cognito user after DB error:",
        cleanupErr,
      );
    }
    throw new Error(dbErr?.message || "Failed to create user in database");
  }

  return cognitoResult;
};

export const updatePhone = async (req: any, res: Response) => {
  try {
    const { phone } = req.body;
    const accessToken = req.headers.authorization?.split(" ")[1];
    const userId = req.user?.id || req.user?.sub;

    console.log("Updating phone for user:", userId);
    console.log("Access token present:", !!accessToken);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - missing user" });
    }

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

    // Try client-side update if an access token is provided and appears to be an access token
    let cognitoUpdated = false;
    try {
      if (accessToken) {
        const decoded: any = jwt.decode(accessToken);
        const tokenUse = decoded?.token_use || decoded?.TokenUse || null;
        if (tokenUse === "access") {
          try {
            await updateUserAttributes(accessToken, {
              phone_number: formattedPhone,
            });
            cognitoUpdated = true;
          } catch (cognitoError: any) {
            console.error("Cognito update failed:", cognitoError);
            // fall through to admin/DB fallback
          }
        } else {
          console.log(
            "Provided token is not an access token (token_use=",
            tokenUse,
            ") - skipping client update",
          );
        }
      } else {
        console.log("No access token provided, will attempt admin/DB update");
      }
    } catch (decodeErr: any) {
      console.error(
        "Failed to decode access token, will attempt admin/DB update:",
        decodeErr,
      );
    }

    // If client update didn't succeed, attempt server-side admin update (if creds available)
    if (!cognitoUpdated) {
      const userRecord = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });
      const username = userRecord?.email;
      if (!username) {
        // persist in DB as a best-effort
        await prisma.user.update({
          where: { id: userId },
          data: { phone: formattedPhone },
        });
        return res.status(200).json({
          message:
            "Phone updated in database, but Cognito update skipped (missing user email).",
          phone: formattedPhone,
          warning: "db_only",
        });
      }

      // detect whether admin creds are configured locally
      const hasAdminCreds = Boolean(
        (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
        (process.env.AWS_CONFIG_FILE &&
          process.env.AWS_SDK_LOAD_CONFIG === "1"),
      );

      try {
        await adminUpdateUser(username, {
          phone_number: formattedPhone,
          phone_number_verified: "true",
        } as any);
        cognitoUpdated = true;
      } catch (adminErr: any) {
        console.error(
          "adminUpdateUser also failed:",
          adminErr?.message || adminErr,
        );
        // continue to persist in DB
      }

      // Persist authoritative phone in DB regardless
      await prisma.user.update({
        where: { id: userId },
        data: { phone: formattedPhone },
      });

      if (!cognitoUpdated) {
        const warning = hasAdminCreds
          ? "cognito_admin_failed"
          : "missing_aws_credentials";
        return res.status(200).json({
          message:
            "Phone updated in database, but Cognito update did not complete.",
          phone: formattedPhone,
          warning,
        });
      }
    }

    // If we reached here, Cognito was updated (client or admin) and DB persisted above
    return res.status(200).json({
      message: "Phone number updated successfully",
      phone: formattedPhone,
      verified: true,
    });
  } catch (error: any) {
    console.error("Error updating phone:", error);
    return res.status(500).json({ error: error.message });
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

export const updateProfileImage = async (req: any, res: Response) => {
  try {
    const {
      imageKey,
      username: newUsername,
      email: newEmail,
      phone: newPhone,
    } = req.body;
    const accessToken = req.headers.authorization?.split(" ")[1];
    const userId = req.user?.id || req.user?.sub;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const cdnBaseUrl = process.env.CDN_BASE_URL;
    const imageUrl = imageKey ? `${cdnBaseUrl}/${imageKey}` : undefined;

    // Prepare attributes to update in Cognito if any
    const cognitoAttributes: any = {};
    if (newUsername) cognitoAttributes.preferred_username = newUsername;
    if (newEmail) cognitoAttributes.email = newEmail;
    if (newPhone) cognitoAttributes.phone_number = newPhone;
    if (imageUrl) cognitoAttributes.profile = imageUrl;

    let cognitoUpdated = false;

    // Try client-side update when provided token is an access token
    try {
      if (accessToken) {
        const decoded: any = jwt.decode(accessToken);
        const tokenUse = decoded?.token_use || decoded?.TokenUse || null;
        if (
          tokenUse === "access" &&
          Object.keys(cognitoAttributes).length > 0
        ) {
          try {
            await updateUserAttributes(accessToken, cognitoAttributes);
            cognitoUpdated = true;
          } catch (cognitoErr: any) {
            console.error(
              "Cognito updateUserAttributes failed:",
              cognitoErr?.message || cognitoErr,
            );
          }
        } else if (tokenUse !== "access") {
          console.log(
            "Provided token is not an access token (token_use=",
            tokenUse,
            ") - skipping client update",
          );
        }
      } else {
        console.log(
          "No access token provided for profile update, will attempt admin/DB update",
        );
      }
    } catch (decodeErr: any) {
      console.error(
        "Failed to decode access token for profile update:",
        decodeErr?.message || decodeErr,
      );
    }

    if (!cognitoUpdated && Object.keys(cognitoAttributes).length > 0) {
      const userRecord = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });
      const cognitoUsername = userRecord?.email;

      try {
        if (cognitoUsername) {
          await adminUpdateUser(cognitoUsername, cognitoAttributes);
          cognitoUpdated = true;
        }
      } catch (adminErr: any) {
        console.error(
          "adminUpdateUser profile update failed:",
          adminErr?.message || adminErr,
        );
      }
    }

    // Persist changes to our DB (authoritative)
    const updateData: any = {};
    if (newUsername) updateData.username = newUsername;
    if (newEmail) updateData.email = newEmail;
    if (newPhone) updateData.phone = newPhone;
    if (imageUrl) updateData.profileImage = imageUrl;

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({ where: { id: userId }, data: updateData });
    }

    // If Cognito couldn't be updated, return 200 with a warning so frontend can continue
    if (Object.keys(cognitoAttributes).length > 0 && !cognitoUpdated) {
      const hasAdminCreds = Boolean(
        (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
        (process.env.AWS_CONFIG_FILE &&
          process.env.AWS_SDK_LOAD_CONFIG === "1"),
      );
      const warning = hasAdminCreds
        ? "cognito_admin_failed"
        : "missing_aws_credentials";
      return res.status(200).json({
        message: "Profile saved in database",
        profileImage: imageUrl,
        warning,
      });
    }

    return res
      .status(200)
      .json({ message: "Profile updated", profileImage: imageUrl });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
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
      select: { email: true, cognitoId: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    let dbError = null;
    let cognitoError = null;
    const cognitoEmail = user.email;
    try {
      await prisma.user.delete({ where: { id: userId } });
    } catch (err: any) {
      dbError = err?.message || err;
      console.error("Failed to delete user from database:", dbError);
    }
    if (cognitoEmail) {
      try {
        await deleteFromCognito(cognitoEmail);
      } catch (err: any) {
        cognitoError = err?.message || err;
        console.error("Failed to delete user from Cognito:", cognitoError);
      }
    }
    res.clearCookie("idToken");
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.clearCookie("token");
    if (!dbError && !cognitoError) {
      return res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    } else {
      return res.status(207).json({
        success: true,
        warning: "Partial deletion",
        cognitoError,
        dbError,
      });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to delete account" });
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

export const deleteUserById = async (req: Request, res: Response) => {
  const userId = req.params.id as string;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Detect whether admin creds are configured
    const hasAdminCreds = Boolean(
      (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
      (process.env.AWS_CONFIG_FILE && process.env.AWS_SDK_LOAD_CONFIG === "1"),
    );

    let cognitoDeleted = false;
    let cognitoError: any = null;

    if (hasAdminCreds) {
      try {
        await deleteFromCognito(user.email || "");
        cognitoDeleted = true;
      } catch (err: any) {
        cognitoError = err?.message || err;
        console.error("Failed to delete Cognito user:", cognitoError);
      }
    } else {
      console.warn("Skipping Cognito deletion: missing AWS admin credentials");
    }

    let dbDeleted = false;
    let dbError: any = null;
    try {
      await prisma.user.delete({ where: { id: userId } });
      dbDeleted = true;
    } catch (err: any) {
      dbError = err?.message || err;
      console.error("Failed to delete user from database:", dbError);
    }

    if (dbDeleted && (cognitoDeleted || !hasAdminCreds)) {
      const warning = !hasAdminCreds ? "missing_aws_credentials" : undefined;
      return res.status(200).json({
        message: "User deletion processed",
        cognitoDeleted,
        dbDeleted,
        warning,
      });
    }

    return res.status(500).json({
      error: "Failed to delete user completely",
      cognitoDeleted,
      cognitoError,
      dbDeleted,
      dbError,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to delete user by ID" });
  }
};
