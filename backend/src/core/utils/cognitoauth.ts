import AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import prisma from "./db.ts";

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
export const cognitoClient = new AWS.CognitoIdentityServiceProvider({
  region: "eu-west-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const signUp = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const response = await cognitoClient
      .signUp({
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "preferred_username", Value: username },
          { Name: "custom:isAdmin", Value: "false" },
          { Name: "custom:isManager", Value: "false" },
          { Name: "custom:isSupport", Value: "false" },
        ],
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
  res?: Response
) => {
  try {
    const response = await cognitoClient
      .initiateAuth({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
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
      Buffer.from(idToken.split(".")[1], "base64").toString("utf-8")
    );

    const isAdmin = decodedToken["custom:isAdmin"] === "true";
    const isManager = decodedToken["custom:isManager"] === "true";
    const isSupport = decodedToken["custom:isSupport"] === "true";

    const userRecord = await prisma.user.findUnique({
      where: { id: decodedToken.sub },
      select: { username: true, phone: true, profileImage: true },
    });

    const username = userRecord?.username || "";
    const phone = userRecord?.phone || "";
    const profileImage = userRecord?.profileImage || "";

    if (req && req.session) {
      req.session.idToken = idToken;
      req.session.refreshToken = refreshToken;
      req.session.accessToken = accessToken;

      req.session.user = {
        sub: decodedToken.sub,
        username,
        phone,
        profileImage,
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
        username,
        phone,
        profileImage,
        isAdmin,
        isManager,
        isSupport,
      },
    };
  } catch (error: unknown) {
    console.error("Error during sign-in:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

export const verifySession = async (
  req: Request & { accessToken?: string },
  res: Response
) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.idToken;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded: any = jwt.decode(token);
    if (!decoded?.sub) throw new Error();

    const session = await prisma.cookie.findUnique({
      where: { userId: decoded.sub },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) await prisma.cookie.delete({ where: { id: session.id } });
      res.clearCookie("idToken");
      res.clearCookie("refreshToken");
      return res.status(401).json({ message: "Session expired" });
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!userRecord) return res.status(404).json({ message: "User not found" });

    const responseUser = {
      id: userRecord.id,
      email: userRecord.email,
      username: userRecord.username,
      phone: userRecord.phone,
      profileImage: userRecord.profileImage,
      isAdmin: decoded["custom:isAdmin"],
      isManager: decoded["custom:isManager"],
      isSupport: decoded["custom:isSupport"],
    };

    return res.status(200).json({
      message: "Session valid",
      user: responseUser,
    });
  } catch (err) {
    res.clearCookie("idToken");
    res.clearCookie("refreshToken");
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

export const updateUserProfileCognito = async (req: Request): Promise<void> => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) throw new Error("No access token");

  const { username, email, phone } = req.body;

  const attributes: AWS.CognitoIdentityServiceProvider.AttributeType[] = [];

  if (username) {
    attributes.push({ Name: "preferred_username", Value: username });
  }

  if (email) {
    attributes.push({ Name: "email", Value: email });
  }

  if (phone) {
    attributes.push({ Name: "phone_number", Value: phone });
  }

  if (req.file) {
    const profileImageUrl = `${process.env.CDN_BASE_URL}/uploads/${req.file.originalname}`;
    attributes.push({ Name: "profile", Value: profileImageUrl });
  }

  if (attributes.length === 0) return;

  await cognitoClient
    .updateUserAttributes({
      AccessToken: accessToken,
      UserAttributes: attributes,
    })
    .promise();
};

export const resendVerificationCode = async (email: string) => {
  try {
    console.log(email);
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
  resetCode: string
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
    if (!accessToken) {
      throw new Error("Access token is required");
    }

    const decoded = jwt.decode(accessToken) as { sub?: string };

    if (!decoded?.sub) {
      throw new Error("Invalid token: missing user ID");
    }
    const userId = decoded.sub;

    await cognitoClient.globalSignOut({ AccessToken: accessToken }).promise();

    // Prisma fix
    await prisma.cookie.delete({
      where: { userId },
    });

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
  token: string
): Promise<VerifiedTokenData | null> => {
  try {
    const decoded: any = jwt.decode(token);
    if (!decoded || !decoded.sub || !decoded.email) return null;

    const user: VerifiedTokenData = {
      sub: decoded.sub,
      email: decoded.email,
      username: decoded["preferred_username"] || "",
      "custom:isAdmin": decoded["custom:isAdmin"],
      "custom:isManager": decoded["custom:isManager"],
      "custom:isSupport": decoded["custom:isSupport"],
      token,
    };

    return user;
  } catch {
    return null;
  }
};

export const refreshTokenLogic = async (
  refreshToken: string
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

export const adminUpdateUser = async (
  username: string,
  attributesToUpdate: {
    email?: string;
    preferred_username?: string;
    "custom:isAdmin"?: string;
    "custom:isManager"?: string;
    "custom:isSupport"?: string;
  }
): Promise<void> => {
  try {
    const userAttributes = Object.entries(attributesToUpdate).map(
      ([key, value]) => ({
        Name: key,
        Value: value!,
      })
    );

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

export const deleteFromCognito = async (username: string) => {
  try {
    await cognitoClient
      .adminDeleteUser({
        UserPoolId: process.env.TOORTO_AWS_COGNITO_USER_POOL_ID!,
        Username: username,
      })
      .promise();
  } catch (error: any) {
    const errorMsg = error?.message || error?.code || "Unknown Cognito error";
    console.error(`Failed to delete Cognito user "${username}":`, errorMsg);
    throw new Error(`Cognito deletion error: ${errorMsg}`);
  }
};
export const updateUserRole = async (
  requesterAccessToken: string,
  targetEmail: string,
  rolesToUpdate: {
    isAdmin?: string;
    isManager?: string;
    isSupport?: string;
  }
): Promise<{ message: string }> => {
  try {
    const requester = await verifyToken(requesterAccessToken);
    if (!requester) throw new Error("Invalid or expired access token.");

    const requesterIsAdmin = requester["custom:isAdmin"];
    const requesterIsManager = requester["custom:isManager"];
    const requesterIsSupport = requester["custom:isSupport"];

    if (requesterIsAdmin !== "true" && requesterIsManager !== "true") {
      throw new Error("You are not authorized to update user roles.");
    }

    if (!targetEmail) {
      throw new Error("Target user email is required.");
    }

    const attributesToUpdate: { Name: string; Value: string }[] = [];

    if (rolesToUpdate.isAdmin !== undefined) {
      attributesToUpdate.push({
        Name: "custom:isAdmin",
        Value: rolesToUpdate.isAdmin,
      });
    }

    if (rolesToUpdate.isManager !== undefined) {
      attributesToUpdate.push({
        Name: "custom:isManager",
        Value: rolesToUpdate.isManager,
      });
    }

    if (rolesToUpdate.isSupport !== undefined) {
      attributesToUpdate.push({
        Name: "custom:isSupport",
        Value: rolesToUpdate.isSupport,
      });
    }

    if (attributesToUpdate.length === 0) {
      throw new Error("No role attributes provided for update.");
    }

    await cognitoClient
      .adminUpdateUserAttributes({
        UserPoolId: process.env.TOORTO_AWS_COGNITO_USER_POOL_ID!,
        Username: targetEmail,
        UserAttributes: attributesToUpdate,
      })
      .promise();

    return { message: "User roles updated successfully." };
  } catch (error: any) {
    throw new Error(error.message || "Failed to update user role.");
  }
};

export const refreshTokenLogicV2 = async (
  refreshToken: string
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
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      })
      .promise();

    if (!response.AuthenticationResult) {
      throw new Error("Failed to refresh token");
    }

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
