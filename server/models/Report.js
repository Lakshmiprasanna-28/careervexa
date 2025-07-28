// === models/Report.js ===
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model("Report", reportSchema); // ✅ Always singular
export default Report;
