import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";

export default function RecruiterProfileEdit() {
  const { auth, updateAuth } = useAuth();
  const navigate = useNavigate();

  const initialState = {
    name: auth?.name || "",
    email: auth?.email || "",
    phone: auth?.phone || "",
    location: auth?.location || "",
    company: auth?.company || "",
    position: auth?.position || "",
    social: auth?.social?.length ? auth.social : [{ platform: "", url: "" }],
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNestedChange = (index, key, value) => {
    const updated = [...formData.social];
    updated[index][key] = value;
    setFormData((prev) => ({ ...prev, social: updated }));
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      social: [...prev.social, { platform: "", url: "" }],
    }));
  };

  const deleteSocialLink = (index) => {
    const updated = [...formData.social];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, social: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/profile/update/recruiter",
        formData,
        { withCredentials: true }
      );
      toast.success("✅ Profile updated successfully!");
      updateAuth(res.data.user);
      navigate("/recruiter-profile");
    } catch (err) {
      console.error("❌ Update failed", err);
      toast.error("⚠️ Update failed. Try again.");
    }
  };

  const handleReset = () => setFormData(initialState);

  return (
    <Layout>
      <section className="min-h-screen px-6 py-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8">
            ✏️ Edit Recruiter Profile
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow border dark:border-gray-700"
          >
            {["name", "email", "phone", "location", "company", "position"].map((field) => (
              <div key={field}>
                <label className="block mb-1 text-sm font-medium capitalize">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 dark:text-white"
                />
              </div>
            ))}

            <div>
              <label className="text-lg font-semibold block mb-2">Social Links</label>
              {formData.social.map((s, index) => (
                <div key={index} className="grid grid-cols-2 gap-3 mb-2">
                  <input
                    type="text"
                    placeholder="Platform (e.g., LinkedIn)"
                    value={s.platform}
                    onChange={(e) => handleNestedChange(index, "platform", e.target.value)}
                    className="p-2 rounded bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={s.url}
                    onChange={(e) => handleNestedChange(index, "url", e.target.value)}
                    className="p-2 rounded bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => deleteSocialLink(index)}
                    className="text-blue-500 mt-2 col-span-2"
                  >
                    ❌ Delete
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSocialLink}
                className="text-sm text-blue-600 dark:text-blue-400 underline"
              >
                ➕ Add Social Link
              </button>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                💾 Save Changes
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md"
              >
                🔁 Reset
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
