// client/src/components/Categories.jsx

export default function Categories() {
  const categories = [
    "💻 Development",
    "🎨 Design",
    "📈 Marketing",
    "💰 Finance",
    "🏠 Remote",
    "🧠 Data Science",
    "🛍️ Sales",
    "🧑‍💼 HR & Operations",
  ];

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900 text-center transition-all duration-300">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 text-gray-800 dark:text-white">
        🏷️ Popular Categories
      </h2>

      <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
        {categories.map((cat) => (
          <span
            key={cat}
            className="px-5 py-2 bg-blue-100 dark:bg-gray-700 text-blue-800 dark:text-white rounded-full text-sm sm:text-base font-medium hover:bg-blue-200 dark:hover:bg-gray-600 transition duration-200 shadow-sm cursor-pointer"
          >
            {cat}
          </span>
        ))}
      </div>
    </section>
  );
}
