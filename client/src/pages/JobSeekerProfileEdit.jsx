import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";
import ResumeUploader from "../components/ResumeUploader";

export default function JobSeekerProfileEdit() {
  const { auth, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (auth) {
      setFormData({
        name: auth.name || "",
        email: auth.email || "",
        phone: auth.phone || "",
        location: auth.location || "",
        education: Array.isArray(auth.education)
          ? auth.education.map((edu) => ({
              degree: edu.degree || "",
              course: edu.course || "",
              year: edu.year || "",
              institution: edu.institution || "",
              location: edu.location || "",
            }))
          : [{ degree: "", course: "", year: "", institution: "", location: "" }],
        experience: Array.isArray(auth.experience)
          ? auth.experience.map((exp) => ({
              title: exp.title || "",
              company: exp.company || "",
              years: exp.years || "",
              location: exp.location || "",
            }))
          : [{ title: "", company: "", years: "", location: "" }],
        skills: Array.isArray(auth.skills) ? auth.skills : [""],
        projects: Array.isArray(auth.projects)
          ? auth.projects.map((p) => ({
              title: p.title || "",
              description: p.description || "",
              link: p.link || "",
            }))
          : [{ title: "", description: "", link: "" }],
        social: Array.isArray(auth.social)
          ? auth.social.map((s) => ({
              platform: s.platform || "",
              url: s.url || "",
            }))
          : [{ platform: "", url: "" }],
        resume: auth.resume || "",
      });
    }
  }, [auth]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleNestedChange = (field, index, key, value) => {
    const updated = [...formData[field]];
    updated[index][key] = value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleArrayChange = (index, value) => {
    const updated = [...formData.skills];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, skills: updated }));
  };

  const addField = (field, structure) =>
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], structure] }));

  const deleteField = (field, index) => {
    const updated = [...formData[field]];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/profile/update/jobseeker", formData, {
        withCredentials: true,
      });
      toast.success("✅ Profile updated successfully!");
      await fetchUser();
      navigate("/jobseeker-profile?updated=true");
    } catch (err) {
      console.error("❌ Update failed", err);
      toast.error("⚠️ Update failed. Try again.");
    }
  };

  const handleReset = () => {
    if (!auth) return;
    setFormData({
      name: auth.name || "",
      email: auth.email || "",
      phone: auth.phone || "",
      location: auth.location || "",
      education: Array.isArray(auth.education)
        ? auth.education.map((edu) => ({
            degree: edu.degree || "",
            course: edu.course || "",
            year: edu.year || "",
            institution: edu.institution || "",
            location: edu.location || "",
          }))
        : [{ degree: "", course: "", year: "", institution: "", location: "" }],
      experience: Array.isArray(auth.experience)
        ? auth.experience.map((exp) => ({
            title: exp.title || "",
            company: exp.company || "",
            years: exp.years || "",
            location: exp.location || "",
          }))
        : [{ title: "", company: "", years: "", location: "" }],
      skills: Array.isArray(auth.skills) ? auth.skills : [""],
      projects: Array.isArray(auth.projects)
        ? auth.projects.map((p) => ({
            title: p.title || "",
            description: p.description || "",
            link: p.link || "",
          }))
        : [{ title: "", description: "", link: "" }],
      social: Array.isArray(auth.social)
        ? auth.social.map((s) => ({
            platform: s.platform || "",
            url: s.url || "",
          }))
        : [{ platform: "", url: "" }],
      resume: auth.resume || "",
    });
  };

  if (!formData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-white">
          <p>⏳ Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="min-h-screen px-6 py-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8">
            ✏️ Edit Job Seeker Profile
          </h1>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">📎 Resume (PDF)</label>
            <ResumeUploader
              value={formData.resume}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, resume: url }))
              }
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow border dark:border-gray-700"
          >
            {["name", "email", "phone", "location"].map((field) => (
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

            <Section
              title="🎓 Education"
              field="education"
              formData={formData}
              handleNestedChange={handleNestedChange}
              deleteField={deleteField}
              addField={addField}
              inputs={[
                { key: "degree", placeholder: "Degree" },
                { key: "course", placeholder: "Course" },
                { key: "year", placeholder: "Year" },
                { key: "institution", placeholder: "Institution/College Name" },
                { key: "location", placeholder: "Institution Location" },
              ]}
            />

            <Section
              title="💼 Experience"
              field="experience"
              formData={formData}
              handleNestedChange={handleNestedChange}
              deleteField={deleteField}
              addField={addField}
              inputs={[
                { key: "title", placeholder: "Title" },
                { key: "company", placeholder: "Company" },
                { key: "years", placeholder: "Years" },
                { key: "location", placeholder: "Company Location" },
              ]}
            />

            <div>
              <label className="text-lg font-semibold block mb-2">🛠️ Skills</label>
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-3 mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange(index, e.target.value)}
                    placeholder="Skill"
                    className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 dark:text-white"
                  />
                  <button type="button" onClick={() => deleteField("skills", index)} className="text-red-500">
                    ❌
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("skills", "")}
                className="text-sm text-blue-600 dark:text-blue-400 underline"
              >
                ➕ Add Skill
              </button>
            </div>

            <Section
              title="📂 Projects"
              field="projects"
              formData={formData}
              handleNestedChange={handleNestedChange}
              deleteField={deleteField}
              addField={addField}
              inputs={[
                { key: "title", placeholder: "Title" },
                { key: "description", placeholder: "Description" },
                { key: "link", placeholder: "Link" },
              ]}
            />

            <Section
              title="🔗 Social Links"
              field="social"
              formData={formData}
              handleNestedChange={handleNestedChange}
              deleteField={deleteField}
              addField={addField}
              inputs={[
                { key: "platform", placeholder: "Platform" },
                { key: "url", placeholder: "URL" },
              ]}
            />

            <div className="flex gap-4 pt-4">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                💾 Save
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

function Section({ title, field, formData, handleNestedChange, deleteField, addField, inputs }) {
  return (
    <div>
      <label className="text-lg font-semibold block mb-2">{title}</label>
      {formData[field].map((item, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
          {inputs.map((input) => (
            <input
              key={input.key}
              type="text"
              placeholder={input.placeholder}
              value={item[input.key] || ""}
              onChange={(e) => handleNestedChange(field, index, input.key, e.target.value)}
              className="p-2 rounded bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 dark:text-white"
            />
          ))}
          <button
            type="button"
            onClick={() => deleteField(field, index)}
            className="text-red-500 mt-2 md:col-span-3"
          >
            ❌ Delete
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addField(field, inputs.reduce((acc, i) => ({ ...acc, [i.key]: "" }), {}))}
        className="text-sm text-blue-600 dark:text-blue-400 underline"
      >
        ➕ Add
      </button>
    </div>
  );
}
