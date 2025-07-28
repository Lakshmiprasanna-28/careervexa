import { useAuth } from "../hooks/useAuth";
import LoggedInNavbar from "../components/LoggedInNavbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function AdminProfile() {
  const { auth } = useAuth();

  if (!auth) {
    return (
      <>
        <LoggedInNavbar />
        <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-950">
          <p>Loading profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  const calculateCompletion = () => {
    const fields = ["name", "email", "phone", "designation", "linkedin", "location", "bio"];
    const filled = fields.filter((field) => auth[field]);
    return Math.round((filled.length / fields.length) * 100);
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    auth.name || "Admin"
  )}&background=0D8ABC&color=fff&size=128`;

  const completion = calculateCompletion();

  return (
    <>
      <LoggedInNavbar />
      <div className="min-h-screen bg-white dark:bg-gray-950 px-6 py-10 text-gray-900 dark:text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center border-b pb-4">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">🛠️ Admin Profile</h1>
            <Link
              to="/profile/edit/admin"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              ✏️ Edit Profile
            </Link>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center gap-6">
            <img
              src={defaultAvatar}
              alt="Admin Avatar"
              className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{auth.name || "Admin Name"}</h2>
              <p>{auth.designation || "No designation added"}</p>
              <p className="text-sm text-gray-400 mt-1">Role: {auth.role}</p>
              {auth.updatedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {new Date(auth.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField title="📧 Email" content={auth.email} />
            <ProfileField title="📱 Phone" content={auth.phone} />
            <ProfileField title="📍 Location" content={auth.location} />
            <ProfileField
              title="🔗 LinkedIn"
              content={
                auth.linkedin && auth.linkedin.startsWith("http") ? (
                  <a
                    href={auth.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    {auth.linkedin}
                  </a>
                ) : (
                  "N/A"
                )
              }
            />
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-1">🧾 Bio</h3>
              <p className="text-sm">{auth.bio || "No bio added yet."}</p>
            </div>
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
