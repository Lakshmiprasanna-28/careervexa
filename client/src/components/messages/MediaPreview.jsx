// 📁 client/src/components/messages/MediaPreview.jsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function MediaPreview({ file, onRemove }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const tempUrl = URL.createObjectURL(file);
    setUrl(tempUrl);
    return () => URL.revokeObjectURL(tempUrl);
  }, [file]);

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const isPdf = file.type === "application/pdf";

  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700">
      {/* Preview */}
      <div className="relative w-24 h-24 flex-shrink-0">
        {isImage ? (
          <img
            src={url}
            alt="preview"
            className="w-full h-full object-cover rounded-lg shadow"
          />
        ) : isVideo ? (
          <video
            src={url}
            className="w-full h-full rounded-lg shadow object-cover"
            controls
          />
        ) : isPdf ? (
          <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-600 font-semibold text-sm rounded-lg">
            PDF
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm rounded-lg">
            {file.name.split(".").pop().toUpperCase()}
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 text-sm text-gray-800 dark:text-gray-200">
        <div className="font-medium truncate max-w-[150px]">{file.name}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {(file.size / 1024).toFixed(1)} KB
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition"
        title="Remove file"
      >
        <X size={16} />
      </button>
    </div>
  );
}
