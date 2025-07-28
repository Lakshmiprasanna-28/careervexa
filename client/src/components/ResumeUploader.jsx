import { useState } from "react";
import { uploadResume } from "../api/ProfileAPI";

export default function ResumeUploader({ onChange }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await uploadResume(file);
      console.log("✅ Resume upload response:", res);

      if (res?.path && (res.path.startsWith("/") || res.path.startsWith("http"))) {
        const fullPath = res.path.startsWith("/")
          ? `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}${res.path}`
          : res.path;

        onChange(fullPath); // Pass the final URL
        setSuccess(true);
      } else {
        throw new Error("Invalid resume path returned");
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow rounded-xl p-6"
    >
      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
        Upload Resume (PDF only)
      </label>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3 block w-full text-sm text-gray-800 dark:text-gray-200"
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={!file || uploading}
          className={`px-4 py-2 text-sm rounded transition 
            ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>

        {success && <p className="text-green-600 text-sm">✅ Uploaded!</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </form>
  );
}
