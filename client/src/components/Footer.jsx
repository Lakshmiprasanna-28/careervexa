import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const links = [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "FAQ", href: "/faq" },
    { label: "Support", href: "/support" },
    { label: "Careers", href: "/careers" },
    { label: "Sitemap", href: "/sitemap" },
  ];

  return (
    <footer className="bg-blue-600 dark:bg-gray-900 text-white dark:text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="hover:underline hover:text-blue-200 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-xs text-white dark:text-gray-500 text-center">
          &copy; {new Date().getFullYear()} <span className="font-semibold">Careervexa</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
