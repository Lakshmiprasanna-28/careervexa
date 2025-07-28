// 📁 client/src/components/messages/TypingIndicator.jsx
import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 mt-2 ml-2">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  );
}
