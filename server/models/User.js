// === server/models/User.js ===
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, default: "" },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: "" },
  role: {
    type: String,
    enum: ["admin", "recruiter", "employer", "jobseeker", "seeker"],
    default: "jobseeker",
  },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  avatar: { type: String, default: "" },
  profilePhoto: { type: String, default: "" },
  phone: { type: String, default: "" },
  designation: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  location: { type: String, default: "" },
  bio: { type: String, default: "" },
  company: { type: String, default: "" },
  position: { type: String, default: "" },

  // ✅ Education
  education: {
    type: [
      {
        degree: { type: String, default: "" },
        course: { type: String, default: "" },
        year: { type: String, default: "" },
        institution: { type: String, default: "" },
        location: { type: String, default: "" },
      },
    ],
    default: [],
  },

  // ✅ Experience
  experience: {
    type: [
      {
        title: { type: String, default: "" },
        company: { type: String, default: "" },
        years: { type: String, default: "" },
        location: { type: String, default: "" },
      },
    ],
    default: [],
  },

  skills: { type: [String], default: [] },

  projects: {
    type: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        link: { type: String, default: "" },
      },
    ],
    default: [],
  },

  social: {
    type: [
      {
        platform: { type: String, default: "" },
        url: { type: String, default: "" },
      },
    ],
    default: [],
  },

  resume: { type: String, default: "" },
  resetToken: { type: String, default: "" },
  tokenExpiry: { type: Date },

  // ✅ Notification Settings
  settings: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    darkMode: { type: Boolean, default: false },
  },

  // ✅ 🔒 Blocked Users for Chat
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
