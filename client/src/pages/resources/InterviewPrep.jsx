// src/pages/resources/InterviewPrep.jsx
export default function InterviewPrep() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-6 py-10">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-6">
          🎤 How to Prepare for Interviews
        </h1>
        <p className="text-lg mb-6">
          Acing interviews is about confidence, preparation, and communication. Here's your roadmap:
        </p>
        <ul className="list-disc list-inside space-y-4 text-base leading-relaxed">
          <li><strong>📚 Research the Company:</strong> Know their mission, values, and recent news.</li>
          <li><strong>💬 Practice Behavioral Questions:</strong> Use the STAR method (Situation, Task, Action, Result).</li>
          <li><strong>🧠 Prepare Technical Rounds:</strong> LeetCode, HackerRank, and mock interviews help a ton.</li>
          <li><strong>👥 HR Round:</strong> Be honest, culturally aware, and enthusiastic.</li>
          <li>
            <strong>💻 Mock Interviews:</strong> Try platforms like{" "}
            <a href="https://pramp.com" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-300 underline">Pramp</a> and{" "}
            <a href="https://interviewing.io" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-300 underline">Interviewing.io</a>.
          </li>
        </ul>
        <div className="mt-10 p-6 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
          <p className="text-xl font-semibold mb-1">🎯 Final Tip:</p>
          <p>
            Confidence comes from preparation. Believe in your story and communicate clearly. You got this!
          </p>
        </div>
      </section>
    </main>
  );
}
