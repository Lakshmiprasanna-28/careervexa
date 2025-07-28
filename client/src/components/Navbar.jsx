import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-blue-600 dark:bg-gray-800 text-white shadow backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          💼 Careervexa
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/jobs" className="hover:text-blue-200 dark:hover:text-blue-300">Jobs</Link>
          <Link to="/companies" className="hover:text-blue-200 dark:hover:text-blue-300">Companies</Link>
          <Link to="/about" className="hover:text-blue-200 dark:hover:text-blue-300">About</Link>
          <Link to="/contact" className="hover:text-blue-200 dark:hover:text-blue-300">Contact</Link>
          <Link to="/blog" className="hover:text-blue-200 dark:hover:text-blue-300">Blog</Link>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title="Toggle Dark Mode"
            className="text-xl hover:text-yellow-200 dark:hover:text-blue-400 transition"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {/* Auth Buttons - Desktop Only */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm border border-white rounded hover:bg-blue-500 dark:hover:bg-gray-700 transition"
            >
              🔐 Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 text-sm bg-white text-blue-600 rounded hover:bg-gray-100 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 transition"
            >
              📝 Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-600 dark:bg-gray-900 px-4 pb-4 transition-all duration-300 ease-in-out">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-200">Jobs</Link>
            <Link to="/companies" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-200">Companies</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-200">About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-200">Contact</Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-200">Blog</Link>

            <hr className="my-2 border-blue-400 dark:border-gray-700" />

            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-100"
            >
              🔐 Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-100"
            >
              📝 Sign Up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
