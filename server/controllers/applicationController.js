import Application from "../models/Application.js";
import Job from "../models/JobPost.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import { sendNotification } from "../utils/sendNotification.js";
import { sendEmail } from "../utils/sendEmail.js";
import notificationTypes from "../utils/notificationTypes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Apply to a job
export const applyToJob = async (req, res) => {
  try {
    const { jobId, message } = req.body;
    const resume = req.file ? `/uploads/${req.file.filename}` : null;
    const resumeName = req.file ? req.file.originalname : null;

    const job = await Job.findById(jobId).populate("postedBy");
    if (!job) return res.status(404).json({ error: "Job not found" });

    const application = new Application({
      applicant: req.user._id,
      job: jobId,
      message,
      resume,
      resumeName,
    });

    await application.save();

    // 🔔 Notify recruiter
    const recruiterId = job.postedBy._id.toString();
    await sendNotification(recruiterId, {
      type: notificationTypes.APPLICATION_SUBMITTED,
      message: `A new application has been submitted for: ${job.title}`,
      link: `/dashboard/applicants/${jobId}`,
    });

    // 📧 Email recruiter
    if (job.postedBy.email) {
      await sendEmail({
        to: job.postedBy.email,
        subject: "New Application Received",
        text: `An applicant has applied for your job: "${job.title}".`,
      });
    }

    res.status(201).json(application);
  } catch (err) {
    console.error("❌ Apply Error:", err);
    res.status(500).json({ error: "Failed to apply" });
  }
};

// ✅ Get current user's applications
export const getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id }).populate("job");
    const normalized = apps.map((app) => {
      app.resume = app.resume === "undefined" ? null : app.resume;
      return app;
    });
    res.json(normalized);
  } catch (err) {
    console.error("❌ Get My Applications Error:", err);
    res.status(500).json({ error: "Failed to fetch your applications" });
  }
};

// ✅ Admin/Recruiter: Get all applicants
export const getApplicants = async (req, res) => {
  try {
    const user = req.user;
    let apps = [];

    if (user.role === "admin") {
      apps = await Application.find()
        .populate("job", "title company postedBy")
        .populate("applicant", "name email")
        .select("resume resumeName message job applicant status");
    } else if (user.role === "recruiter") {
      const jobs = await Job.find({ postedBy: user._id }).select("_id");
      const jobIds = jobs.map((job) => job._id);
      apps = await Application.find({ job: { $in: jobIds } })
        .populate("job", "title company postedBy")
        .populate("applicant", "name email")
        .select("resume resumeName message job applicant status");
    } else {
      return res.status(403).json({ error: "Not authorized" });
    }

    apps.forEach((app) => {
      app.resume = app.resume === "undefined" ? null : app.resume;
    });

    res.json(apps);
  } catch (err) {
    console.error("❌ Get Applicants Error:", err);
    res.status(500).json({ error: "Failed to fetch applicants" });
  }
};

// ✅ Get applicants for specific job
export const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = req.user;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const isRecruiter = job.postedBy.toString() === user._id.toString();
    if (user.role !== "admin" && !isRecruiter) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const apps = await Application.find({ job: jobId })
      .populate("job", "title company")
      .populate("applicant", "name email")
      .select("resume resumeName message job applicant status");

    apps.forEach((app) => {
      app.resume = app.resume === "undefined" ? null : app.resume;
    });

    res.json(apps);
  } catch (err) {
    console.error("❌ Get Applicants By Job Error:", err);
    res.status(500).json({ error: "Failed to fetch applicants" });
  }
};

// ✅ Delete application
export const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: "Application not found" });

    const job = await Job.findById(app.job);
    const isOwner = String(app.applicant) === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    const isRecruiter =
      req.user.role === "recruiter" && job && String(job.postedBy) === req.user._id.toString();

    if (!isOwner && !isAdmin && !isRecruiter) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await app.deleteOne();
    res.json({ message: "✅ Application deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Application Error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
};

// ✅ Download resume
export const downloadResume = (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../uploads", filename);

    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.download(filePath);
    } else {
      res.status(404).json({ error: "Resume not found" });
    }
  } catch (err) {
    console.error("❌ Download Resume Error:", err);
    res.status(500).json({ error: "Failed to download resume" });
  }
};

// ✅ Update application status
export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  let { status } = req.body;

  try {
    if (typeof status !== "string") {
      return res.status(400).json({ error: "Status must be a string" });
    }

    status = status.trim().toLowerCase();
    const validStatuses = {
      "in process": "In Process",
      selected: "Selected",
      rejected: "Rejected",
    };

    if (!validStatuses[status]) {
      return res.status(400).json({
        error: "Invalid status. Use: 'In Process', 'Selected', or 'Rejected'",
      });
    }

    const application = await Application.findById(id).populate("applicant job");
    if (!application) return res.status(404).json({ error: "Application not found" });

    application.status = validStatuses[status];
    await application.save();

    const applicantId = application.applicant._id.toString();
    const jobTitle = application.job?.title || "a job";

    // 🔔 Notify applicant
    await sendNotification(applicantId, {
      type: notificationTypes.APPLICATION_STATUS,
      message: `Your application for "${jobTitle}" is now: ${validStatuses[status]}`,
      link: `/dashboard/applications`,
    });

    // 📧 Email
    await sendEmail({
      to: application.applicant.email,
      subject: "Your Application Status Changed",
      text: `Your application for "${jobTitle}" is now "${validStatuses[status]}".`,
    });

    res.json({ success: true, message: "Status updated", application });
  } catch (error) {
    console.error("❌ Status Update Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ NEW: Get application by ID (for navigating from notification link)
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await Application.findById(id)
      .populate("job", "title company")
      .populate("applicant", "name email");

    if (!app) return res.status(404).json({ error: "Application not found" });

    res.json(app);
  } catch (err) {
    console.error("❌ Get Application By ID Error:", err);
    res.status(500).json({ error: "Failed to fetch application" });
  }
};
