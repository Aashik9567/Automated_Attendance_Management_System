import React, { useState } from "react";
import {
  FaUserGraduate,
  FaHome,
  FaCalendarAlt,
  FaStar,
  FaClipboardCheck,
  FaTimes,
  FaBars,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import store from "../../../zustand/loginStore";
import axios from "axios";
import { message } from 'antd';
import {motion }from "framer-motion";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loginUserData,logoutUser } = store(state => state);

  const changeTab = (tabName, path) => {
    setActiveTab(tabName);
    setIsSidebarOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response= await axios.post('http://localhost:8080/api/v1/users/logout',{},{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }});
      message.success(response.data.message);
      logoutUser();
      
    } catch (error) {
      message.error(error.message);
    }
  }


  const getActiveTab = (path) => {
    if (path === "/studentdashboard") return "Home";
    const segment = path.split("/").pop();
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const [activeTab, setActiveTab] = useState(getActiveTab(location.pathname));

  const navItems = [
    { name: "Home", path: "/studentdashboard", icon: <FaHome className="w-6 h-6" /> },
    { name: "Calendar", path: "/studentdashboard/calendar", icon: <FaCalendarAlt className="w-6 h-6" /> },
    { name: "Assignments", path: "/studentdashboard/assignments", icon: <FaUserGraduate className="w-6 h-6" /> },
    { name: "Holidays", path: "/studentdashboard/holidays", icon: <FaStar className="w-6 h-6" /> },
    { name: "Attendance", path: "/studentdashboard/attendance", icon: <FaClipboardCheck className="w-6 h-6" /> },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
  className={`bg-gradient-to-br from-indigo-600 to-purple-500 text-white w-64 fixed h-full z-20 transition-all duration-300 ease-in-out flex flex-col shadow-2xl ${
    isSidebarOpen ? "left-0" : "-left-64"
  } md:left-0 backdrop-blur-lg bg-opacity-90`}
>
  <div className="flex-grow">
    <div className="flex items-center justify-between p-4 md:hidden">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-2xl font-bold tracking-wider"
      >
        🎓 EduSync
      </motion.div>
      <button onClick={toggleSidebar} className="text-white transition-colors hover:text-purple-200">
        <FaTimes size={24} />
      </button>
    </div>
    
    <motion.div 
      className="px-6 py-8 border-b border-white/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10">
          <span className="text-xl font-bold">👩🎓</span>
        </div>
        <div>
          <h1 className="text-xl font-semibold">{loginUserData.fullName}</h1>
          <p className="text-sm text-purple-100/80">Student Account</p>
        </div>
      </div>
    </motion.div>

    <nav className="px-4 mt-6 space-y-2">
      {navItems.map((item) => (
        <motion.button
          key={item.name}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => changeTab(item.name, item.path)}
          className={`flex items-center w-full p-3 rounded-xl transition-all
            ${
              activeTab === item.name 
                ? "bg-white/20 backdrop-blur-sm shadow-lg"
                : "hover:bg-white/10"
            }`}
        >
          {React.cloneElement(item.icon, { className: "w-5 h-5 text-purple-100" })}
          <span className="ml-3 font-medium tracking-wide">{item.name}</span>
        </motion.button>
      ))}
    </nav>
  </div>

  <motion.div 
    className="p-4 border-t border-white/10"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <button 
      onClick={handleLogout}
      className="flex items-center justify-between w-full p-3 transition-all rounded-lg bg-white/5 hover:bg-white/10 group"
    >
      <div className="flex items-center">
        <FaSignOutAlt className="mr-3 text-purple-100" />
        <span className="font-medium">Log Out</span>
      </div>
      <FaChevronRight className="text-sm text-purple-100 transition-transform group-hover:translate-x-1" />
    </button>
  </motion.div>
</aside>

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
        <header className="p-4 shadow-md bg-stone-300 md:hidden">
          <button onClick={toggleSidebar} className="text-gray-800">
            <FaBars size={24} />
          </button>
        </header>
        <motion.header 
        className="px-4 py-10 m-1 text-gray-700 shadow-2xl bg-gradient-to-r from-blue-400 to-indigo-400 sm:px-6 rounded-2xl"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
     <h2 className="mb-2 text-4xl font-bold">{activeTab}</h2>
     <p className={`text-gray-700 ${activeTab === "Home" ? "" : "hidden"}`}>Manage your classroom with ease</p>
      </motion.header>
        <div className="p-1 p-q">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;