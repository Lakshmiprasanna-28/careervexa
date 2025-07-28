// ✅ Blog.jsx (updated and upgraded)
export default function Blog() {
  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 px-6 py-20 text-gray-800 dark:text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">📝 Career Blog</h1>
        <p className="text-center text-lg mb-6">
          Get expert tips on how to stand out, build your tech stack, and stay ahead of career trends.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">🔥 10 Resume Mistakes to Avoid</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avoid the most common resume pitfalls and land more interviews with smarter formatting and better wording.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">💻 Best Tech Skills to Learn in 2025</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI, Cloud, DevOps, Cybersecurity — find out what's hot and how to skill up fast.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
