import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "./Navbar";
import LoggedInNavbar from "./LoggedInNavbar";
import Footer from "./Footer";
import ProfileSidebar from "./ProfileSidebar";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const { auth } = useAuth();

  const showSidebar =
    pathname.startsWith("/jobseeker") ||
    pathname.startsWith("/recruiter") ||
    pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black dark:text-white transition-colors duration-300">
      {auth ? <LoggedInNavbar /> : <Navbar />}
      <div className="flex flex-1 min-h-0">
        {showSidebar && auth && (
          <aside className="hidden lg:block w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <ProfileSidebar />
          </aside>
        )}
        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 lg:px-10 overflow-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
