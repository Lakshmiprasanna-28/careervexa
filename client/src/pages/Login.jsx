import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // 🌐 Handle OAuth token & user from redirected URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userParam = params.get("user");

    if (token && userParam) {
      console.log("🔁 OAuth login data:", { token, user: userParam });

      try {
        const parsedUser = JSON.parse(userParam); // ✅ Fix: parse stringified JSON
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(parsedUser));

        (async () => {
          try {
            await login();
            toast.success("✅ OAuth login successful!");
            navigate("/home");

            // 🧹 Clean the URL
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          } catch {
            toast.error("❌ OAuth login failed");
          }
        })();
      } catch (err) {
        console.error("❌ Failed to parse user JSON:", err);
        toast.error("OAuth user parse failed");
      }
    }
  }, [location.search, login, navigate]);

  const onSubmit = async (data) => {
    console.log("📤 Submitting login form with data:", data);
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", data);
      const { token, user } = res.data;

      if (!token || !user) throw new Error("❌ Missing token or user");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      await login();
      toast.success("✅ Login Success!");
      navigate("/home");
    } catch (error) {
      const msg = error?.response?.data?.message || "Login failed";
      toast.error("❌ " + msg);
      console.error("❌ Login failed with error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-8 rounded-xl shadow-xl w-96 space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-4">Login</h2>

        {loading && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            ⏳ Logging in... please wait
          </p>
        )}

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            autoComplete="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email address",
              },
            })}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
            placeholder="Email"
          />
          <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
        </div>

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Min 8 characters" },
            })}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600"
            placeholder="Password"
          />
          <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>

          <div className="text-right mt-1">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center mt-2 text-sm">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 underline">Register</Link>
          </p>
        </div>

        <div className="border-t pt-4 text-center">
          <p className="text-gray-500 text-sm mb-2 dark:text-gray-400">Or login with</p>
          <div className="flex justify-center gap-4">
            <a
              href="http://localhost:5000/auth/google"
              className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600"
            >
              <FcGoogle className="text-xl" /> Google
            </a>
            <a
              href="http://localhost:5000/auth/github"
              className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600"
            >
              <FaGithub className="text-xl" /> GitHub
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
