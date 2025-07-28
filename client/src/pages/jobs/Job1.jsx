import { Link } from "react-router-dom";
import { Briefcase, MapPin, IndianRupee, ListChecks } from "lucide-react";

export default function Job1() {
  return (
    <section className="py-12 px-4 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <Link
          to="/"
          className="text-blue-600 dark:text-blue-400 text-sm mb-4 inline-block hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-blue-700 dark:text-blue-400 flex items-center gap-2">
          <Briefcase className="w-6 h-6" /> Frontend Developer
        </h1>

        <p className="mb-4 text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <span className="font-medium">TechCorp</span>
          <span className="text-sm text-gray-400 dark:text-gray-500">|</span>
          <MapPin className="w-4 h-4" />
          <span>Bangalore, India</span>
        </p>

        <p className="mb-4 leading-relaxed">
          We're looking for a talented Frontend Developer proficient in React.js, TailwindCSS, and modern UI/UX principles. You'll collaborate with designers and backend developers to build scalable products.
        </p>

        <div className="mb-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <ListChecks className="w-5 h-5" /> Requirements
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>3+ years experience in frontend development</li>
            <li>Proficient in React.js and JavaScript ES6+</li>
            <li>Experience with RESTful APIs</li>
          </ul>
        </div>

        <div className="flex items-center gap-2 font-medium">
          <IndianRupee className="w-5 h-5 text-green-600" />
          <span>Salary: ₹10 - 15 LPA</span>
        </div>
      </div>
    </section>
  );
}

