import express, { Request, Response } from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  loginUser,
  registerUserHandler,
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
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import { verifySession } from "src/core/utils/cognitoauth.ts";

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

authRouters.post("/auth", loginLimiter, validateRequest(loginUserSchema), loginUser);

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

authRouters.post("/register", validateRequest(registerUserSchema), registerUserHandler);

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
