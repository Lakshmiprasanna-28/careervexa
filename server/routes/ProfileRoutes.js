// server/routes/profileRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  updateProfile,
  uploadResume,
  deleteAccount,
  updateJobSeekerResume,
} from "../controllers/profileController.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

// Generic update
router.put("/", protect, updateProfile);

// Role-specific routes 👇
router.put("/update/jobseeker", protect, updateProfile);     // Job Seeker profile update
router.put("/update/recruiter", protect, updateProfile);     // ✅ Recruiter profile update
router.put("/update/admin", protect, updateProfile);         // Optional: Admin profile update

// Resume routes
router.put("/update/jobseeker/resume", protect, updateJobSeekerResume); // Optional: separate resume update
router.post("/resume", protect, upload.single("resume"), uploadResume);

// Account deletion
router.delete("/", protect, deleteAccount);

export default router;
