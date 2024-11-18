import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';

const AttendanceReport = ({ attendanceData }) => {
  // Assuming attendanceData is an array of objects with date and presentCount properties
  // Example: [{ date: '2023-07-01', presentCount: 15, totalStudents: 20 }, ...]

  // Calculate average attendance
  const averageAttendance = attendanceData.reduce((sum, day) => sum + day.presentCount, 0) / attendanceData.length;

  // Prepare data for pie chart
  const overallAttendance = {
    present: attendanceData.reduce((sum, day) => sum + day.presentCount, 0),
    absent: attendanceData.reduce((sum, day) => sum + (day.totalStudents - day.presentCount), 0),
  };

  const pieChartData = [
    { name: 'Present', value: overallAttendance.present },
    { name: 'Absent', value: overallAttendance.absent },
  ];

  const COLORS = ['green', 'orange'];

  return (
    <div className="p-6 rounded-lg shadow-md bg-neutral-400">
      <h2 className="mb-4 text-2xl font-bold">Attendance Report</h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Bar Chart: Daily Attendance */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Daily Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="presentCount" fill="#8884d8" name="Present" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Overall Attendance */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Overall Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Summary Statistics */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Summary Statistics</h3>
          <div className="p-4 rounded-lg bg-neutral-400">
            <p className="mb-2">Total Days: {attendanceData.length}</p>
            <p className="mb-2">Average Attendance: {averageAttendance.toFixed(2)} students</p>
            <p className="mb-2">Highest Attendance: {Math.max(...attendanceData.map(day => day.presentCount))} students</p>
            <p>Lowest Attendance: {Math.min(...attendanceData.map(day => day.presentCount))} students</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;