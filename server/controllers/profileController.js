import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { uploadToCloudinary } from "../middleware/uploadMiddleware.js";
import { getAdminWhitelist } from "../config/adminWhitelist.js";

// 🔐 Token generator
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ Update profile (for any user role)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("📥 Incoming data:", req.body);

    const {
      name,
      email,
      phone,
      location,
      education,
      experience,
      skills,
      projects,
      social,
      resume,
      role,
      company,
      position, // 🔥 newly handled
    } = req.body;

    const whitelist = getAdminWhitelist();
    const isAdmin = whitelist.includes(user.email.toLowerCase());

    // Apply updates with logs
    if (name) {
      user.name = name;
      console.log("📝 name =", name);
    }
    if (email) {
      user.email = email;
      console.log("📧 email =", email);
    }
    if (phone) {
      user.phone = phone;
      console.log("📞 phone =", phone);
    }
    if (location) {
      user.location = location;
      console.log("📍 location =", location);
    }
    if (resume) {
      user.resume = resume;
      console.log("📎 resume =", resume);
    }
    if (company) {
      user.company = company;
      console.log("🏢 company =", company);
    }
    if (position) {
      user.position = position;
      console.log("💼 position =", position);
    }
    if (Array.isArray(education)) {
      user.education = education;
      console.log("🎓 education =", education);
    }
    if (Array.isArray(experience)) {
      user.experience = experience;
      console.log("💼 experience =", experience);
    }
    if (Array.isArray(skills)) {
      user.skills = skills;
      console.log("🛠️ skills =", skills);
    }
    if (Array.isArray(projects)) {
      user.projects = projects;
      console.log("📂 projects =", projects);
    }
    if (Array.isArray(social)) {
      user.social = social;
      console.log("🔗 social =", social);
    }

    // Handle role changes (admin-protected)
    if (role && ["seeker", "recruiter", "employer", "admin"].includes(role)) {
      if (role === "admin" && !isAdmin) {
        return res.status(403).json({ message: "Not allowed to become admin" });
      }
      user.role = role === "recruiter" ? "employer" : role;
    }

    await user.save();
    console.log("✅ User updated in DB:", user);

    req.login(user, (err) => {
      if (err) {
        console.error("🔁 Failed to re-login:", err.message);
        return res.status(500).json({ message: "Session update failed" });
      }
      console.log("🔁 Session re-login success!");
      return res.status(200).json({ message: "Profile updated", user });
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ message: "Profile update failed", error: err.message });
  }
};

// ✅ Upload resume to Cloudinary
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      "resumes",
      "raw"
    );

    if (!result?.url) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume: result.url },
      { new: true }
    );

    console.log("📄 Resume uploaded to Cloudinary:", result.url);

    res.json({ resumeUrl: user.resume });
  } catch (err) {
    console.error("❌ Resume upload failed:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

// ✅ Update resume path manually
export const updateJobSeekerResume = async (req, res) => {
  try {
    const { resume } = req.body;
    if (!resume || typeof resume !== "string" || resume === "undefined") {
      return res.status(400).json({ message: "Invalid resume path" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("✅ Resume path updated:", user.resume);

    res.json({
      success: true,
      message: "✅ Resume path updated successfully",
      resume: user.resume,
    });
  } catch (err) {
    console.error("❌ Resume path update error:", err.message);
    res.status(500).json({ message: "Failed to update resume", error: err.message });
  }
};

// ✅ Delete user account
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    console.log("🗑️ User account deleted:", req.user._id);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("❌ Account deletion error:", err);
    res.status(500).json({ message: "Account deletion failed", error: err.message });
  }
};
