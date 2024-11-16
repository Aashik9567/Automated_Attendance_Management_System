import React, { useState } from 'react';
import { FaUserGraduate, FaHome, FaCalendarAlt, FaStar, FaClipboardCheck, FaTimes, FaBars } from 'react-icons/fa';

import { Outlet,useNavigate,useLocation } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import store from '../../../zustand/loginStore';


const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const attendanceData = {
    totalClasses: 100,
    attendedClasses: 55,
    attendancePercentage: 55,
    lastAttendance: '2024-07-15',
    attendanceHistory: {
      '2024-07-15': 'Present',
      '2024-07-14': 'Absent',
      '2024-07-13': 'Present',
      '2024-07-12': 'Present',
      '2024-07-11': 'Absent',
      '2024-07-10': 'Present',
      '2024-07-09': 'Present',
    },
  };

  


  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loginUserData } = store(state => state);

  const changeTab = (tabName, path) => {
    setActiveTab(tabName);
    setIsSidebarOpen(false);
    navigate(path);
  };
  const navItems = [
    { name: 'Dashboard',path:'', icon: <FaHome className="w-6 h-6" /> },
    { name: 'Calendar',path:'calendar', icon: <FaCalendarAlt className="w-6 h-6" /> },
    { name: 'Course',path:'course', icon: <FaUserGraduate className="w-6 h-6" /> },
    { name: 'Holidays',path:'holidays', icon: <FaStar className="w-6 h-6" /> },
    { name: 'Attendance',path: 'attendance', icon: <FaClipboardCheck className="w-6 h-6" /> },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

 
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-gradient-to-r from-indigo-400 to-purple-400 text-white w-64 fixed h-full z-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'left-0' : '-left-64'} md:left-0`}>
        <div className="flex items-center justify-between p-4 md:hidden">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button onClick={toggleSidebar} className="text-white">
            <FaTimes size={24} />
          </button>
        </div>
        <div className="p-6">
          <h1 className="mb-2 text-3xl font-bold">Student Dashboard</h1>
          <p className="text-sm text-blue-200">Welcome back, {loginUserData.name}!</p>
        </div>
        <nav className="mt-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => changeTab(item.name.toLowerCase())}
              className={`flex items-center w-full p-4 transition ${activeTab === item.name.toLowerCase() ? 'bg-blue-700 border-l-4 border-white' : 'hover:bg-blue-700 hover:border-l-4 hover:border-white'}`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
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
            <h2 className="mb-2 text-4xl font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          </div>
          <Outlet/>
         

          {/* {activeTab === 'calendar' && (
            <div className="flex items-center justify-center p-8 bg-gradient-to-br from-blue-400 to-pink-300">
              <div className="p-8 bg-white shadow-xl bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl">
                <h3 className="mb-4 text-2xl font-bold text-blue-800">Calendar</h3>
                <Calendar
                  className="bg-transparent border-none"
                  tileClassName={({ date, view }) =>
                    view === 'month' && date.getDay() === 6 ? 'text-red-600 font-bold text-lg' : 'text-green-700 text-lg font-bold'
                  }
                  navigationLabel={({ date }) => (
                    <span className="text-xl font-semibold text-emerald-500">
                      {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                  )}
                  nextLabel={<span className="text-black">›</span>}
                  prevLabel={<span className="text-black">‹</span>}
                />
              </div>
            </div>
          )}

          {activeTab === 'course' && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-xl font-semibold">Your Courses Completion data</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'Mathematics', code: 'MATH101', progress: 75 },
                  { name: 'Computer Science', code: 'CS201', progress: 60 },
                  { name: 'Physics', code: 'PHY301', progress: 80 },
                  { name: 'Literature', code: 'LIT401', progress: 90 },
                ].map((course, index) => (
                  <div key={index} className="p-4 transition-shadow border rounded-lg hover:shadow-md">
                    <h4 className="text-lg font-semibold">{course.name}</h4>
                    <p className="mb-2 text-sm text-gray-600">Course Code: {course.code}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <p className="text-sm text-right">{course.progress}% Complete</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'holidays' && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-xl font-semibold">Upcoming Holidays</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Holiday</th>
                    <th className="p-2 text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '2024-12-25', name: 'Christmas Day', type: 'Public Holiday' },
                    { date: '2025-01-01', name: 'New Year\'s Day', type: 'Public Holiday' },
                    { date: '2025-01-26', name: 'Republic Day', type: 'National Holiday' },
                    { date: '2025-03-21', name: 'Holi', type: 'Festival' },
                  ].map((holiday, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="p-2">{holiday.date}</td>
                      <td className="p-2">{holiday.name}</td>
                      <td className="p-2">{holiday.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-xl font-semibold">Attendance Sheet</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Subject</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: '2024-07-15', subject: 'Mathematics', status: 'Present' },
                      { date: '2024-07-14', subject: 'Physics', status: 'Absent' },
                      { date: '2024-07-13', subject: 'Computer Science', status: 'Present' },
                      { date: '2024-07-12', subject: 'Literature', status: 'Present' },
                      { date: '2024-07-11', subject: 'Mathematics', status: 'Absent' },
                    ].map((record, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="p-2">{record.date}</td>
                        <td className="p-2">{record.subject}</td>
                        <td className={`p-2 ${record.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                          {record.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )} */}
        </div>
      </main>
      
    </div>
  );
};

export default StudentDashboard;