// === server/middleware/authMiddleware.js ===
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔐 JWT-based protection
export const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.warn("🚫 No token provided");
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.warn("🚫 User not found for token");
      return res.status(401).json({ message: "User not found" });
    }

    // 🧠 Normalize employer → recruiter
    if (user.role === "employer") {
      user.role = "recruiter";
    }

    console.log("✅ Authenticated:", user.name, "→ Role:", user.role);
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized: Not logged in" });
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
};

export default protect;
