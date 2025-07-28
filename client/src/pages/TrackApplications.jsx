import React, { useEffect, useState } from "react";
import axios from "axios";

const TrackApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("/api/applications/mine");
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📊 Track Applications</h1>
      {applications.map((app) => (
        <div
          key={app._id}
          className="mb-4 p-4 border rounded-lg shadow bg-white"
        >
          <p>
            <strong>Job:</strong> {app.jobTitle} @ {app.companyName}
          </p>
          <p>
            <strong>Message:</strong> {app.message}
          </p>
          <p>
            <strong>Resume:</strong>{" "}
            {app.resumeUrl ? (
              <>
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>{" "}
                |{" "}
                <a
                  href={app.resumeUrl}
                  download={app.resumeFilename || "resume.pdf"}
                  className="text-green-600 underline"
                >
                  Download
                </a>
              </>
            ) : (
              "Not uploaded"
            )}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TrackApplications;
