// client/src/components/HeroSearch.jsx
export default function HeroSearch() {
  return (
    <section className="bg-blue-50 dark:bg-gray-800 py-20 px-4 text-center transition-all duration-300">
      <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-blue-800 dark:text-white">
        🎯 Find Your Dream Job Faster
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
        Search thousands of jobs from top companies across the globe
      </p>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-4xl mx-auto w-full px-2"
      >
        <input
          type="text"
          placeholder="🔍 Job title or keyword"
          aria-label="Job title or keyword"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="text"
          placeholder="📍 Location"
          aria-label="Location"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition duration-200 shadow-md"
        >
          Search
        </button>
      </form>
    </section>
  );
}
