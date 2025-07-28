// server/routes/jobRoutes.js
import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getEmployerJobs,
  adminGetAllJobs,
  adminDeleteJob,
} from "../controllers/jobController.js";

import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createJob);
router.get("/", getAllJobs);
router.get("/my-posts", protect, getEmployerJobs);

// ✅ Admin-only routes
router.get("/admin/jobs", protect, requireAdmin, adminGetAllJobs);
router.delete("/admin/jobs/:id", protect, requireAdmin, adminDeleteJob);

router.get("/:id", getJobById);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

export default router;
