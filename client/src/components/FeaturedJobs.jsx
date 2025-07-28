import { Link } from "react-router-dom";
import { Briefcase, MapPin, IndianRupee } from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Bangalore, India",
    salary: "₹10 - 15 LPA",
    path: "/featured-jobs/1",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Designify",
    location: "Remote",
    salary: "₹8 - 12 LPA",
    path: "/featured-jobs/2",
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "CodeHub",
    location: "Hyderabad, India",
    salary: "₹12 - 18 LPA",
    path: "/featured-jobs/3",
  },
];

export default function FeaturedJobs() {
  return (
    <section className="pt-16 pb-10 px-4 bg-gray-100 dark:bg-gray-900 text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-12 text-gray-800 dark:text-white">
        ⭐ Featured Job Openings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 place-items-center">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-gray-800 text-left dark:text-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 w-full max-w-xs border border-transparent hover:border-blue-300 dark:hover:border-blue-500"
          >
            <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-semibold">
              <Briefcase className="w-5 h-5" />
              <span>{job.title}</span>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
              {job.company}
            </p>

            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </p>

            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mb-3">
              <IndianRupee className="w-4 h-4" />
              {job.salary}
            </p>

            <Link
              to={job.path}
              className="inline-block mt-2 text-blue-600 dark:text-blue-300 text-sm font-medium hover:underline transition"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
