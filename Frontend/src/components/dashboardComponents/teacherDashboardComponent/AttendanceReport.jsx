import { useState, useEffect } from 'react';
import { Typography, Select, Spin, Alert } from 'antd';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Users, Calendar, TrendingUp, AlertCircle, ChevronDown, PieChartIcon, BarChart2, LineChart as LucideLineChart, Target
} from 'lucide-react';
import store from '../../../zustand/loginStore';

const { Title, Text } = Typography;
const { Option } = Select;

const chartColors = ['#30f200', '#f60981', '#f59e0b', '#ef0044'];

const AttendanceReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loginUserData } = store((state) => state);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [overallStats, setOverallStats] = useState({
    totalDays: 0,
    avgAttendance: 0,
    highestAttendance: 0,
    lowestAttendance: 0,
    totalPresent: 0,
    totalAbsent: 0,
  });

  // Fetch data from the server
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const subjectsRes = await axios.get(`${loginUserData.baseURL}/subjects`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      const subjectsArray = subjectsRes.data.data;
      setSubjects(subjectsArray);

      if (subjectsArray.length > 0 && !selectedSubject) {
        setSelectedSubject(subjectsArray[0]._id);
      }

      if (selectedSubject) {
        const attendanceRes = await axios.get(
          `${loginUserData.baseURL}/attendance/subject/${selectedSubject}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          }
        );
        const attendanceRecords = attendanceRes.data.data;

        if (!Array.isArray(attendanceRecords)) {
          throw new Error("Attendance records is not an array");
        }

        const processedData = attendanceRecords.map((record) => ({
          date: new Date(record.date).toLocaleDateString(),
          presentCount: record.students.filter((s) => s.status === 'present').length,
          totalStudents: record.students.length,
        }));

        const totalPresent = attendanceRecords.reduce(
          (sum, record) => sum + record.students.filter((s) => s.status === 'present').length,
          0
        );
        const totalStudents = attendanceRecords.reduce(
          (sum, record) => sum + record.students.length,
          0
        );
        const presentCounts = processedData.map((d) => d.presentCount);

        setAttendanceData(processedData);
        setOverallStats({
          totalDays: processedData.length,
          avgAttendance: processedData.length ? (totalPresent / processedData.length).toFixed(2) : 0,
          highestAttendance: presentCounts.length ? Math.max(...presentCounts) : 0,
          lowestAttendance: presentCounts.length ? Math.min(...presentCounts) : 0,
          totalPresent,
          totalAbsent: totalStudents - totalPresent,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch attendance data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSubject]);

  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
    setLoading(true);
  };

  // Prepare chart data
  const getChartData = () => {
    return {
      barData: attendanceData,
      pieData: [
        { name: 'Present', value: overallStats.totalPresent },
        { name: 'Absent', value: overallStats.totalAbsent }
      ],
      lineData: attendanceData.map((d, i) => ({
        name: `Day ${i + 1}`,
        attendance: d.presentCount
      })),
    };
  };

  const { barData, pieData, lineData } = getChartData();

  // Custom label for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-6 bg-gradient-to-br from-slate-600 via-blue-700 to-indigo-900"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
          <div          >
            <Title level={2} className="text-gray-100 !m-0 flex items-center gap-3">
              <Users className="w-8 h-8 text-yellow-100" />
              Attendance Analytics Dashboard
            </Title>
            <Text className="mt-2 text-gray-100">
              Comprehensive analysis of student attendance patterns
            </Text>
          </div>

          <Select
            suffixIcon={<ChevronDown className="text-gray-300" />}
            className="min-w-[200px] bg-white/5 border border-white/10 rounded-xl"
            value={selectedSubject}
            onChange={handleSubjectChange}
            popupClassName="bg-slate-900 text-gray-300 rounded-lg"
          >
            {subjects.map(subject => (
              <Option key={subject._id} value={subject._id}>
                {subject.name}
              </Option>
            ))}
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Spin size="large" />
            <Text className="ml-4 text-gray-300">Loading attendance data...</Text>
          </div>
        ) : error ? (
          <Alert message={error} type="error" className="mb-4 rounded-lg" />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Calendar, title: 'Total Days', value: overallStats.totalDays, bg: 'bg-blue-600' },
                { icon: TrendingUp, title: 'Avg Attendance', value: overallStats.avgAttendance, bg: 'bg-green-600' },
                { icon: Target, title: 'Highest Attendance', value: overallStats.highestAttendance, bg: 'bg-amber-600' },
                { icon: AlertCircle, title: 'Lowest Attendance', value: overallStats.lowestAttendance, bg: 'bg-red-600' },
              ].map((stat) => (
                <motion.div
                  key={stat.title}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 border shadow-xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Text className="text-gray-300">{stat.title}</Text>
                      <Title level={3} className="!mt-1 !mb-0 text-white">
                        {stat.value}
                      </Title>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Daily Attendance Bar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="p-6 border shadow-xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <BarChart2 className="w-6 h-6 text-blue-300" />
                  <Text strong className="text-gray-300">Daily Attendance Trend</Text>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <defs>
                      <linearGradient id="barGradient" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fbf2f6" />
                        <stop offset="100%" stopColor="#ff33ff" />
                      </linearGradient>
                    </defs>
                    <Bar dataKey="presentCount" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
                    <XAxis dataKey="date" stroke="#e5e7eb" />
                    <YAxis stroke="#e5e7eb" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Attendance Distribution Pie Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-6 border shadow-xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <PieChartIcon className="w-6 h-6 text-green-300" />
                  <Text strong className="text-gray-300">Attendance Distribution</Text>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={90}
                      innerRadius={50}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ color: '#e5e7eb', fontSize: '14px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Attendance Trend Line Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-6 border shadow-xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <LucideLineChart className="w-6 h-6 text-purple-300" />
                  <Text strong className="text-gray-300">Attendance Trend</Text>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                    />
                    <XAxis dataKey="name" stroke="#d1d5db" />
                    <YAxis stroke="#d1d5db" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AttendanceReport;