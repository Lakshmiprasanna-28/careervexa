import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    // Basic email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      setSuccess(false);
      return setMessage("❌ Please enter a valid email address.");
    }

    // Simulate success
    setMessage("✅ You're now subscribed!");
    setSuccess(true);
    setEmail("");

    // Optionally: add API call here
  };

  return (
    <section className="py-16 px-4 bg-blue-600 dark:bg-gray-800 text-white text-center">
      <h2 className="text-3xl font-bold mb-2">📩 Stay Updated</h2>
      <p className="mb-6 text-white/90 dark:text-white/80">
        Join our newsletter to get the latest job alerts and career tips straight to your inbox.
      </p>

      <form
        onSubmit={handleSubscribe}
        className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full md:w-auto px-4 py-2 rounded-md border-none text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        <button
          type="submit"
          className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          Subscribe
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-sm font-medium ${
            success ? "text-green-200" : "text-yellow-200"
          }`}
        >
          {message}
        </p>
      )}
    </section>
  );
}
