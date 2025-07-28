import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./hooks/useAuth";
import { SocketProvider } from "./context/SocketContext";
import ChatProvider from "./context/ChatProvider"; 
import "react-toastify/dist/ReactToastify.css";

// 🌍 Pages and Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Jobs from "./pages/Jobs";
import Companies from "./pages/Companies";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import CareerResources from "./components/CareerResources";
import JobDetail from "./pages/jobs/JobDetails";
import FeaturedJobs from "./components/FeaturedJobs";
import Job1 from "./pages/jobs/Job1";
import Job2 from "./pages/jobs/Job2";
import Job3 from "./pages/jobs/Job3";
import LoggedInHome from "./pages/LoggedInHome";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import JobSeekerProfile from "./pages/JobSeekerProfile";
import RecruiterProfile from "./pages/RecruiterProfile";
import AdminProfile from "./pages/AdminProfile";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import JobSeekerProfileEdit from "./pages/JobSeekerProfileEdit";
import RecruiterProfileEdit from "./pages/RecruiterProfileEdit";
import AdminProfileEdit from "./pages/AdminProfileEdit";
import PostJob from "./pages/jobs/PostJob";
import EditJob from "./pages/jobs/EditJob";
import JobList from "./pages/jobs/JobList";
import ApplyForm from "./pages/jobs/ApplyForm";
import ApplicantsPage from "./pages/ApplicantsPage";
import Applicants from "./pages/jobs/Applicants";
import InterviewPrep from "./pages/resources/InterviewPrep";
import ResumeTips from "./pages/resources/ResumeTips";
import TopTechSkills from "./pages/resources/TopTechSkills";
import MyApplications from "./pages/MyApplications";
import ResumeManager from "./pages/ResumeManager";
import ScheduleInterviews from "./pages/ScheduleInterviews";
import HiringTracker from "./pages/HiringTracker";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import Careers from "./pages/Careers";
import Sitemap from "./pages/Sitemap";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminReports from "./pages/admin/AdminReports";
import AdminModeration from "./pages/admin/AdminModeration";
import AdminActivity from "./pages/admin/AdminActivity";
import AdminEditJob from "./pages/admin/AdminEditJob";
import PublicProfile from "./pages/PublicProfile";

function ProtectedRoute({ element, allowedRoles }) {
  const { auth, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-gray-500">Loading profile...</div>;
  if (!auth) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(auth.role)) return <Navigate to="/home" replace />;
  if (auth?.isBlocked) return <div className="p-10 text-center text-red-500">⛔ Your account is blocked by admin.</div>;
  return element;
}

