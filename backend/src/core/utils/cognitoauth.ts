import {
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
  SignUpCommand,
  InitiateAuthCommand,
  GlobalSignOutCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  UpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { Request, Response } from "express";
import prisma from "./db.ts";
import { createHash } from "crypto";
import cacheManager from "src/services/redisserver/cacheManager.ts";
import {
  VerifiedTokenData,
  RoleUpdateData,
  UserAttributes,
} from "../../types/index.ts";

const jwksUri = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.TOORTO_AWS_COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

const jwksClientInstance = jwksClient({
  jwksUri,
  cache: true,
  cacheMaxAge: 600000,
  rateLimit: true,
  jwksRequestsPerMinute: 20,
});

const getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
  if (!header.kid) return callback(new Error("Missing kid"));
  jwksClientInstance.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key?.getPublicKey());
  });
};

export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export const deleteFromCognito = async (cognitoId: string): Promise<void> => {
  try {
    await cognitoClient.send(
      new AdminDeleteUserCommand({
        UserPoolId: process.env.TOORTO_AWS_COGNITO_USER_POOL_ID!,
        Username: cognitoId,
      }),
    );
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

  const rawId = req.body.id || user?.id || user?.sub;
  const userId = Array.isArray(rawId)
    ? (rawId[0] as string)
    : (rawId as string);

  if (!userId) {
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
        if (err && err.message && err.message.includes("security token")) {
          console.error(
            "AWS Cognito deletion failed due to invalid credentials.",
          );
          console.error(
            "Check AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and TOORTO_AWS_COGNITO_USER_POOL_ID environment variables.",
          );
        }
        console.error(
          `Failed to delete user from Cognito: ${targetCognitoId}`,
          err,
        );
        return res.status(500).json({
          error: "Failed to delete user from Cognito. Please contact support.",
        });
      }
    }

    ["idToken", "refreshToken", "accessToken", "token"].forEach((c) =>
      res.clearCookie(c),
    );

    return res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error: any) {
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

    const response = await cognitoClient.send(
      new SignUpCommand({
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        Username: email,
        Password: password,
        UserAttributes: userAttributes,
      }),
    );
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
    const response = await cognitoClient.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        AuthParameters: { USERNAME: email, PASSWORD: password },
      }),
    );

    const authResult = response.AuthenticationResult;
    const idToken = authResult?.IdToken;
    const refreshToken = authResult?.RefreshToken;
    const accessToken = authResult?.AccessToken;

    if (!idToken || !refreshToken) {
      throw new Error("Failed to retrieve ID or refresh token");
    }

    const decodedToken = jwt.decode(idToken) as any;

    const isAdmin = decodedToken["custom:isAdmin"] === "true";
    const isManager = decodedToken["custom:isManager"] === "true";
    const isSupport = decodedToken["custom:isSupport"] === "true";

    const cognitoPhone = decodedToken["custom:phone_number"] || "";
    const cognitoProfileImage = decodedToken["custom:profile"] || "";
    const preferredUsername =
      decodedToken.preferred_username || email.split("@")[0];

    const userRecord = await prisma.user.upsert({
      where: { cognitoId: decodedToken.sub },
      update: {
        email: decodedToken.email,
        username: preferredUsername,
      },
      create: {
        cognitoId: decodedToken.sub,
        email: decodedToken.email,
        username: preferredUsername,
        phone: cognitoPhone !== "false" ? cognitoPhone : "",
        profileImage:
          cognitoProfileImage !== "false" ? cognitoProfileImage : null,
        password: "",
        isAdmin: false,
        isManager: false,
        isSupport: false,
      },
      select: {
        id: true,
        username: true,
        phone: true,
        profileImage: true,
        cognitoId: true,
      },
    });

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

  const cacheKey = `session:${createHash("sha256").update(token).digest("hex").slice(0, 40)}`;
  const cached = await cacheManager.get(cacheKey).catch(() => null);
  if (cached) return res.status(200).json(cached);

  return new Promise<Response>((resolve) => {
    jwt.verify(
      token,
      getKey,
      {
        issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.TOORTO_AWS_COGNITO_USER_POOL_ID}`,
        ignoreExpiration: false,
      },
      async (err, decoded) => {
        if (err || !decoded) {
          res.clearCookie("idToken");
          res.clearCookie("refreshToken");
          res.clearCookie("accessToken");
          return resolve(
            res.status(401).json({ message: "Authentication failed" }),
          );
        }

        try {
          const payload = decoded as any;
          const [userRecord, session] = await Promise.all([
            prisma.user.findUnique({ where: { cognitoId: payload.sub } }),
            prisma.cookie.findFirst({ where: { user: { cognitoId: payload.sub } } }),
          ]);

          if (!userRecord) {
            return resolve(res.status(404).json({ message: "User not found" }));
          }

          if (!session || session.expiresAt < new Date()) {
            if (session)
              prisma.cookie.delete({ where: { id: session.id } }).catch(() => {});
            res.clearCookie("idToken");
            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            return resolve(res.status(401).json({ message: "Session expired" }));
          }

          const cleanField = (val: any) =>
            val === "false" || val == null || val === "" ? null : val;

          const responseUser = {
            id: userRecord.id,
            email: userRecord.email,
            username: userRecord.username,
            phone: cleanField(userRecord.phone),
            profileImage: cleanField(userRecord.profileImage),
            isAdmin: userRecord.isAdmin || payload["custom:isAdmin"] === "true",
            isManager: userRecord.isManager || payload["custom:isManager"] === "true",
            isSupport: userRecord.isSupport || payload["custom:isSupport"] === "true",
            token: token,
            accessToken: accessToken,
          };

          const body = { message: "Session valid", user: responseUser, token, accessToken };
          cacheManager.set(cacheKey, body, 60).catch(() => {});
          return resolve(res.status(200).json(body));
        } catch {
          res.clearCookie("idToken");
          res.clearCookie("refreshToken");
          res.clearCookie("accessToken");
          return resolve(
            res.status(401).json({ message: "Authentication failed" }),
          );
        }
      },
    );
  });
};

export const confirmSignUp = async (email: string, code: string) => {
  try {
    await cognitoClient.send(
      new ConfirmSignUpCommand({
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        Username: email,
        ConfirmationCode: code,
      }),
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserAttributes = async (
  accessToken: string,
  attributes: UserAttributes,
): Promise<void> => {
  if (!accessToken) throw new Error("No access token");

  const userAttributes: { Name: string; Value: string }[] = [];

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

  await cognitoClient.send(
    new UpdateUserAttributesCommand({
      AccessToken: accessToken,
      UserAttributes: userAttributes,
    }),
  );
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

    await cognitoClient.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: process.env.TOORTO_AWS_COGNITO_USER_POOL_ID!,
        Username: targetEmail,
        UserAttributes: Object.entries(attributes).map(([key, value]) => ({
          Name: key,
          Value: String(value!),
        })),
      }),
    );

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
      .map(([key, value]) => ({ Name: key, Value: String(value!) }));

    if (userAttributes.length === 0) return;

    await cognitoClient.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: process.env.TOORTO_AWS_COGNITO_USER_POOL_ID!,
        Username: username,
        UserAttributes: userAttributes,
      }),
    );
  } catch (error: any) {
    throw new Error(error.message || "Failed to update user attributes.");
  }
};

export const resendVerificationCode = async (email: string) => {
  try {
    await cognitoClient.send(
      new ResendConfirmationCodeCommand({
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        Username: email,
      }),
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    await cognitoClient.send(
      new ForgotPasswordCommand({
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        Username: email,
      }),
    );
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
    await cognitoClient.send(
      new ConfirmForgotPasswordCommand({
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        Username: email,
        ConfirmationCode: resetCode,
        Password: newPassword,
      }),
    );
  } catch (error: any) {
    throw new Error(error.message || "Failed to reset password.");
  }
};

export const signOut = async (accessToken: string) => {
  try {
    if (!accessToken) throw new Error("Access token is required");

    const decoded = jwt.decode(accessToken) as { sub?: string };
    if (!decoded?.sub) throw new Error("Invalid token: missing user ID");

    await cognitoClient.send(
      new GlobalSignOutCommand({ AccessToken: accessToken }),
    );

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
  const response = await cognitoClient.send(
    new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID!,
      AuthParameters: { REFRESH_TOKEN: refreshToken },
    }),
  );

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
    const response = await cognitoClient.send(
      new InitiateAuthCommand({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: process.env.TOORTO_AWS_COGNITO_CLIENT_ID || "",
        AuthParameters: { REFRESH_TOKEN: refreshToken },
      }),
    );

    if (!response.AuthenticationResult)
      throw new Error("Failed to refresh token");

    return {
      accessToken: response.AuthenticationResult.AccessToken!,
      idToken: response.AuthenticationResult.IdToken!,
      expiresIn: response.AuthenticationResult.ExpiresIn!,
      tokenType: response.AuthenticationResult.TokenType!,
    };
  } catch (error: any) {
    throw new Error("Error refreshing token");
  }
};
