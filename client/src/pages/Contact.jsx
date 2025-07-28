// ✅ Contact.jsx (updated and upgraded)
export default function Contact() {
  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 px-6 py-20 text-gray-800 dark:text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">📬 Contact Us</h1>
        <p className="mb-4 text-lg">We'd love to hear from you! Reach out for support, feedback, or partnerships.</p>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <p className="mb-2">📧 <strong>Email:</strong> <a href="mailto:support@careervexa.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@careervexa.com</a></p>
          <p>📞 <strong>Phone:</strong> <span className="text-blue-600 dark:text-blue-400">+91-1234567890</span></p>
        </div>
      </div>
    </section>
  );
}
