import React, { useState } from 'react';
import { FaUserGraduate, FaHome, FaCalendarAlt, FaStar, FaClipboardCheck, FaTimes, FaBars } from 'react-icons/fa';
import { PieChart } from 'react-minimal-pie-chart';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import store from '../../../zustand/loginStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';



const StudentDashboard = () => {
  const leaveTypesData = [
    { leaveType: 'Sick Leave', count: 5 },
    { leaveType: 'Vacation', count: 10 },
    { leaveType: 'Personal', count: 3 },
  ];

  const data = leaveTypesData.map((item, index) => ({
    title: item.leaveType,
    value: item.count,
    color: [
      'rgb(74, 222, 128)',
      'rgb(96, 165, 250)',
      'rgb(251, 191, 36)'
    ][index % 3] // Assign a color to each slice
  }));
  const barChartData = [
    { name: 'Jan', attendance: 85 },
    { name: 'Feb', attendance: 90 },
    { name: 'Mar', attendance: 88 },
    { name: 'Apr', attendance: 92 },
    { name: 'May', attendance: 95 },
    { name: 'Jun', attendance: 89 },
  ];

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

  const lineChartData = [
    { month: 'Jan', Present: 85, Late: 10, Absent: 5 },
    { month: 'Feb', Present: 80, Late: 15, Absent: 5 },
    { month: 'Mar', Present: 90, Late: 5, Absent: 5 },
    { month: 'Apr', Present: 85, Late: 10, Absent: 5 },
    { month: 'May', Present: 88, Late: 7, Absent: 5 },
    { month: 'Jun', Present: 92, Late: 5, Absent: 3 },
  ];


  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLogin, loginUserData } = store((state) => state);

  const changeTab = (tabName) => {
    setActiveTab(tabName);
    setIsSidebarOpen(false);
  };

  const navItems = [
    { name: 'Dashboard',path:'', icon: <FaHome className="w-6 h-6" /> },
    { name: 'Calendar',path:'calendar', icon: <FaCalendarAlt className="w-6 h-6" /> },
    { name: 'Course',path:'course', icon: <FaUserGraduate className="w-6 h-6" /> },
    { name: 'Holidays',path:'holidays', icon: <FaStar className="w-6 h-6" /> },
    { name: 'Attendance',path: 'attendance', icon: <FaClipboardCheck className="w-6 h-6" /> },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const pieChartData = [
    { title: 'Present', value: attendanceData.attendedClasses, color: '#4CAF50' },
    { title: 'Absent', value: attendanceData.totalClasses - attendanceData.attendedClasses, color: '#F44336' },
  ];

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

          {activeTab === 'dashboard' && (
            <div className="flex flex-col bg-gray-100">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                {['bg-indigo-400', 'bg-blue-400', 'bg-orange-400', 'bg-green-400'].map((color, index) => (
                  <div key={index} className={`${color} rounded-lg shadow-md p-6 text-white`}>
                    <h4 className="mb-2 text-2xl font-semibold">{['95%', '85%', '78%', '92%'][index]}</h4>
                    <p className="text-lg">{['Overall Attendance', 'On-time Rate', 'Leave Requests', 'Productivity'][index]}</p>
                    <p className="mt-2 text-sm">{['+5%', '-2%', '+3%', '+1%'][index]} vs last month</p>
                  </div>
                ))}
                
              </div>

              {/* Main Chart */}
              <div className="p-6 mb-8 rounded-lg shadow-md bg-slate-200">
                <h4 className="mb-4 text-xl font-semibold">Monthly Attendance Trends</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Present" stroke="#8884d8" strokeWidth={4}/>
                      <Line type="monotone" dataKey="Late" stroke="#82ca9d" strokeWidth={4}/>
                      <Line type="monotone" dataKey="Absent" stroke="#ff7300" strokeWidth={4}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Department Attendance Chart */}
                <div className="p-6 rounded-lg shadow-md bg-slate-200">
                  <h4 className="mb-4 text-xl font-bold">Monthly Attendance Record</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barChartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="attendance" fill="rgba(74, 222, 128,1)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Attendance Stats and Leave Types */}
                <div className="p-4 rounded-lg shadow-md bg-slate-200 max-h-96">
                  <h4 className="text-xl font-bold ">Attendance Statistics</h4>
                  <PieChart
                    data={data}
                    animate
                    animationDuration={1000}
                    animationEasing="ease-out"
                    label={({ dataEntry }) => dataEntry.title}
                    labelStyle={(index) => ({
                      fill: data[index].color,
                      fontSize: '5px',
                      fontFamily: 'sans-serif',
                    })}
                    labelPosition={60}
                    radius={35}
                    lineWidth={25}
                    paddingAngle={8}
                    className="transition-all duration-500 transform shadow-lg hover:scale-105"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
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
          )}
        </div>
      </main>
      
    </div>
  );
};

export default StudentDashboard;