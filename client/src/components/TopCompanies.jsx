const companies = [
  { name: "Google", jobs: 23, rating: "4.8" },
  { name: "Amazon", jobs: 17, rating: "4.6" },
  { name: "Netflix", jobs: 12, rating: "4.7" },
];

export default function TopCompanies() {
  return (
    <section className="py-16 text-center bg-white dark:bg-gray-900">
      <h2 className="text-3xl font-bold mb-10 text-gray-800 dark:text-white">
        🏢 Top Companies Hiring
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {companies.map((company, index) => (
          <div
            key={index}
            className="w-72 rounded-xl p-6 bg-white dark:bg-gray-800 text-left shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
              {company.name}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              {company.jobs} open jobs
            </p>

            <p className="text-sm text-yellow-500 font-medium">
              ⭐ {company.rating} / 5.0
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
