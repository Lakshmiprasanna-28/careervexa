// client/src/pages/ResetPassword.jsx
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [used, setUsed] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async ({ password, confirmPassword }) => {
    if (used) return toast.error("⚠️ This reset link has already been used.");
    if (password !== confirmPassword) return toast.error("❌ Passwords do not match");

    try {
      await axios.post(
        `/api/auth/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );
      setUsed(true);
      toast.success("✅ Password reset successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center">Reset Password</h2>

        <div>
          <label className="text-sm text-gray-700 dark:text-white">New Password</label>
          <input
            type="password"
            {...register("password", {
              required: "New password is required",
              minLength: { value: 8, message: "Min 8 characters" },
            })}
            className="w-full p-3 rounded border dark:bg-gray-700 dark:text-white"
          />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>

        <div>
          <label className="text-sm text-gray-700 dark:text-white">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm your password",
              validate: (val) => val === password || "Passwords do not match",
            })}
            className="w-full p-3 rounded border dark:bg-gray-700 dark:text-white"
          />
          <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Reset Password</button>
      </form>
    </section>
  );
}
