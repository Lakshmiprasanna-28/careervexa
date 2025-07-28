import React, { useEffect, useState } from "react";
import ResumeUploader from "../components/ResumeUploader";
import { useAuth } from "../hooks/useAuth";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function ResumeManager() {
  const { auth, fetchUser } = useAuth();
  const [resumePath, setResumePath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const resume = auth?.resume;

    if (resume && typeof resume === "string" && resume !== "undefined" && resume.trim() !== "") {
      setResumePath(resume);
    } else {
      console.warn("⚠️ No valid resume found:", resume);
      setResumePath(null);
    }

    setLoading(false);
  }, [auth]);

  const handleResumeUpdate = async (uploadedPath) => {
    if (!uploadedPath || uploadedPath === "undefined") {
      toast.error("❌ Resume path is invalid");
      return;
    }

    try {
      setUploading(true);
      await api.put("/api/profile/update/jobseeker", { resume: uploadedPath });
      setResumePath(uploadedPath);
      toast.success("✅ Resume uploaded and saved!");
      await fetchUser();
    } catch (err) {
      console.error("❌ Resume update error:", err);
      toast.error("❌ Failed to update resume");
    } finally {
      setUploading(false);
    }
  };

  const isFullUrl = (url) =>
    url?.startsWith("http://") || url?.startsWith("https://");

  const previewURL =
    resumePath && resumePath !== "undefined" && !isFullUrl(resumePath)
      ? `${baseUrl}${resumePath.startsWith("/") ? "" : "/"}${resumePath}`
      : isFullUrl(resumePath)
      ? resumePath
      : "";

  const downloadFile = async () => {
    try {
      const response = await api.get(previewURL, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = resumePath?.split("/").pop() || "resume.pdf";
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("❌ Download failed:", err);
      toast.error("❌ Failed to download resume");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">
              📄 Resume Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Upload, view, and manage your professional resume here.
            </p>
          </div>

          <ResumeUploader onChange={handleResumeUpdate} />

          {uploading && (
            <div className="text-sm text-yellow-500">
              ⏳ Saving your resume to profile...
            </div>
          )}

          {loading ? (
            <p>Loading your resume...</p>
          ) : resumePath ? (
            <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Current Resume
              </h2>

              {previewURL ? (
                <div className="aspect-[4/3] border dark:border-gray-600 overflow-hidden rounded">
                  <iframe
                    src={previewURL}
                    title="Resume Preview"
                    width="100%"
                    height="600px"
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <p className="text-red-500">❌ Resume preview URL is invalid.</p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={downloadFile}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                >
                  ⬇️ Download
                </button>

                <a
                  href={previewURL}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔍 View Fullscreen
                </a>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No resume uploaded yet.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
