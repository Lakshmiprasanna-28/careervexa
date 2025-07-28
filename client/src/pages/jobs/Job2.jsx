import { Link } from "react-router-dom";
import { Briefcase, MapPin, IndianRupee, ListChecks } from "lucide-react";

export default function Job2() {
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
          <Briefcase className="w-6 h-6" /> UI/UX Designer
        </h1>

        <p className="mb-4 text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <span className="font-medium">Designify</span>
          <span className="text-sm text-gray-400 dark:text-gray-500">|</span>
          <MapPin className="w-4 h-4" />
          <span>Remote</span>
        </p>

        <p className="mb-4 leading-relaxed">
          Designify is seeking a creative UI/UX designer with a strong portfolio. You'll design user-friendly interfaces for web and mobile applications using Figma or Adobe XD.
        </p>

        <div className="mb-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <ListChecks className="w-5 h-5" /> Requirements
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Strong portfolio of design projects</li>
            <li>Proficiency in Figma, Adobe XD</li>
            <li>Good understanding of responsive design</li>
          </ul>
        </div>

        <div className="flex items-center gap-2 font-medium">
          <IndianRupee className="w-5 h-5 text-green-600" />
          <span>Salary: ₹8 - 12 LPA</span>
        </div>
      </div>
    </section>
  );
}
