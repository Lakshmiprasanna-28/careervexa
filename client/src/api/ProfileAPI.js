// client/src/api/ProfileAPI.js
import axios from "axios";

// ✅ Upload resume
export const uploadResume = async (file) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("resume", file);

  const res = await axios.post("/api/upload/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  // Return path instead of url to match backend
  return { path: res.data.path };
};

// ✅ Generic profile update
export const updateProfile = async (role, formData) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(`/api/profile/update/${role}`, formData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return res.data;
};
