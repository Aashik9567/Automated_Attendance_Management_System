import React, { useState } from 'react';
import { FaChalkboardTeacher, FaUserGraduate, FaBook, FaChartBar, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import store from '../../../zustand/loginStore';
import { Outlet,useNavigate,useLocation } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loginUserData } = store(state => state);
  // Determine active tab from current path
  const getActiveTab = (path) => {
    if (path === '/teacherdashboard') return 'Home';
    const segment = path.split('/').pop();
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const [activeTab, setActiveTab] = useState(getActiveTab(location.pathname));

  const changeTab = (tabName, path) => {
    setActiveTab(tabName);
    setIsSidebarOpen(false);
    navigate(path);
  };

  const navItems = [
    { name: 'Home', icon: FaChalkboardTeacher, path: '/teacherdashboard' },
    { name: 'Attendance', icon: FaUserGraduate, path: '/teacherdashboard/attendance' },
    { name: 'Courses', icon: FaBook, path: '/teacherdashboard/courses' },
    { name: 'Reports', icon: FaChartBar, path: '/teacherdashboard/reports' },
    { name: 'Settings', icon: FaCog, path: '/teacherdashboard/settings' },
  ];
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className={`
        bg-gradient-to-r from-green-500 to-emerald-400 text-white w-64 fixed h-full z-20 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'left-0' : '-left-64'}
        md:left-0
      `}>
          <div className="flex items-center justify-between p-4 md:hidden">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button onClick={toggleSidebar} className="text-white">
              <FaTimes size={24} />
            </button>
          </div>
          <div className="p-6">
            <h1 className="mb-2 text-3xl font-bold">Teacher Dashboard</h1>
            <p className="font-bold text-indigo-700 text-md">Welcome back!</p>
            {console.log(loginUserData)}
          </div>
          <nav className="mt-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => changeTab(item.name, item.path)}
                className={`flex items-center w-full p-4 transition
              ${activeTab === item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()
                    ? 'bg-blue-700 border-l-4 border-white'
                    : 'hover:bg-blue-700 hover:border-l-4 hover:border-white'
                  }`}
              >
                <item.icon className="mr-3" />
                {item.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
          <header className="p-4 bg-white shadow-md md:hidden">
            <button onClick={toggleSidebar} className="text-gray-800">
              <FaBars size={24} />
            </button>
          </header>
          <div className="p-6">
            <div className="p-6 mb-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <h2 className="mb-2 text-4xl font-bold">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className={`text-blue-100 ${activeTab==='Home'?'':'hidden'}`}>Manage your classroom with ease</p>
            </div>
            <Outlet />
          </div>
        </main>

      </div>

    </>
  );
};

export default TeacherDashboard;