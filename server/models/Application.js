// === server/models/Application.js ===
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: String,
    resumeName: String,
    resumePublicId: String,
    message: String,
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["In Process", "Selected", "Rejected"], // ✅ match controller
      default: "In Process",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
