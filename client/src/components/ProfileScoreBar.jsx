import { useAuth } from "../hooks/useAuth";

export default function ProfileScoreBar({ score: externalScore }) {
  const { auth } = useAuth();

  const calculateCompletion = () => {
    if (!auth) return 0;
    const fields = [
      "name", "email", "education", "experience", "skills", "projects", "social", "resume"
    ];
    const filled = fields.filter((field) => {
      const val = auth[field];
      return Array.isArray(val)
        ? val.length > 0
        : typeof val === "object"
        ? Object.values(val || {}).some((v) => v)
        : !!val;
    });
    return Math.round((filled.length / fields.length) * 100);
  };

  const score = externalScore ?? calculateCompletion();

  return (
    <div className="my-4">
      <p className="font-semibold text-sm mb-1 text-gray-700 dark:text-white">
        Profile Completion: {score}%
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
