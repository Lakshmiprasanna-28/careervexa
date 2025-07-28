import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

export default function ApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/applications/${id}`);
        setApplication(res.data);
      } catch (err) {
        console.error("Error loading application", err);
      }
    };

    fetchData();
  }, [id]);

  if (!application) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Application Details</h2>
      <p><strong>Applicant:</strong> {application.user?.name}</p>
      <p><strong>Job:</strong> {application.job?.title}</p>
      <p><strong>Status:</strong> {application.status}</p>
      {/* Add more details as needed */}
    </div>
  );
}
