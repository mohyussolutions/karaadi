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
  updateUserProfile,
  deleteAccount,
  getUsersCount,
  getUserProfile,
  getAllUsers,
} from "controllers/userController/authController.ts";
import { ProtectRoute } from "core/middelware/authMiddlewareBothDbAndCognito.ts";
import { signIn, verifySession } from "core/utils/cognitoauth.ts";
import { setAuthCookies } from "core/utils/cookiesDB.ts";

const authRouters = express.Router();
const upload = multer();

authRouters.post("/auth", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { token, refreshToken, userData } = await signIn(email, password);

    await setAuthCookies(res, { idToken: token, refreshToken });

    return res.json({ token, user: userData });
  } catch (err) {
    console.error("Cognito login failed for user:", email, err);
    return res.status(401).json({ error: "Login failed" });
  }
});
authRouters.get("/all-users", async (req, res) => {
  try {
    await getAllUsers(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
  }
});

authRouters.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const cognitoResult = await registerUser(email, password, username);
    res.json({ message: "User registered successfully", cognitoResult });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Register failed" });
  }
});

authRouters.post("/confirm", confirmUserSignUp);

authRouters.post("/verify-session", ProtectRoute, verifySession);

authRouters.post("/resend-code", async (req, res) => {
  try {
    await resetCodeUser(req, res);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Resend failed" });
  }
});

authRouters.put(
  "/profile",
  upload.single("profileImage"),
  async (req, res, next) => {
    try {
      await updateUserProfile(req as any, res);
    } catch (error) {
      next(error);
    }
  }
);

authRouters.post("/forgot-password", forgotPasswordIncontroller);
authRouters.post("/reset-password", resetPasswordIncontroller);
authRouters.post("/logout", async (req, res) => await logout(req, res));
authRouters.post("/refreshtoken", refreshTokenController);
authRouters.delete(
  "/delete-account",
  ProtectRoute,
  async (req, res) => await deleteAccount(req as any, res)
);

authRouters.get("/total-users", async (req, res) => {
  try {
    await getUsersCount(req, res);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to get total users" });
  }
});

authRouters.get("/me", ProtectRoute, getUserProfile);

export default authRouters;
