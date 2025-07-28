import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function AdminProfileEdit() {
  const { auth, fetchUser } = useAuth();
  const navigate = useNavigate();

  const initialState = {
    name: auth?.name || "",
    email: auth?.email || "",
    phone: auth?.phone || "",
    designation: auth?.designation || "",
    linkedin: auth?.linkedin || "",
    location: auth?.location || "",
    bio: auth?.bio || "",
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/api/user/update-profile", formData); // ✅ PUT instead of POST
      toast.success("✅ Profile updated!");
      await fetchUser();
      navigate("/admin-profile");
    } catch (error) {
      console.error("❌ Update failed", error.response?.data || error.message);
      toast.error("Update failed. Try again.");
    }
  };

  const handleReset = () => {
    setFormData(initialState);
  };

  const fields = [
    { label: "Full Name", name: "name", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Designation", name: "designation", type: "text" },
    { label: "LinkedIn URL", name: "linkedin", type: "url" },
    { label: "Location", name: "location", type: "text" },
  ];

  return (
    <Layout>
      <section className="min-h-screen px-6 py-10 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
            ✏️ Edit Admin Profile
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700"
          >
            {fields.map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700 dark:text-white"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm mb-1">Bio</label>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                💾 Save Changes
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
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
