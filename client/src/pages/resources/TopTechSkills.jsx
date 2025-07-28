// src/pages/resources/TopTechSkills.jsx
export default function TopTechSkills() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-6 py-10">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-6">
          💡 Top Tech Skills in 2025
        </h1>
        <p className="text-lg mb-6">
          Stay ahead of the curve by mastering these high-demand tech skills:
        </p>
        <ul className="list-disc list-inside space-y-4 text-base leading-relaxed">
          <li><strong>🤖 Artificial Intelligence:</strong> ML, Deep Learning, and prompt engineering.</li>
          <li><strong>☁️ Cloud Computing:</strong> AWS, Azure, GCP, and DevOps practices.</li>
          <li><strong>🧱 Fullstack Development:</strong> React, Node.js, Next.js, MongoDB.</li>
          <li><strong>🔐 Cybersecurity:</strong> Ethical hacking, threat modeling, and cloud security.</li>
          <li><strong>📊 Data Engineering:</strong> SQL, Spark, ETL pipelines, and data lakes.</li>
        </ul>
        <div className="mt-10 p-6 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
          <p className="text-xl font-semibold mb-1">🧠 Stay Curious:</p>
          <p>
            Tech evolves fast — keep learning with platforms like{" "}
            <a href="https://coursera.org" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-300 underline">Coursera</a>,{" "}
            <a href="https://udemy.com" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-300 underline">Udemy</a>, and{" "}
            <a href="https://roadmap.sh" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-300 underline">Roadmap.sh</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
