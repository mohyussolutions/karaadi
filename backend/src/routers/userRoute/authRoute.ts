import express from "express";
import multer from "multer";
import {
  registerUser,
  confirmUserSignUp,
  resetCodeUser,
  forgotPasswordIncontroller,
  resetPasswordIncontroller,
  logout,
  refreshTokenController,
  deleteAccount,
  getUsersCount,
  getUserProfile,
  getAllUsers,
  updateProfileImage,
  updatePhone,
  deleteUserById,
} from "../../controllers/userController/authController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";
import { signIn, verifySession } from "../../core/utils/cognitoauth.ts";
import { setAuthCookies } from "../../core/utils/cookiesDB.ts";
import { validate } from "src/core/middelware/validator.ts";
import { Request, Response, NextFunction } from "express";
import { loginLimiter } from "src/core/middelware/securityMiddleware.ts";

const authRouters = express.Router();

authRouters.post(
  "/auth",
  loginLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const { token, refreshToken, userData } = await signIn(email, password);

      await setAuthCookies(res, { idToken: token, refreshToken });

      return res.json({ token, user: userData });
    } catch (err) {
      console.error("Cognito login failed for user:", email, err);
      return res.status(401).json({ error: "Login failed" });
    }
  },
);

authRouters.put("/profile/phone", ProtectRoute, updatePhone);

authRouters.get(
  "/all-users",
  ProtectRoute,
  adminAndManager,
  async (req: Request, res: Response) => {
    try {
      await getAllUsers(req, res);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch users" });
    }
  },
);

authRouters.post(
  "/register",
  validate.register,
  validate.handleErrors,
  async (req: Request, res: Response) => {
    try {
      const { email, password, username, phone } = req.body;
      const sanitizedBody: any = { ...req.body };
      if (sanitizedBody.password) sanitizedBody.password = "***";
      console.log("Register request:", {
        bodyKeys: Object.keys(req.body),
        sanitizedBody,
      });
      const cognitoResult = await registerUser(
        email,
        password,
        username,
        phone,
      );
      res.json({ message: "User registered successfully", cognitoResult });
    } catch (error: any) {
      console.error("Register failed:", error?.message || error);
      res.status(400).json({ error: error.message || "Register failed" });
    }
  },
);

authRouters.post("/confirm", confirmUserSignUp);

authRouters.post("/verify-session", ProtectRoute, verifySession);

authRouters.post("/resend-code", async (req: Request, res: Response) => {
  try {
    await resetCodeUser(req, res);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Resend failed" });
  }
});

authRouters.put("/profile/image ", ProtectRoute, async (req, res, next) => {
  try {
    await updateProfileImage(req as any, res);
  } catch (error) {
    next(error);
  }
});

authRouters.post("/forgot-password", forgotPasswordIncontroller);
authRouters.post("/reset-password", resetPasswordIncontroller);
authRouters.post("/logout", async (req, res) => await logout(req, res));
authRouters.post("/refreshtoken", refreshTokenController);
authRouters.delete(
  "/delete-account",
  ProtectRoute,
  async (req, res) => await deleteAccount(req as any, res),
);

authRouters.delete(
  "/:id",
  ProtectRoute,
  adminAndManager,
  async (req: Request, res: Response) => await deleteUserById(req as any, res),
);

authRouters.get(
  "/total-users",
  ProtectRoute,
  adminAndManager,
  async (req: Request, res: Response) => {
    try {
      await getUsersCount(req, res);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Failed to get total users" });
    }
  },
);

authRouters.get("/me", ProtectRoute, getUserProfile);

export default authRouters;
