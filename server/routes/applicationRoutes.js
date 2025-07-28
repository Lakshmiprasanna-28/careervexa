// === routes/applicationRoutes.js ===
import express from "express";
import {
  applyToJob,
  getUserApplications,
  getApplicants,
  getApplicantsByJob,
  deleteApplication,
  downloadResume,
  updateApplicationStatus,
  getApplicationById, // ✅ ADD THIS
} from "../controllers/applicationController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("resume"), applyToJob);

router.get("/mine", protect, getUserApplications);
router.get("/", protect, authorize("admin", "recruiter"), getApplicants);
router.get("/job/:jobId", protect, authorize("admin", "recruiter"), getApplicantsByJob);
router.delete("/:id", protect, deleteApplication);
router.get("/download/:filename", downloadResume); // ✅ DOWNLOAD ROUTE
router.put("/:id/status", protect, authorize("admin", "recruiter"), updateApplicationStatus);

// ✅ NEW: Get application by ID for notification navigation
router.get("/:id", protect, getApplicationById);

export default router;
