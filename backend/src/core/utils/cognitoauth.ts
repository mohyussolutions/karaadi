import AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import prisma from "./db.ts";
import bcrypt from "bcrypt";

interface VerifiedTokenData {
  _id?: string;
  sub: string;
  "custom:isAdmin": string;
  "custom:isManager": string;
  email: string;
  "custom:isSupport"?: string;
  preferred_username?: string;
  username: string;
  token?: string;
}

interface RoleUpdateData {
  isAdmin?: string;
  isManager?: string;
  isSupport?: string;
}

interface UserAttributes {
  email?: string;
  preferred_username?: string;
  phone_number?: string;
  profile?: string;
  phone_number_verified?: string;
  "custom:isAdmin"?: string;
  "custom:isManager"?: string;
  "custom:isSupport"?: string;
  "custom:phone_number"?: string;
  "custom:profile"?: string;
}

export const cognitoClient = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const deleteFromCognito = async (cognitoId: string): Promise<void> => {
  const params = {
    UserPoolId: process.env.TOORTO_AWS_COGNITO_USER_POOL_ID!,
    Username: cognitoId,
  };
  try {
    await cognitoClient.adminDeleteUser(params).promise();
  } catch (error: any) {
    throw new Error(error.message || "Cognito deletion failed");
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

  console.log("--- DELETION PROCESS STARTED ---");
  console.log("Target User ID (DB):", userId);
  console.log("Request Token:", accessToken ? "Present" : "Missing");

  if (!userId) {
    console.error("Deletion Aborted: No User ID found");
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        cognitoId: true,
        username: true,
      },
    });

    if (!dbUser) {
      console.error(`Deletion Aborted: User ${userId} not found in database`);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Deleting User Record:", {
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      cognitoId: dbUser.cognitoId,
    });

    const targetCognitoId = dbUser.cognitoId;

    await prisma.user.delete({
      where: { id: userId },
    });
    console.log("Database record successfully removed");

    if (targetCognitoId) {
      try {
        await deleteFromCognito(targetCognitoId);
        console.log(`AWS Cognito User ${targetCognitoId} successfully removed`);
      } catch (err: any) {
        console.error("AWS Cognito Deletion Error:", err.message);
      }
    }

    ["idToken", "refreshToken", "accessToken", "token"].forEach((c) =>
      res.clearCookie(c),
    );

    console.log("--- DELETION PROCESS COMPLETE ---");
    return res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error: any) {
    console.error("Fatal Deletion Error:", error.message);
    return res.status(500).json({ error: error.message || "Deletion failed" });
  }
};
export const signUp = async (
  email: string,
  password: string,
  username: string,
  phoneNumber?: string,
) => {
  try {
    const userAttributes = [
      { Name: "email", Value: email },
      { Name: "preferred_username", Value: username },
      { Name: "custom:phone_number", Value: phoneNumber || "" },
      { Name: "custom:profile", Value: "" },
      { Name: "custom:isAdmin", Value: "false" },
      { Name: "custom:isManager", Value: "false" },
      { Name: "custom:isSupport", Value: "false" },
    ];

    const response = await cognitoClient
      .signUp({
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        Username: email,
        Password: password,
        UserAttributes: userAttributes,
      })
      .promise();
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signIn = async (
  email: string,
  password: string,
  req?: Request,
  res?: Response,
) => {
  try {
    const response = await cognitoClient
      .initiateAuth({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        AuthParameters: { USERNAME: email, PASSWORD: password },
      })
      .promise();

    const authResult = response.AuthenticationResult;
    const idToken = authResult?.IdToken;
    const refreshToken = authResult?.RefreshToken;
    const accessToken = authResult?.AccessToken;

    if (!idToken || !refreshToken) {
      throw new Error("Failed to retrieve ID or refresh token");
    }

    const decodedToken = JSON.parse(
      Buffer.from(idToken.split(".")[1], "base64").toString("utf-8"),
    );

    const isAdmin = decodedToken["custom:isAdmin"] === "true";
    const isManager = decodedToken["custom:isManager"] === "true";
    const isSupport = decodedToken["custom:isSupport"] === "true";

    const cognitoPhone = decodedToken["custom:phone_number"] || "";
    const cognitoProfileImage = decodedToken["custom:profile"] || "";
    const preferredUsername =
      decodedToken.preferred_username || email.split("@")[0];

    let userRecord = await prisma.user.findUnique({
      where: { cognitoId: decodedToken.sub },
    });

    if (userRecord) {
      userRecord = await prisma.user.update({
        where: { cognitoId: decodedToken.sub },
        data: {
          email: decodedToken.email,
          username: preferredUsername,
          phone:
            userRecord.phone && userRecord.phone !== "false"
              ? userRecord.phone
              : cognitoPhone,
          profileImage:
            userRecord.profileImage && userRecord.profileImage !== "false"
              ? userRecord.profileImage
              : cognitoProfileImage !== "false"
                ? cognitoProfileImage
                : null,
        },
      });
    } else {
      userRecord = await prisma.user.create({
        data: {
          cognitoId: decodedToken.sub,
          email: decodedToken.email,
          username: preferredUsername,
          phone: cognitoPhone !== "false" ? cognitoPhone : "",
          profileImage:
            cognitoProfileImage !== "false" ? cognitoProfileImage : null,
          password: await bcrypt.hash(password, 10),
          isAdmin: false,
          isManager: false,
          isSupport: false,
        },
      });
    }

    if (req?.session) {
      req.session.idToken = idToken;
      req.session.refreshToken = refreshToken;
      req.session.accessToken = accessToken;
      req.session.user = {
        sub: decodedToken.sub,
        username: userRecord.username,
        phone: userRecord.phone || "",
        profileImage: userRecord.profileImage || "",
        isAdmin,
        isManager,
        isSupport,
        email,
      };
    }

    return {
      token: idToken,
      refreshToken,
      userData: {
        accessToken,
        email,
        username: userRecord.username,
        phone: userRecord.phone || "",
        profileImage: userRecord.profileImage || "",
        isAdmin,
        isManager,
        isSupport,
        cognitoId: userRecord.cognitoId || decodedToken.sub,
        id: userRecord.id,
      },
    };
  } catch (error: unknown) {
    console.error("Error during sign-in:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("An unknown error occurred");
  }
};
export const verifySession = async (
  req: Request & { accessToken?: string },
  res: Response,
) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.idToken;
  const accessToken = req.headers["x-access-token"] || req.cookies.accessToken;

  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded: any = jwt.decode(token);
    if (!decoded?.sub) throw new Error();

    const userRecord = await prisma.user.findUnique({
      where: { cognitoId: decoded.sub },
    });

    if (!userRecord) return res.status(404).json({ message: "User not found" });

    const session = await prisma.cookie.findUnique({
      where: { userId: userRecord.id },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) await prisma.cookie.delete({ where: { id: session.id } });
      res.clearCookie("idToken");
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res.status(401).json({ message: "Session expired" });
    }

    const cleanField = (val: any) =>
      val === "false" || val == null || val === "" ? null : val;
    const responseUser = {
      id: userRecord.id,
      email: userRecord.email,
      username: userRecord.username,
      phone: cleanField(userRecord.phone),
      profileImage: cleanField(userRecord.profileImage),
      isAdmin: userRecord.isAdmin || decoded["custom:isAdmin"] === "true",
      isManager: userRecord.isManager || decoded["custom:isManager"] === "true",
      isSupport: userRecord.isSupport || decoded["custom:isSupport"] === "true",
      token: token,
      accessToken: accessToken,
    };

    return res.status(200).json({
      message: "Session valid",
      user: responseUser,
      token,
      accessToken,
    });
  } catch (err) {
    res.clearCookie("idToken");
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export const confirmSignUp = async (email: string, code: string) => {
  try {
    await cognitoClient
      .confirmSignUp({
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        Username: email,
        ConfirmationCode: code,
      })
      .promise();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserAttributes = async (
  accessToken: string,
  attributes: UserAttributes,
): Promise<void> => {
  if (!accessToken) throw new Error("No access token");

  const userAttributes: AWS.CognitoIdentityServiceProvider.AttributeType[] = [];

  if (attributes.preferred_username) {
    userAttributes.push({
      Name: "preferred_username",
      Value: attributes.preferred_username,
    });
  }
  if (attributes.email) {
    userAttributes.push({ Name: "email", Value: attributes.email });
  }
  if (attributes.phone_number) {
    userAttributes.push({
      Name: "phone_number",
      Value: attributes.phone_number,
    });
    userAttributes.push({
      Name: "phone_number_verified",
      Value: "true",
    });
  }
  if (attributes["custom:phone_number"]) {
    userAttributes.push({
      Name: "custom:phone_number",
      Value: attributes["custom:phone_number"],
    });
  }
  if (attributes.profile) {
    userAttributes.push({ Name: "custom:profile", Value: attributes.profile });
  }
  if (attributes["custom:isAdmin"]) {
    userAttributes.push({
      Name: "custom:isAdmin",
      Value: attributes["custom:isAdmin"],
    });
  }
  if (attributes["custom:isManager"]) {
    userAttributes.push({
      Name: "custom:isManager",
      Value: attributes["custom:isManager"],
    });
  }
  if (attributes["custom:isSupport"]) {
    userAttributes.push({
      Name: "custom:isSupport",
      Value: attributes["custom:isSupport"],
    });
  }

  if (userAttributes.length === 0) return;

  await cognitoClient
    .updateUserAttributes({
      AccessToken: accessToken,
      UserAttributes: userAttributes,
    })
    .promise();
};

export const updateUserRole = async (
  requesterAccessToken: string,
  targetEmail: string,
  rolesToUpdate: RoleUpdateData,
): Promise<{ message: string }> => {
  try {
    const requester = await verifyToken(requesterAccessToken);
    if (!requester) throw new Error("Invalid or expired access token.");

    const requesterIsAdmin = requester["custom:isAdmin"];
    const requesterIsManager = requester["custom:isManager"];

    if (requesterIsAdmin !== "true" && requesterIsManager !== "true") {
      throw new Error("You are not authorized to update user roles.");
    }

    if (!targetEmail) throw new Error("Target user email is required.");

    const attributes: UserAttributes = {};
    if (rolesToUpdate.isAdmin !== undefined)
      attributes["custom:isAdmin"] = rolesToUpdate.isAdmin;
    if (rolesToUpdate.isManager !== undefined)
      attributes["custom:isManager"] = rolesToUpdate.isManager;
    if (rolesToUpdate.isSupport !== undefined)
      attributes["custom:isSupport"] = rolesToUpdate.isSupport;

    if (Object.keys(attributes).length === 0) {
      throw new Error("No role attributes provided for update.");
    }

    await cognitoClient
      .adminUpdateUserAttributes({
        UserPoolId: process.env.TOORTO_AWS_COGNITO_USER_POOL_ID!,
        Username: targetEmail,
        UserAttributes: Object.entries(attributes).map(([key, value]) => ({
          Name: key,
          Value: value!,
        })),
      })
      .promise();

    return { message: "User roles updated successfully." };
  } catch (error: any) {
    throw new Error(error.message || "Failed to update user role.");
  }
};

export const adminUpdateUser = async (
  username: string,
  attributesToUpdate: UserAttributes,
): Promise<void> => {
  try {
    const userAttributes = Object.entries(attributesToUpdate)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => ({ Name: key, Value: value! }));

    if (userAttributes.length === 0) return;

    await cognitoClient
      .adminUpdateUserAttributes({
        UserPoolId: process.env.TOORTO_AWS_COGNITO_USER_POOL_ID!,
        Username: username,
        UserAttributes: userAttributes,
      })
      .promise();
  } catch (error: any) {
    throw new Error(error.message || "Failed to update user attributes.");
  }
};

export const resendVerificationCode = async (email: string) => {
  try {
    await cognitoClient
      .resendConfirmationCode({
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        Username: email,
      })
      .promise();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    await cognitoClient
      .forgotPassword({
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        Username: email,
      })
      .promise();
  } catch (error: any) {
    throw new Error(error.message || "Failed to send password reset code.");
  }
};

export const resetPassword = async (
  email: string,
  newPassword: string,
  resetCode: string,
): Promise<void> => {
  try {
    await cognitoClient
      .confirmForgotPassword({
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        Username: email,
        ConfirmationCode: resetCode,
        Password: newPassword,
      })
      .promise();
  } catch (error: any) {
    throw new Error(error.message || "Failed to reset password.");
  }
};

export const signOut = async (accessToken: string) => {
  try {
    if (!accessToken) throw new Error("Access token is required");

    const decoded = jwt.decode(accessToken) as { sub?: string };
    if (!decoded?.sub) throw new Error("Invalid token: missing user ID");

    await cognitoClient.globalSignOut({ AccessToken: accessToken }).promise();

    const user = await prisma.user.findUnique({
      where: { cognitoId: decoded.sub },
    });
    if (user) {
      await prisma.cookie
        .delete({ where: { userId: user.id } })
        .catch(() => {});
    }

    return { message: "User logged out successfully" };
  } catch (error: any) {
    throw new Error(error.message || "Error during sign-out");
  }
};

export class TokenVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenVerificationError";
  }
}

export const verifyToken = async (
  token: string,
): Promise<VerifiedTokenData | null> => {
  try {
    const decoded: any = jwt.decode(token);
    if (!decoded || !decoded.sub || !decoded.email) return null;

    return {
      sub: decoded.sub,
      email: decoded.email,
      username: decoded["preferred_username"] || "",
      "custom:isAdmin": decoded["custom:isAdmin"],
      "custom:isManager": decoded["custom:isManager"],
      "custom:isSupport": decoded["custom:isSupport"],
      token,
    };
  } catch {
    return null;
  }
};

export const refreshTokenLogic = async (
  refreshToken: string,
): Promise<string> => {
  const response = await cognitoClient
    .initiateAuth({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID!,
      AuthParameters: { REFRESH_TOKEN: refreshToken },
    })
    .promise();

  const accessToken = response.AuthenticationResult?.AccessToken;
  if (!accessToken) throw new Error("No access token in response");
  return accessToken;
};

export const refreshTokenLogicV2 = async (
  refreshToken: string,
): Promise<{
  accessToken: string;
  idToken: string;
  expiresIn: number;
  tokenType: string;
}> => {
  try {
    const response = await cognitoClient
      .initiateAuth({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        AuthParameters: { REFRESH_TOKEN: refreshToken },
      })
      .promise();

    if (!response.AuthenticationResult)
      throw new Error("Failed to refresh token");

    return {
      accessToken: response.AuthenticationResult.AccessToken!,
      idToken: response.AuthenticationResult.IdToken!,
      expiresIn: response.AuthenticationResult.ExpiresIn!,
      tokenType: response.AuthenticationResult.TokenType!,
    };
  } catch (error: any) {
    console.error("Error refreshing token in Cognito:", error.message);
    throw new Error("Error refreshing token");
  }
};
