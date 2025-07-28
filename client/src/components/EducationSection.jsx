import React from "react";

export default function EducationSection({ formData, setFormData }) {
  const handleChange = (index, field, value) => {
    const updated = [...formData.education];
    updated[index][field] = value;
    setFormData({ ...formData, education: updated });
  };

  const handleAdd = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: "", institution: "", year: "" }],
    });
  };

  const handleRemove = (index) => {
    const updated = [...formData.education];
    updated.splice(index, 1);
    setFormData({ ...formData, education: updated });
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">🎓 Education</h3>
      {formData.education.map((edu, index) => (
        <div key={index} className="mb-3 space-y-1 border p-3 rounded bg-gray-50 dark:bg-gray-700">
          <input
            type="text"
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) => handleChange(index, "degree", e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            placeholder="Institution"
            value={edu.institution}
            onChange={(e) => handleChange(index, "institution", e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            placeholder="Year"
            value={edu.year}
            onChange={(e) => handleChange(index, "year", e.target.value)}
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
        + Add Education
      </button>
    </div>
  );
}
