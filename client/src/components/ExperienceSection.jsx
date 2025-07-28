import React from "react";

export default function ExperienceSection({ formData, setFormData }) {
  const handleChange = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData({ ...formData, experience: updated });
  };

  const handleAdd = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { title: "", company: "", years: "" }],
    });
  };

  const handleRemove = (index) => {
    const updated = [...formData.experience];
    updated.splice(index, 1);
    setFormData({ ...formData, experience: updated });
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">💼 Experience</h3>
      {formData.experience.map((exp, index) => (
        <div key={index} className="mb-3 space-y-1 border p-3 rounded bg-gray-50 dark:bg-gray-700">
          <input
            type="text"
            placeholder="Title"
            value={exp.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            placeholder="Company"
            value={exp.company}
            onChange={(e) => handleChange(index, "company", e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            placeholder="Years"
            value={exp.years}
            onChange={(e) => handleChange(index, "years", e.target.value)}
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
        + Add Experience
      </button>
    </div>
  );
}
