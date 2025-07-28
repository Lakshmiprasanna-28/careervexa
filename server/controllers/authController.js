// server/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { getAdminWhitelist } from "../config/adminWhitelist.js";
import { sendEmail } from "../utils/sendEmail.js";

// 🔐 Generate JWT
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// 🧠 Extract readable name from email
const extractNameFromEmail = (email) => {
  const [username] = email.split("@");
  const cleaned = username.replace(/[0-9]/g, "");
  const parts = cleaned.includes(".") ? cleaned.split(".") : cleaned.match(/[a-zA-Z][a-z]+/g);
  return parts ? parts.map((p) => p[0].toUpperCase() + p.slice(1)).join(" ") : "User";
};

// 🔁 Sync whitelist
const syncRoleWithWhitelist = async (user) => {
  const whitelist = getAdminWhitelist();
  const isAdmin = whitelist.includes(user.email.toLowerCase());
  const correctRole = isAdmin ? "admin" : "seeker";
  if (user.role !== correctRole) {
    user.role = correctRole;
    await user.save();
  }
  return user;
};

// ✅ Register
export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const name = extractNameFromEmail(email);
    const role = getAdminWhitelist().includes(email.toLowerCase()) ? "admin" : "seeker";
    const user = await User.create({ email, password, name, role });
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Registration successful", user, token });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// ✅ Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user = await syncRoleWithWhitelist(user);
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", user, token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// ✅ Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetToken = token;
    user.tokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${token}`;

    await sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: `<p>Hi ${user.name || "there"}, click below to reset your password:</p>
             <a href="${resetUrl}" target="_blank" style="color:blue;">Reset Password</a>`,
    });

    res.status(200).json({ message: "Reset link sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send reset email", error: err.message });
  }
};

// ✅ Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      tokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = password;
    user.resetToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Reset failed", error: err.message });
  }
};

// ✅ Set Password (OAuth)
export const setPassword = async (req, res) => {
  const { newPassword } = req.body;
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.password) {
      return res.status(400).json({ message: "Password already set or user not found" });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password set successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to set password", error: err.message });
  }
};

// ✅ OAuth Success
export const oauthSuccess = async (req, res) => {
  const { email } = req.query;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      const name = extractNameFromEmail(email);
      user = await User.create({ email, name });
    }

    user = await syncRoleWithWhitelist(user);
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}?token=${token}`);
  } catch (err) {
    res.status(500).json({ message: "OAuth failed", error: err.message });
  }
};
