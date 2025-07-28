// backend/routes/admin.js
import express from "express";
import {
  getAllUsers,
  toggleBlockUser,
  promoteUser,
  deleteUser,
  getAllJobs,
  getSingleJob,
  updateJobAsAdmin,
  getAllReports,
  seedReports,
  getAdminActivity,
  clearAdminActivity, // ✅ NEW
} from "../controllers/adminController.js";

import { adminDeleteJob } from "../controllers/jobController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👥 User Management
router.get("/users", protect, requireAdmin, getAllUsers);
router.patch("/users/:id/block", protect, requireAdmin, toggleBlockUser);
router.patch("/users/:id/promote", protect, requireAdmin, promoteUser);
router.delete("/users/:id", protect, requireAdmin, deleteUser);

// 💼 Job Management
router.get("/jobs", protect, requireAdmin, getAllJobs);
router.get("/jobs/:id", protect, requireAdmin, getSingleJob);
router.put("/jobs/:id", protect, requireAdmin, updateJobAsAdmin);
router.delete("/jobs/:id", protect, requireAdmin, adminDeleteJob);

// 🚩 Reports & Logs
router.get("/reports", protect, requireAdmin, getAllReports);
router.post("/reports/seed", protect, requireAdmin, seedReports);

// 📊 Admin Activity Logs
router.get("/activity", protect, requireAdmin, getAdminActivity);
router.delete("/activity", protect, requireAdmin, clearAdminActivity); // ✅ NEW

export default router;
