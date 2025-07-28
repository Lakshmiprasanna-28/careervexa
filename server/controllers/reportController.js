import Report from "../models/reportModel.js";

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};
