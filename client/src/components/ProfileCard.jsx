import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const ProfileCard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border dark:border-gray-700 mb-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt="User Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {user?.name || "Unnamed User"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {user?.email}
          </p>
          <div className="mt-3 flex gap-3 flex-wrap">
            {user?.resume && (
              <a
                href={`https://docs.google.com/viewer?url=${window.location.origin}${user.resume}&embedded=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                📄 View Resume
              </a>
            )}
            {user?.videoIntro && (
              <a
                href={user.videoIntro}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline text-sm"
              >
                🎥 Watch Video Intro
              </a>
            )}
            <Link
              to={`/profile/edit/${user?.role || "jobseeker"}`}
              className="text-sm text-blue-600 hover:underline"
            >
              ✏️ Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
