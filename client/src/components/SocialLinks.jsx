import React from "react";

export default function SocialLinks({ formData, setFormData }) {
  const handleChange = (platform, value) => {
    const updated = { ...formData.social, [platform]: value };
    setFormData({ ...formData, social: updated });
  };

  const handleAdd = () => {
    const platform = prompt("Enter platform name:");
    if (platform && !formData.social[platform]) {
      const updated = { ...formData.social, [platform]: "" };
      setFormData({ ...formData, social: updated });
    }
  };

  const handleRemove = (platform) => {
    const updated = { ...formData.social };
    delete updated[platform];
    setFormData({ ...formData, social: updated });
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">🔗 Social Links</h3>
      {Object.entries(formData.social).length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No social links added.</p>
      ) : (
        Object.entries(formData.social).map(([platform, url], index) => (
          <div key={index} className="mb-3 flex gap-2 items-center">
            <input
              type="text"
              value={platform}
              disabled
              className="w-1/3 p-2 rounded border dark:bg-gray-800 dark:text-white"
            />
            <input
              type="text"
              placeholder="URL"
              value={url}
              onChange={(e) => handleChange(platform, e.target.value)}
              className="w-2/3 p-2 rounded border dark:bg-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => handleRemove(platform)}
              className="text-sm text-red-500 underline"
            >
              Delete
            </button>
          </div>
        ))
      )}
      <button
        type="button"
        onClick={handleAdd}
        className="text-blue-600 text-sm underline"
      >
        + Add Social Link
      </button>
    </div>
  );
}
