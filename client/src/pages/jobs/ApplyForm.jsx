import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useParams, useNavigate } from "react-router-dom";

export default function ApplyForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: jobId } = useParams();

  const [job, setJob] = useState(location.state?.job || null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [resumePreviewURL, setResumePreviewURL] = useState("");
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [jobError, setJobError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchJob = async () => {
      if (!job && jobId) {
        try {
          const res = await axios.get(`/api/jobs/${jobId}`);
          setJob(res.data);
        } catch {
          setJobError("Could not load job details.");
        }
      } else if (!jobId) {
        setJobError("Missing job ID.");
      }
    };

    fetchJob();
  }, [job, jobId]);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
        toast.error("Only PDF/DOC/DOCX files are allowed.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit.");
        return;
      }

      setResume(file);
      setResumePreviewURL(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!job?._id) {
      toast.error("Invalid job. Please refresh and try again.");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    if (!resume) {
      toast.error("Please upload your resume.");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", job._id);
    formData.append("message", message);
    formData.append("resume", resume);

    try {
      setLoading(true);
      setUploadProgress(0);
      const token = localStorage.getItem("token");

      const res = await axios.post("/api/applications", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percent);
        },
      });

      if (res.data.duplicate) {
        toast.warn("⚠️ You already applied.");
        setAlreadyApplied(true);
      } else {
        toast.success("🎉 Application submitted!");
        setAlreadyApplied(false);
        setMessage("");
        setResume(null);
        setResumePreviewURL("");
        document.getElementById("resumeInput").value = "";
        setTimeout(() => navigate(`/jobs/${job._id}`), 2000);
      }
    } catch (err) {
      console.error("🚨 Application submission failed:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (jobError) return <div className="p-6 text-red-600">{jobError}</div>;
  if (!job) return null;

  return (
    <section className="min-h-screen px-6 py-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">
          Apply for: {job.title} at {job.company}
        </h2>

        <form
          onSubmit={onSubmit}
          className="space-y-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow"
        >
          <div>
            <label className="block mb-1 font-semibold">Why should we hire you?</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              className="w-full p-3 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              Upload Resume (PDF/DOC/DOCX only, max 10MB)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              id="resumeInput"
              required
              className="dark:bg-gray-900 dark:text-white"
            />
            {resume && (
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                📎 {resume.name}
                <button
                  type="button"
                  onClick={() => setShowResumeModal(true)}
                  className="ml-2 text-blue-600 dark:text-blue-400 underline"
                >
                  Preview
                </button>
              </div>
            )}
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded overflow-hidden">
              <div
                className="bg-blue-500 h-2 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-2 rounded text-white font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Submitting..."
              : alreadyApplied
              ? "Send Another Application"
              : "Apply Now"}
          </button>
        </form>

        {showResumeModal && resumePreviewURL && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-4xl w-full shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">📄 Resume Preview</h3>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="text-red-500 text-xl font-bold"
                >
                  ✕
                </button>
              </div>
              <iframe
                title="Resume Preview"
                src={resumePreviewURL}
                className="w-full h-[500px] border rounded"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
