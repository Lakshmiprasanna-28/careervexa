// === utils/logActivity.js ===
import ActivityLog from "../models/ActivityLog.js";

export const logAdminActivity = async (message) => {
  try {
    await ActivityLog.create({ message });
  } catch (err) {
    console.error("Failed to log admin activity:", err.message);
  }
};
