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
} from "src/controllers/authController.ts";

import { Request, Response } from "express";

import {
  registerUserSchema,
  loginUserSchema,
  updatePhoneSchema,
  confirmUserSignUpSchema,
  resendCodeSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "src/validation/auth.validation.ts";
import { createMulterUpload } from "src/hooks/createMulterUpload.ts";
import { loginLimiter } from "src/core/middelware/securityMiddleware.ts";
import { setAuthCookies } from "src/core/utils/cookiesDB.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import { signIn, verifySession } from "src/core/utils/cognitoauth.ts";

const authRouters = express.Router();
const upload = createMulterUpload();

authRouters.get(
  "/analytics/user-signups-by-month",
  ProtectRoute,
  adminAndManager,
  userSignupsByMonth,
);
authRouters.post("/auth/echo", (req: Request, res: Response) => {
  res.json({ body: req.body, contentType: req.headers["content-type"] });
});

authRouters.post(
  "/auth",
  loginLimiter,
  validateRequest(loginUserSchema),
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
    } catch (err: any) {
      console.error("[AUTH] signIn failed:", err?.message ?? err);
      res.status(401).json({ error: err?.message ?? "Login failed" });
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
