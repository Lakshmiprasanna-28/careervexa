// === client/src/pages/PublicProfile.jsx ===
import React from "react";
import { useParams } from "react-router-dom";

export default function PublicProfile() {
  const { userId } = useParams();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Public Profile</h2>
      <p>This is the public profile for user ID: {userId}</p>

      {/* Later: fetch and display user's public profile details */}
    </div>
  );
}
