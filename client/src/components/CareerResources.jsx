import { Link } from "react-router-dom";

export default function CareerResources() {
  const resources = [
    {
      title: "How to Prepare for Interviews",
      path: "interview",
      description:
        "Master behavioral, technical, and HR rounds with confidence. Learn how to answer tricky questions and leave a strong impression.",
    },
    {
      title: "Resume Tips",
      path: "resume",
      description:
        "Craft standout resumes with clean formatting, strong verbs, and keywords that make recruiters stop scrolling.",
    },
    {
      title: "Top Tech Skills in 2025",
      path: "tech-skills",
      description:
        "Explore the hottest skills in AI, ML, Cybersecurity, and Full Stack Dev to stay ahead of the curve.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900 text-center">
      <h2 className="text-4xl font-bold mb-12 text-gray-800 dark:text-white">
        📚 Career Resources
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {resources.map((res, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 text-left rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition duration-300 ease-in-out hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              {res.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {res.description}
            </p>
            <Link
              to={`/resources/${res.path}`}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
