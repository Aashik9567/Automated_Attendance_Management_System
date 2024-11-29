import React, { useState } from "react";
import {
  FaUserGraduate,
  FaHome,
  FaCalendarAlt,
  FaStar,
  FaClipboardCheck,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import store from "../../../zustand/loginStore";

const StudentDashboard = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loginUserData } = store((state) => state);
  const changeTab = (tabName, path) => {
    setActiveTab(tabName);
    setIsSidebarOpen(false);
    navigate(path);
  };
  const handleLogout = () => {
    console.log("Logout");
  };
  const getActiveTab = (path) => {
    if (path === "/studentdashboard") return "Home";
    const segment = path.split("/").pop();
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const [activeTab, setActiveTab] = useState(getActiveTab(location.pathname));
  const navItems = [
    {
      name: "Home",
      path: "/studentdashboard",
      icon: <FaHome className="w-6 h-6" />,
    },
    {
      name: "Calendar",
      path: "/studentdashboard/calendar",
      icon: <FaCalendarAlt className="w-6 h-6" />,
    },
    {
      name: "Course",
      path: "/studentdashboard/course",
      icon: <FaUserGraduate className="w-6 h-6" />,
    },
    {
      name: "Holidays",
      path: "/studentdashboard/holidays",
      icon: <FaStar className="w-6 h-6" />,
    },
    {
      name: "Attendance",
      path: "/studentdashboard/attendance",
      icon: <FaClipboardCheck className="w-6 h-6" />,
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-stone-300">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-r from-indigo-400 to-purple-400 text-white w-64 fixed h-full z-20 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "left-0" : "-left-64"
        } md:left-0`}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button onClick={toggleSidebar} className="text-white">
            <FaTimes size={24} />
          </button>
        </div>
        <div className="p-6">
          <h1 className="mb-2 text-3xl font-bold">Student Dashboard</h1>
          <p className="text-sm text-blue-200">
            Welcome back, {loginUserData.name}!
          </p>
        </div>
        <nav className="mt-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => changeTab(item.name, item.path)}
              className={`flex items-center w-full p-4 transition
                ${
                  activeTab ===
                  item.name.charAt(0).toUpperCase() +
                    item.name.slice(1).toLowerCase()
                    ? "bg-blue-700 border-l-4 border-white"
                    : "hover:bg-blue-700 hover:border-l-4 hover:border-white"
                }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} >
            <div className="flex items-center justify-between p-4 mb-4 transition hover:bg-blue-500 hover:border-l-4 hover:border-white hover:rounded-lg">
              <div className="flex items-center">
                <FaSignOutAlt className="mr-3" />
                <span>Log Out</span>
              </div>
              <FaChevronRight />
            </div>
          </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
        <header className="p-4 shadow-md bg-stone-300 md:hidden">
          <button onClick={toggleSidebar} className="text-gray-800">
            <FaBars size={24} />
          </button>
        </header>
        <div className="p-2 pt-3">
          <div className="p-6 mb-2 text-white rounded-lg shadow-lg m bg-gradient-to-r from-blue-500 to-purple-600">
            <h2 className="mb-2 text-4xl font-bold">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p
              className={`text-blue-100 ${
                activeTab === "Home" ? "" : "hidden"
              }`}
            >
              Manage your classroom with ease
            </p>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
