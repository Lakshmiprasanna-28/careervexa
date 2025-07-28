import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define absolute path to uploads folder
const uploadDir = path.join(__dirname, "../uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter: allow only PDFs
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDFs are allowed"), false);
    }
    cb(null, true);
  },
});

// Upload route
router.post("/resume", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // In deployment (e.g., Render), use the domain from request
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const publicPath = `/uploads/${req.file.filename}`;
  const fullUrl = `${baseUrl}${publicPath}`;

  res.status(200).json({ path: publicPath, url: fullUrl });
});

export default router;