export default function App() {
  return (
    <>
      <SocketProvider>
        <ChatProvider>
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/career-resources" element={<CareerResources />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/featured-jobs" element={<FeaturedJobs />} />
            <Route path="/featured-jobs/1" element={<Job1 />} />
            <Route path="/featured-jobs/2" element={<Job2 />} />
            <Route path="/featured-jobs/3" element={<Job3 />} />
            <Route path="/resources/interview" element={<InterviewPrep />} />
            <Route path="/resources/resume" element={<ResumeTips />} />
            <Route path="/resources/tech-skills" element={<TopTechSkills />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/support" element={<Support />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/sitemap" element={<Sitemap />} />

            {/* 🔒 Protected Routes */}
            <Route path="/home" element={<LoggedInHome />} />
            <Route path="/jobseeker-dashboard" element={<ProtectedRoute element={<JobSeekerDashboard />} allowedRoles={["seeker"]} />} />
            <Route path="/recruiter-dashboard" element={<ProtectedRoute element={<RecruiterDashboard />} allowedRoles={["employer"]} />} />
            <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />} />
            <Route path="/jobseeker-profile" element={<ProtectedRoute element={<JobSeekerProfile />} allowedRoles={["seeker"]} />} />
            <Route path="/recruiter-profile" element={<ProtectedRoute element={<RecruiterProfile />} allowedRoles={["employer"]} />} />
            <Route path="/admin-profile" element={<ProtectedRoute element={<AdminProfile />} allowedRoles={["admin"]} />} />
            <Route path="/profile/edit/jobseeker" element={<ProtectedRoute element={<JobSeekerProfileEdit />} allowedRoles={["seeker"]} />} />
            <Route path="/profile/edit/recruiter" element={<ProtectedRoute element={<RecruiterProfileEdit />} allowedRoles={["employer"]} />} />
            <Route path="/profile/edit/admin" element={<ProtectedRoute element={<AdminProfileEdit />} allowedRoles={["admin"]} />} />
            <Route path="/messages/:threadId?" element={<ProtectedRoute element={<Messages />} allowedRoles={["seeker", "employer", "admin"]} />} />
            <Route path="/notifications" element={<ProtectedRoute element={<Notifications />} allowedRoles={["seeker", "employer", "admin"]} />} />
            <Route path="/settings" element={<ProtectedRoute element={<Settings />} allowedRoles={["seeker", "employer", "admin"]} />} />
            <Route path="/jobs/post" element={<ProtectedRoute element={<PostJob />} allowedRoles={["employer"]} />} />
            <Route path="/jobs/edit/:id" element={<ProtectedRoute element={<EditJob />} allowedRoles={["employer"]} />} />
            <Route path="/jobs/my-posts" element={<ProtectedRoute element={<JobList />} allowedRoles={["employer"]} />} />
            <Route path="/jobs/apply/:id" element={<ProtectedRoute element={<ApplyForm />} allowedRoles={["seeker"]} />} />
            <Route path="/jobs/:jobId/applicants" element={<ProtectedRoute element={<Applicants />} allowedRoles={["employer"]} />} />
            <Route path="/applicants" element={<ProtectedRoute element={<ApplicantsPage />} allowedRoles={["employer"]} />} />
            <Route path="/schedule-interviews" element={<ProtectedRoute element={<ScheduleInterviews />} allowedRoles={["employer"]} />} />
            <Route path="/track-hiring" element={<ProtectedRoute element={<HiringTracker />} allowedRoles={["employer"]} />} />
            <Route path="/applications" element={<ProtectedRoute element={<MyApplications />} allowedRoles={["seeker"]} />} />
            <Route path="/dashboard/applications" element={<ProtectedRoute element={<MyApplications />} allowedRoles={["seeker"]} />} />
            <Route path="/resume" element={<ProtectedRoute element={<ResumeManager />} allowedRoles={["seeker"]} />} />
            <Route path="/admin/applicants" element={<ProtectedRoute element={<ApplicantsPage />} allowedRoles={["admin"]} />} />
            <Route path="/admin/users" element={<ProtectedRoute element={<AdminUsers />} allowedRoles={["admin"]} />} />
            <Route path="/admin/jobs" element={<ProtectedRoute element={<AdminJobs />} allowedRoles={["admin"]} />} />
            <Route path="/admin/jobs/edit/:id" element={<ProtectedRoute element={<AdminEditJob />} allowedRoles={["admin"]} />} />
            <Route path="/admin/reports" element={<ProtectedRoute element={<AdminReports />} allowedRoles={["admin"]} />} />
            <Route path="/admin/analytics" element={<ProtectedRoute element={<AdminReports />} allowedRoles={["admin"]} />} />
            <Route path="/admin/moderation" element={<ProtectedRoute element={<AdminModeration />} allowedRoles={["admin"]} />} />
            <Route path="/admin/activity" element={<ProtectedRoute element={<AdminActivity />} allowedRoles={["admin"]} />} />
            <Route path="/job/:id" element={<ProtectedRoute element={<JobDetail />} allowedRoles={["seeker", "employer", "admin"]} />} />
            <Route path="/profile/:id" element={<ProtectedRoute element={<PublicProfile />} allowedRoles={["seeker", "employer", "admin"]} />} />
            <Route path="/applicants/:jobId" element={<ProtectedRoute element={<Applicants />} allowedRoles={["employer", "admin"]} />} />
          </Routes>
        </ChatProvider>
      </SocketProvider>

      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
    </>
  );
}
