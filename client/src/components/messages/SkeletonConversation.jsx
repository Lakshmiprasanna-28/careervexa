// 📁 client/src/components/messages/SkeletonConversation.jsx
import React from "react";

export default function SkeletonConversation() {
  return (
    <div className="p-3 border-b animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-3/4" />
    </div>
  );
}
