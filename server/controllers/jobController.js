// === server/controllers/jobController.js ===
import JobPost from "../models/JobPost.js"; // ✅ Match the casing

// CREATE a job post
export const createJob = async (req, res) => {
  try {
    const job = new JobPost({
      ...req.body,
      postedBy: req.user._id,
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while creating job." });
  }
};

// GET all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch jobs." });
  }
};

// GET single job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id).populate("postedBy", "name email");
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch job." });
  }
};

// ✅ Employer's own jobs
export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find({ postedBy: req.user._id });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your jobs." });
  }
};

// ✅ ADMIN get all jobs
export const adminGetAllJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Admin job fetch failed:", err);
    res.status(500).json({ message: "Failed to load all jobs." });
  }
};

// ✅ ADMIN delete job
export const adminDeleteJob = async (req, res) => {
  try {
    const job = await JobPost.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json({ message: "Job deleted successfully." });
  } catch (err) {
    console.error("Admin delete job error:", err);
    res.status(500).json({ message: "Failed to delete job." });
  }
};

// UPDATE job
export const updateJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to edit this job." });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update job." });
  }
};

// DELETE job (by recruiter)
export const deleteJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to delete this job." });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete job." });
  }
};
