// 📁 client/src/components/messages/EmojiPicker.jsx
import React, { useState, useRef, useEffect } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function EmojiPicker({ value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  const handleSelect = (emoji) => {
    onChange(value + emoji.native);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="relative" ref={pickerRef}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setShowPicker((prev) => !prev)}
        className="text-2xl px-2 hover:scale-110 transition-transform"
      >
        😀
      </button>

      {/* Emoji Picker Overlay */}
      {showPicker && (
        <div className="absolute bottom-12 left-0 z-50 shadow-lg bg-white rounded-lg dark:bg-gray-900">
          <Picker
            data={data}
            onEmojiSelect={handleSelect}
            theme={document.documentElement.classList.contains("dark") ? "dark" : "light"}
            previewPosition="none"
            maxFrequentRows={2}
          />
        </div>
      )}
    </div>
  );
}
