// 📁 server/routes/userRoutes.js
import express from "express";
import {
  getMe,
  updateUserProfile,
  uploadResume,
  saveUserSettings,
  changePassword,
  deleteAccount,
  searchUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateUserProfile);
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);
router.post("/settings", protect, saveUserSettings);
router.put("/change-password", protect, changePassword);
router.delete("/me", protect, deleteAccount);

// 🔍 User search (used in chat for starting new convo)
router.get("/search", protect, searchUsers);

export default router;
