// ✅ server/models/JobPost.js
import mongoose from "mongoose";

const jobPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "",
    },
    salary: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    requirements: {
      type: [String],
      default: [], // e.g., ["HTML", "React", "Node.js"]
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// ✅ Fix OverwriteModelError in dev (hot-reloading)
const JobPost = mongoose.models.JobPost || mongoose.model("JobPost", jobPostSchema);

export default JobPost;
