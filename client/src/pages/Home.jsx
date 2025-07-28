import Navbar from "../components/Navbar";
import HeroSearch from "../components/HeroSearch";
import Categories from "../components/Categories";
import FeaturedJobs from "../components/FeaturedJobs";
import TopCompanies from "../components/TopCompanies";
import CareerResources from "../components/CareerResources";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";

export default function Home() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-12 flex-grow">
        <HeroSearch />
        <Categories />
        <FeaturedJobs />
        <TopCompanies />
        <CareerResources />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
