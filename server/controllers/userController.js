import User from "../models/User.js";
import bcrypt from "bcryptjs";

/**
 * Get current user info
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "❌ User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ getMe error:", err);
    res.status(500).json({ message: "Failed to fetch user." });
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "❌ User not found" });

    const allowedFields = [
      "name", "email", "phone", "location", "bio", "linkedin",
      "designation", "company", "position", "resume",
      "education", "experience", "skills", "projects", "social",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({ message: "✅ Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("❌ updateUserProfile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/**
 * Upload resume
 */
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "❌ No file uploaded" });

    const resumeUrl = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "❌ User not found" });

    user.resume = resumeUrl;
    await user.save();

    res.status(200).json({ message: "✅ Resume uploaded successfully", url: resumeUrl });
  } catch (err) {
    console.error("❌ uploadResume error:", err);
    res.status(500).json({ message: "Failed to upload resume" });
  }
};

/**
 * Save user settings
 */
export const saveUserSettings = async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, darkMode } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "❌ User not found" });

    user.settings = { emailNotifications, smsNotifications, darkMode };
    await user.save();

    res.status(200).json({ message: "✅ Settings saved successfully" });
  } catch (err) {
    console.error("❌ saveUserSettings error:", err);
    res.status(500).json({ message: "Failed to save settings" });
  }
};

/**
 * Change password
 */
export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "❌ User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: "✅ Password updated successfully" });
  } catch (err) {
    console.error("❌ changePassword error:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
};

/**
 * Delete account
 */
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.clearCookie("token");
    res.status(200).json({ message: "🗑️ Account deleted successfully" });
  } catch (err) {
    console.error("❌ deleteAccount error:", err);
    res.status(500).json({ message: "Failed to delete account" });
  }
};

/**
 * Search users for messaging with pagination
 */
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = query
      ? {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    if (req.user && req.user._id) {
      filter._id = { $ne: req.user._id };
    }

    const users = await User.find(filter)
      .select("_id name email avatar")
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      message: users.length ? "✅ Users fetched successfully" : "⚠️ No users found",
      users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ User search failed:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
