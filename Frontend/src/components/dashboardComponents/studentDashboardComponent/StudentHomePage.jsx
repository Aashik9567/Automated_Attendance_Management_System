import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { PieChart } from 'react-minimal-pie-chart';

const StudentHomePage = () => {
    const leaveTypesData = [
        { leaveType: 'Sick Leave', count: 5 },
        { leaveType: 'Vacation', count: 10 },
        { leaveType: 'Personal', count: 3 },
      ];
    const barChartData = [
        { name: 'Jan', attendance: 85 },
        { name: 'Feb', attendance: 90 },
        { name: 'Mar', attendance: 88 },
        { name: 'Apr', attendance: 92 },
        { name: 'May', attendance: 95 },
        { name: 'Jun', attendance: 89 },
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
      const lineChartData = [
        { month: 'Jan', Present: 85, Late: 10, Absent: 5 },
        { month: 'Feb', Present: 80, Late: 15, Absent: 5 },
        { month: 'Mar', Present: 90, Late: 5, Absent: 5 },
        { month: 'Apr', Present: 85, Late: 10, Absent: 5 },
        { month: 'May', Present: 88, Late: 7, Absent: 5 },
        { month: 'Jun', Present: 92, Late: 5, Absent: 3 },
      ];
      const XAxis = ({ ...rest }) => <RechartsXAxis {...rest} />;

     
  return (
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
  )
}

export default StudentHomePage
