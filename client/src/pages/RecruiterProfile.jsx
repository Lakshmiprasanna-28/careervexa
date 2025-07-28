// ✅ client/src/pages/RecruiterProfile.jsx
import { useAuth } from "../hooks/useAuth";
import LoggedInNavbar from "../components/LoggedInNavbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function RecruiterProfile() {
  const { auth } = useAuth();

  const calculateCompletion = () => {
    if (!auth) return 0;
    const fields = ["name", "email", "phone", "location", "company", "position", "social"];
    const filled = fields.filter((field) => {
      const value = auth[field];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "object" && value !== null) return Object.values(value).some(Boolean);
      return Boolean(value);
    });
    return Math.round((filled.length / fields.length) * 100);
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    auth?.name || "Recruiter"
  )}&background=0D8ABC&color=fff&size=128`;

  const completion = calculateCompletion();

  return (
    <>
      <LoggedInNavbar />
      <div className="min-h-screen px-6 py-10 bg-white dark:bg-gray-950 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow border dark:border-gray-700">
          <div className="flex justify-between items-center border-b pb-4">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              🧑‍💼 Recruiter Profile
            </h1>
            <Link
              to="/profile/edit/recruiter"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              ✏️ Edit Profile
            </Link>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center gap-6">
            <img
              src={defaultAvatar}
              alt="Recruiter Avatar"
              className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{auth?.name || "Your Name"}</h2>
              <p>{auth?.email}</p>
              <p className="text-sm text-gray-400 mt-1">Role: {auth?.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField title="📱 Phone" content={auth?.phone} />
            <ProfileField title="📍 Location" content={auth?.location} />
            <ProfileField title="🏢 Company" content={auth?.company} />
            <ProfileField title="🧑‍💼 Position" content={auth?.position} />
            <ProfileField
              title="🔗 Social Links"
              content={auth?.social?.map((s) => `${s.platform}: ${s.url}`).join(", ")}
            />
          </div>

          <div>
            <h3 className="text-md font-medium mb-2">📊 Profile Completion</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">{completion}% completed</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function ProfileField({ title, content }) {
  return (
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm">{content || "N/A"}</p>
    </div>
  );
}