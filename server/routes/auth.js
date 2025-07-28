// ✅ Updated /routes/auth.js for same-tab OAuth login with token redirect
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  setPassword,
  oauthSuccess,
} from "../controllers/authController.js";

// 🔐 Local Auth Routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/set-password", setPassword);
router.get("/oauth/success", oauthSuccess);

// 🚪 Logout Route
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session?.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

// 🌐 Google OAuth (with redirect instead of popup)
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // ✅ Redirect with token in query
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

// 🐙 GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

export default router;
