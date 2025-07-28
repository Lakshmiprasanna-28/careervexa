// client/src/pages/ForgotPassword.jsx
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/auth/forgot-password", data);
      toast.success("📩 Reset email sent! Check your inbox.");
      setSubmitted(true);
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send reset email");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">Forgot Password</h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          Enter your registered email and we’ll send you a reset link.
        </p>

        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          placeholder="your@email.com"
          className="w-full p-3 border rounded dark:bg-gray-700 text-gray-900 dark:text-white"
          disabled={isSubmitting}
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>

        {submitted && (
          <p className="text-green-600 dark:text-green-400 text-center text-sm mt-2">
            ✅ Reset link sent. Check your inbox!
          </p>
        )}
      </form>
    </section>
  );
}
