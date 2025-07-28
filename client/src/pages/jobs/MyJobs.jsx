import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/jobs/my-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    };
    fetchJobs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">🗂️ My Posted Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs posted yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job._id} className="bg-white p-5 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.company} - {job.location}</p>
              <p className="text-gray-500 text-sm mt-1">{job.description.slice(0, 100)}...</p>
              {/* Add View/Edit/Applicants buttons here if needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
