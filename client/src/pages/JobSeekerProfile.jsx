import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import LoggedInNavbar from "../components/LoggedInNavbar";
import Footer from "../components/Footer";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function JobSeekerProfile() {
  const { auth } = useAuth();
  const location = useLocation();
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("updated") === "true") {
      toast.success("✅ Profile refreshed!");
    }
  }, [location]);

  const calculateCompletion = () => {
    if (!auth) return 0;
    const fields = [
      "name", "email", "phone", "location", "education", "experience",
      "skills", "projects", "social", "resume"
    ];
    const filled = fields.filter((field) => {
      const value = auth[field];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "object" && value !== null) return Object.values(value).some(Boolean);
      return Boolean(value);
    });
    return Math.round((filled.length / fields.length) * 100);
  };

  const completion = calculateCompletion();
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.name || "Jobseeker")}&background=0D8ABC&color=fff&size=128`;

  let resumePath = typeof auth?.resume === "string" ? auth.resume : null;
  if (resumePath?.startsWith("http://localhost:5173")) {
    resumePath = resumePath.replace("http://localhost:5173", "");
  }
  const filename = resumePath?.split("/").pop();
  const previewURL = filename ? `http://localhost:5000/uploads/${filename}` : null;
  const downloadURL = filename ? `http://localhost:5000/download/${filename}` : null;

  return (
    <>
      <LoggedInNavbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-10 flex justify-center">
        <section className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl border dark:border-gray-700 p-10 space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center border-b pb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">🎯 Resume</h1>
            <Link
              to="/profile/edit/jobseeker"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              ✏️ Edit Profile
            </Link>
          </header>

          {/* Avatar & Basic Info */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={defaultAvatar}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
            />
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold">{auth?.name || "Your Name"}</h2>
              <p className="text-sm">{auth?.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Role: {auth?.role}</p>
              <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">{auth?.phone}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{auth?.location}</p>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm md:text-base">
            <ProfileField
              title="🎓 Education"
              content={auth?.education?.map((e, idx) => (
                <p key={idx}>
                  {e.degree} in {e.course} ({e.year}) @ {e.institution || "N/A"}
                  {e.location ? `, ${e.location}` : ""}
                </p>
              ))}
            />

            <ProfileField
              title="💼 Experience"
              content={auth?.experience?.map((e, idx) => (
                <p key={idx}>
                  {e.title} @ {e.company} ({e.years})
                  {e.location ? `, ${e.location}` : ""}
                </p>
              ))}
            />

            <ProfileField
              title="🛠️ Skills"
              content={auth?.skills?.length > 0 ? auth.skills.join(", ") : "N/A"}
            />

            <ProfileField
              title="📂 Projects"
              content={auth?.projects?.map((p, idx) => (
                <div key={idx}>
                  <strong>{p.title}</strong>: {p.description}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline ml-2"
                    >
                      🔗 Link
                    </a>
                  )}
                </div>
              ))}
            />

            <ProfileField
              title="🔗 Social Links"
              content={auth?.social?.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline block"
                >
                  {s.platform}
                </a>
              ))}
            />
          </div>

          {/* Resume Section */}
          <div className="space-y-2">
            <h3 className="font-semibold mb-1 text-lg">📎 Resume</h3>
            {resumePath ? (
              <>
                <div className="flex gap-6 items-center">
                  <button
                    onClick={() => setShowResume(!showResume)}
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    {showResume ? "❌ Close Preview" : "🔍 View"}
                  </button>
                  <a
                    href={downloadURL}
                    className="text-green-600 dark:text-green-400 underline"
                  >
                    ⬇️ Download
                  </a>
                </div>
                {showResume && previewURL && (
                  <div className="mt-4 border dark:border-gray-600 rounded overflow-hidden">
                    <iframe
                      src={previewURL}
                      width="100%"
                      height="500px"
                      className="w-full"
                      title="Resume PDF Preview"
                    />
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No resume uploaded.</p>
            )}
          </div>

          {/* Profile Completion */}
          <div className="space-y-1">
            <h3 className="font-semibold text-md">📊 Profile Completion</h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{completion}% completed</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ProfileField({ title, content }) {
  return (
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      {Array.isArray(content) ? (
        content.length > 0 ? (
          <div className="flex flex-col gap-1">{content}</div>
        ) : (
          <p className="text-gray-400">N/A</p>
        )
      ) : (
        <p>{content || "N/A"}</p>
      )}
    </div>
  );
}
