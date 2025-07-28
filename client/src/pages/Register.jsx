// ✅ Register.jsx - updated for full dark/light mode
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/auth/register", data, {
        withCredentials: true
      });
      toast.success("✅ Registered successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed";
      toast.error("❌ " + message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-8 rounded-xl shadow-xl w-96 space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-4">
          Register
        </h2>

        <input
          {...register("name", {
            required: "Name is required",
            minLength: { value: 3, message: "At least 3 characters" },
          })}
          className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
          placeholder="Name"
        />
        <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>

        <input
          type="email"
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Invalid email",
            },
          })}
          className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
          placeholder="Email"
        />
        <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>

        <input
          type="password"
          autoComplete="new-password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
            pattern: {
              value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/,
              message: "Must contain letters, numbers & special characters",
            },
          })}
          className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
          placeholder="Password"
        />
        <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>

        <input
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
          placeholder="Confirm Password"
        />
        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword?.message}</p>

        <select
          {...register("role")}
          className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
        >
          <option value="seeker">Job Seeker</option>
          <option value="employer">Recruiter</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Register
        </button>

        <div className="text-center mt-2 text-sm">
          <p>
            Already have an account? <Link to="/login" className="text-blue-600 underline">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
