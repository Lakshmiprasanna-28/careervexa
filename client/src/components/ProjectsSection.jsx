import React from "react";

export default function ProjectsSection({ formData, setFormData }) {
  const handleChange = (index, field, value) => {
    const updated = [...formData.projects];
    updated[index][field] = value;
    setFormData({ ...formData, projects: updated });
  };

  const handleAdd = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { title: "", description: "" }],
    });
  };

  const handleRemove = (index) => {
    const updated = [...formData.projects];
    updated.splice(index, 1);
    setFormData({ ...formData, projects: updated });
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">🚀 Projects</h3>
      {formData.projects.map((proj, index) => (
        <div key={index} className="mb-3 space-y-1 border p-3 rounded bg-gray-50 dark:bg-gray-700">
          <input
            type="text"
            placeholder="Project Title"
            value={proj.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
          />
          <textarea
            placeholder="Description"
            value={proj.description}
            onChange={(e) => handleChange(index, "description", e.target.value)}
            rows={3}
            className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="text-sm text-red-500 mt-1 underline"
          >
            Delete
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAdd} className="text-blue-600 text-sm underline">
        + Add Project
      </button>
    </div>
  );
}
