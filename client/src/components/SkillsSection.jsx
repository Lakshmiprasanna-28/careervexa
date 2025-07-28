import React from "react";

export default function SkillsSection({ value, onChange }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">🧠 Skills (comma separated)</h3>
      <input
        type="text"
        placeholder="e.g. JavaScript, React, Node.js"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
}
