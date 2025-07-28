// server/routes/authOAuth.js
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Helper to generate token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// 🔐 Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // ✅ Always ask user to pick an account
  })
);

// ✅ Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user);
      res.redirect(`http://localhost:5173/login?token=${token}`);
    } catch (err) {
      console.error("JWT error:", err);
      res.redirect("http://localhost:5173/login?error=jwt_error");
    }
  }
);

// 🐱 GitHub OAuth login
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// ✅ GitHub callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user);
      res.redirect(`http://localhost:5173/login?token=${token}`);
    } catch (err) {
      console.error("JWT error:", err);
      res.redirect("http://localhost:5173/login?error=jwt_error");
    }
  }
);

export default router;
