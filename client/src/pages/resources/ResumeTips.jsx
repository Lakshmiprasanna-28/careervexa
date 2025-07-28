// src/pages/resources/ResumeTips.jsx
export default function ResumeTips() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-6 py-10">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-6">
          📄 Resume Tips
        </h1>
        <p className="text-lg mb-6">
          Your resume is your personal brand pitch — make it sharp, clean, and impactful:
        </p>
        <ul className="list-disc list-inside space-y-4 text-base leading-relaxed">
          <li><strong>🎯 Tailor Every Resume:</strong> Match the job description with keywords.</li>
          <li><strong>🧾 Keep It Concise:</strong> 1-page for freshers, 2-pages max for experienced pros.</li>
          <li><strong>📊 Use Metrics:</strong> {"“Increased user retention by 35%”"} is better than {"“Handled user tasks”"}.</li>
          <li><strong>💼 Prioritize Skills:</strong> Add technical, soft, and leadership skills.</li>
          <li>
            <strong>📁 Design Matters:</strong> Use templates from{" "}
            <a href="https://novoresume.com" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-300 underline">NovoResume</a> or{" "}
            <a href="https://canva.com" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-300 underline">Canva</a>.
          </li>
        </ul>
        <div className="mt-10 p-6 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
          <p className="text-xl font-semibold mb-1">✅ Bonus:</p>
          <p>
            Always export your resume as PDF. Avoid typos, and get it reviewed by peers or mentors before sending.
          </p>
        </div>
      </section>
    </main>
  );
}
