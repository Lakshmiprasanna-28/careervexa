import { cloudinary } from "../config/cloudinary.js"; // ✅ Make sure this file exports a configured Cloudinary instance
import multer from "multer";
import { Readable } from "stream";

// 🧠 Memory storage so we can get file buffer instead of saving to disk
const storage = multer.memoryStorage();
export const upload = multer({ storage });

/**
 * 📤 Uploads file buffer to Cloudinary via stream
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} fileName - File name to use as Cloudinary public_id
 * @param {string} folder - Folder in Cloudinary to store file
 * @param {string} resourceType - "auto" | "image" | "video" | "raw"
 * @returns {Promise<{ url: string, publicId: string }>} Cloudinary result
 */
export const uploadToCloudinary = async (
  fileBuffer,
  fileName,
  folder = "uploads",
  resourceType = "auto"
) => {
  try {
    const cleanName = fileName.replace(/\.[^/.]+$/, ""); // remove extension

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder,
          public_id: cleanName,
        },
        (err, result) => {
          if (err) {
            console.error("❌ Cloudinary Upload Error:", err);
            return reject(err);
          }
          resolve(result);
        }
      );

      const readable = new Readable();
      readable._read = () => {}; // noop
      readable.push(fileBuffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (err) {
    console.error("❌ Cloudinary upload failed:", err.message);
    return null;
  }
};
