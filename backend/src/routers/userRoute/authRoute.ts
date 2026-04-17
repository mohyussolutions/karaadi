import {
  registerUserSchema,
  updatePhoneSchema,
  confirmUserSignUpSchema,
  resendCodeSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "../../validation/auth.validation.ts";
import express from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  registerUser,
  confirmUserSignUp,
  resetCodeUser,
  forgotPasswordIncontroller,
  resetPasswordIncontroller,
  logout,
  refreshTokenController,
  deleteMyAccount,
  getUsersCount,
  getUserProfile,
  getAllUsers,
  updateProfileImage,
  updatePhoneInDb,
  deleteUserByAdmin,
  userSignupsByMonth,
} from "../../controllers/userController/authController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";
import { signIn, verifySession } from "../../core/utils/cognitoauth.ts";
import { setAuthCookies } from "../../core/utils/cookiesDB.ts";
import { Request, Response } from "express";
import { loginLimiter } from "../../core/middelware/securityMiddleware.ts";
import { createMulterUpload } from "../../hooks/createMulterUpload.ts";

const authRouters = express.Router();
const upload = createMulterUpload();

authRouters.get(
  "/analytics/user-signups-by-month",
  ProtectRoute,
  adminAndManager,
  userSignupsByMonth,
);
authRouters.post(
  "/auth",
  loginLimiter,
  validateRequest(registerUserSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const { token, refreshToken, userData } = await signIn(
        email,
        password,
        req,
        res,
      );
      await setAuthCookies(
        res,
        { idToken: token, refreshToken },
        undefined,
        userData.id,
      );
      res.json({ token, user: userData });
    } catch {
      res.status(401).json({ error: "Login failed" });
    }
  },
);

authRouters.put(
  "/profile/phone",
  ProtectRoute,
  validateRequest(updatePhoneSchema),
  updatePhoneInDb,
);

authRouters.put(
  "/profile/image",
  ProtectRoute,
  upload.single("profileImage"),
  updateProfileImage,
);

authRouters.get("/all-users", ProtectRoute, adminAndManager, getAllUsers);

authRouters.post(
  "/register",
  validateRequest(registerUserSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, password, username, phone } = req.body;
      const cognitoResult = await registerUser(
        email,
        password,
        username,
        phone,
      );
      res.json({ message: "User registered successfully", cognitoResult });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Register failed" });
    }
  },
);

authRouters.post(
  "/confirm",
  validateRequest(confirmUserSignUpSchema),
  confirmUserSignUp,
);

authRouters.post("/verify-session", ProtectRoute, verifySession);

authRouters.post(
  "/resend-code",
  validateRequest(resendCodeSchema),
  resetCodeUser,
);

authRouters.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  forgotPasswordIncontroller,
);

authRouters.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPasswordIncontroller,
);

authRouters.post("/logout", logout);

authRouters.post(
  "/refreshtoken",
  validateRequest(refreshTokenSchema),
  refreshTokenController,
);

authRouters.delete("/delete-account", ProtectRoute, deleteMyAccount);

authRouters.delete(
  "/admin-deletetion/:id",
  ProtectRoute,
  adminAndManager,
  deleteUserByAdmin,
);

authRouters.get("/total-users", ProtectRoute, adminAndManager, getUsersCount);

authRouters.get("/me", ProtectRoute, getUserProfile);

export default authRouters;
