import React, { useState } from 'react';
import { FaChalkboardTeacher, FaUserGraduate, FaBook, FaChartBar, FaCog, FaBars, FaTimes, FaSignOutAlt, FaChevronRight } from 'react-icons/fa';
import store from '../../../zustand/loginStore';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import {motion } from "framer-motion";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loginUserData,logoutUser } = store(state => state);
  // Determine active tab from current path
  const getActiveTab = (path) => {
    if (path === '/teacherdashboard') return 'Home';
    const segment = path.split('/').pop();
    return segment.charAt(0).toUpperCase() + segment.slice(1);
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

  const [activeTab, setActiveTab] = useState(getActiveTab(location.pathname));

  const changeTab = (tabName, path) => {
    setActiveTab(tabName);
    setIsSidebarOpen(false);
    navigate(path);
  };

  const navItems = [
    { name: 'Home', icon: FaChalkboardTeacher, path: '/teacherdashboard' },
    { name: 'Attendance', icon: FaUserGraduate, path: '/teacherdashboard/attendance' },
    { name: 'Assignment', icon: FaBook, path: '/teacherdashboard/assignment' },
    { name: 'Reports', icon: FaChartBar, path: '/teacherdashboard/reports' },
    { name: 'Settings', icon: FaCog, path: '/teacherdashboard/settings' },
  ];
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className={`bg-gradient-to-br from-blue-600 to-teal-500 text-white w-64 fixed h-full z-20 transition-all duration-300 ease-in-out flex flex-col shadow-2xl ${isSidebarOpen ? 'left-0' : '-left-64'} md:left-0 backdrop-blur-lg bg-opacity-90`}>
  <div className="flex-grow">
    <div className="flex items-center justify-between p-4 md:hidden">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-2xl font-bold tracking-wider"
      >
        👩🏫 EduPro
      </motion.div>
      <button onClick={toggleSidebar} className="text-white transition-colors hover:text-blue-200">
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
          <span className="text-xl font-bold">👨🏫</span>
        </div>
        <div>
          <h1 className="text-xl font-semibold">Mr. {loginUserData.fullName}</h1>
          <p className="text-sm text-blue-100/80">Educator Profile</p>
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
          <item.icon className="w-5 h-5 mr-3 text-blue-100" />
          <span className="font-medium tracking-wide">{item.name}</span>
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
        <FaSignOutAlt className="mr-3 text-blue-100" />
        <span className="font-medium">Log Out</span>
      </div>
      <FaChevronRight className="text-sm text-blue-100 transition-transform group-hover:translate-x-1" />
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
          <div className="p-1">
            <motion.header 
                    className="px-4 py-10 m-1 text-gray-700 shadow-2xl bg-gradient-to-r from-blue-400 to-indigo-400 sm:px-6 rounded-2xl"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                  >
                 <h2 className="mb-1 text-4xl font-bold">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className={`text-orange-100 ${activeTab === 'Home' ? '' : 'hidden'}`}>Manage your classroom with ease Mr. {loginUserData.fullName}</p>
              </motion.header>
            <Outlet context={{ changeTab }} />
          </div>
        </main>

      </div>

    </>
  );
};

export default TeacherDashboard;