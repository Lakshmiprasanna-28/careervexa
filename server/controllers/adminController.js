import User from "../models/User.js";
import JobPost from "../models/JobPost.js";
import Report from "../models/Report.js";
import ActivityLog from "../models/ActivityLog.js";

// ✅ Reusable logger
export const logAdminActivity = async (message) => {
  try {
    await ActivityLog.create({ message });
  } catch (err) {
    console.error("❌ Failed to log admin activity:", err.message);
  }
};

// 👥 USER MANAGEMENT
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    await logAdminActivity(`🛑 ${user.email} was ${user.isBlocked ? "blocked" : "unblocked"}`);
    res.status(200).json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}` });
  } catch (err) {
    res.status(500).json({ message: "Server error while updating block status" });
  }
};

export const promoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      user.role = user.previousRole || "jobseeker";
      user.previousRole = "";
      await logAdminActivity(`🔻 ${user.email} was demoted from admin`);
    } else {
      user.previousRole = user.role;
      user.role = "admin";
      await logAdminActivity(`🔺 ${user.email} was promoted to admin`);
    }

    await user.save();
    res.status(200).json({ message: "User role updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error while promoting/demoting user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot delete another admin" });

    await User.findByIdAndDelete(req.params.id);
    await logAdminActivity(`🗑️ ${user.email} was deleted by Admin`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting user" });
  }
};

// 💼 JOB MANAGEMENT
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching jobs" });
  }
};

export const getSingleJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job" });
  }
};

export const updateJobAsAdmin = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const { title, companyName, location, salary, description } = req.body;

    job.title = title || job.title;
    job.companyName = companyName || job.companyName;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.description = description || job.description;

    await job.save();
    await logAdminActivity(`🛠️ Job "${job.title}" was updated by Admin`);

    res.status(200).json({ message: "Job updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error while updating job" });
  }
};

// 🚩 REPORTS & LOGS
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching reports" });
  }
};

export const seedReports = async (req, res) => {
  try {
    await Report.deleteMany();
    const seedData = [
      { reportedBy: "user123", reason: "Scam Job" },
      { reportedBy: "user456", reason: "Fake Company Profile" },
      { reportedBy: "recruiter1", reason: "Harassment Complaint" },
      { reportedBy: "seeker99", reason: "Misleading Salary Info" },
      { reportedBy: "admin123", reason: "Terms Violation" },
    ];
    const created = await Report.insertMany(seedData);
    await logAdminActivity("📊 Seeded sample reports for analytics testing");
    res.status(201).json({ message: "Reports seeded", data: created });
  } catch (err) {
    res.status(500).json({ message: "Error seeding reports" });
  }
};

export const getAdminActivity = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(50);
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching activity logs" });
  }
};

// ✅ NEW: Clear Activity Logs
export const clearAdminActivity = async (req, res) => {
  try {
    await ActivityLog.deleteMany({});
    await logAdminActivity("🧹 Admin cleared all activity logs");
    res.status(200).json({ message: "Activity logs cleared" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing activity logs" });
  }
};
