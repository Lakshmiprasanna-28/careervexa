// ✅ Companies.jsx (updated and upgraded)
export default function Companies() {
  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-20 text-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🏢 Explore Companies</h1>
        <p className="text-center text-lg mb-8">
          Research company culture, ratings, and job openings from top global brands and startups.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {["Google", "Microsoft", "Amazon", "Infosys", "TCS", "Netflix"].map((name, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-xl mb-2">{name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">⭐ 4.{8 - (i % 3)} rating · {10 + i * 3} jobs</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}