import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "../../loginSignup/Login.jsx";
import SignUp from "../../loginSignup/SignUp.jsx";
import ProtectedRouter from "../../zustand/ProtectedRouter";

// Dashboards load on demand, so the public pages don't download them.
const page = (load) => lazy(load);
const AboutPage = page(() => import("./AboutPage"));
const StudentDashboard = page(() => import("../dashboardComponents/studentDashboardComponent/StudentDashboard"));
const StudentHomePage = page(() => import("../dashboardComponents/studentDashboardComponent/StudentHomePage.jsx"));
const StudentCalendar = page(() => import("../dashboardComponents/studentDashboardComponent/StudentCalendar.jsx"));
const StudentAssignmentViewer = page(() => import("../dashboardComponents/studentDashboardComponent/StudentAssignmentViewer.jsx"));
const StudentAttendance = page(() => import("../dashboardComponents/studentDashboardComponent/StudentAttendance.jsx"));
const Holiday = page(() => import("../dashboardComponents/studentDashboardComponent/Holiday.jsx"));
const TeacherDashboard = page(() => import("../dashboardComponents/teacherDashboardComponent/TeacherDashboard.jsx"));
const HomePage = page(() => import("../dashboardComponents/teacherDashboardComponent/HomePage"));
const AttendanceSheet = page(() => import("../dashboardComponents/teacherDashboardComponent/AttendanceSheet"));
const AssignmentManagement = page(() => import("../dashboardComponents/teacherDashboardComponent/AssignmentManagement"));
const AttendanceReport = page(() => import("../dashboardComponents/teacherDashboardComponent/AttendanceReport.jsx"));
const TeacherHolidayAnnouncement = page(() => import("../dashboardComponents/teacherDashboardComponent/TeacherHolidayAnnoucement.jsx"));
const Settings = page(() => import("../dashboardComponents/teacherDashboardComponent/Settings"));
const AdminDashboard = page(() => import("../dashboardComponents/adminDashboardComponent/AdminDashboard.jsx"));
const AdminSubjects = page(() => import("../dashboardComponents/adminDashboardComponent/AdminSubjects.jsx"));
const AdminAccounts = page(() => import("../dashboardComponents/adminDashboardComponent/AdminAccounts.jsx"));

const Webroutes = () => (
  <BrowserRouter future={{ v7_relativeSplatPath: true }}>
    {/* Blank canvas while a dashboard shell loads; pages inside load under the shell. */}
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<AboutPage />} />
        {/* Old link kept working. */}
        <Route path="/aboutus" element={<Navigate to="/about" replace />} />

        <Route
          path="/studentdashboard"
          element={
            <ProtectedRouter allowedRoles={["Student"]}>
              <StudentDashboard />
            </ProtectedRouter>
          }
        >
          <Route index element={<StudentHomePage />} />
          <Route path="calendar" element={<StudentCalendar />} />
          <Route path="assignments" element={<StudentAssignmentViewer />} />
          <Route path="Attendance" element={<StudentAttendance />} />
          <Route path="holidays" element={<Holiday />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route
          path="/teacherdashboard"
          element={
            <ProtectedRouter allowedRoles={["Teacher"]}>
              <TeacherDashboard />
            </ProtectedRouter>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="attendance" element={<AttendanceSheet />} />
          <Route path="assignment" element={<AssignmentManagement />} />
          <Route path="reports" element={<AttendanceReport />} />
          <Route path="settings" element={<Settings />} />
          <Route path="holiday-annoucement" element={<TeacherHolidayAnnouncement />} />
        </Route>

        <Route
          path="/admindashboard"
          element={
            <ProtectedRouter allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRouter>
          }
        >
          <Route index element={<AdminAccounts />} />
          <Route path="subjects" element={<AdminSubjects />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default Webroutes;
