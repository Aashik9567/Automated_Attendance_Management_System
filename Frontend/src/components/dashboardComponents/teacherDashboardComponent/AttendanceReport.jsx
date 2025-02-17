import { useState, useEffect } from 'react';
import { Typography, Select, Spin, Card, message } from 'antd';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, RadialBarChart, RadialBar, ResponsiveContainer, 
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

const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const AttendanceReport = () => {
  const [loading, setLoading] = useState(true);
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

  const fetchData = async () => {
    try {
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
      message.error('Failed to fetch data');
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
      radialData: [{
        name: 'Average',
        value: overallStats.avgAttendance,
        fill: '#3b82f6'
      }]
    };
  };

  const { barData, pieData, lineData, radialData } = getChartData();

  // Custom shape for pie chart
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
      className="min-h-screen p-6 rounded-xl bg-gradient-to-br from-slate-700 via-blue-900 to-indigo-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div initial={{ y: -20 }} animate={{ y: 0 }}>
            <Title level={2} className="!m-0 flex items-center gap-3 bg-gradient-to-r from-blue-400 to-purple-300">
              <Users className="w-8 h-8" />
              Attendance Analytics Dashboard
            </Title>
            <h2 className="mt-5 text-gray-300">
              Comprehensive analysis of student attendance patterns
            </h2>
          </motion.div>
          
          <Select
            suffixIcon={<ChevronDown className="text-gray-300" />}
            className="min-w-[200px] bg-white/5 border border-white/10 rounded-xl"
            value={selectedSubject}
            onChange={handleSubjectChange}
            dropdownClassName="bg-slate-900 text-gray-300"
          >
            {subjects.map(subject => (
              <Option key={subject._id} value={subject._id}>
                {subject.name}
              </Option>
            ))}
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: Calendar, title: 'Total Days', value: overallStats.totalDays, bg: 'from-blue-600 to-blue-500' },
                { icon: TrendingUp, title: 'Avg Attendance', value: overallStats.avgAttendance, bg: 'from-green-600 to-green-500' },
                { icon: Target, title: 'Highest Attendance', value: overallStats.highestAttendance, bg: 'from-amber-600 to-amber-500' },
                { icon: AlertCircle, title: 'Lowest Attendance', value: overallStats.lowestAttendance, bg: 'from-red-600 to-red-500' },
              ].map((stat) => (
                <motion.div
                  key={stat.title}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 border shadow-2xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.bg}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Text className="text-gray-300">{stat.title}</Text>
                      <Title level={3} className="!mt-1 !mb-0 text-gray-100">
                        {stat.value}
                      </Title>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Attendance Bar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-900 to-indigo-900 backdrop-blur-xl border border-purple-700 rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <BarChart2 className="w-6 h-6 text-blue-300" />
                  <Text strong className="text-white text-lg">Daily Attendance Trend</Text>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#9333ea" />
                      </linearGradient>
                    </defs>
                    <Bar dataKey="presentCount" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
                    <XAxis dataKey="date" stroke="#e5e7eb" />
                    <YAxis stroke="#e5e7eb" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>


              {/* Attendance Distribution Pie Chart */}
              <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-gradient-to-br from-green-900 to-blue-900 backdrop-blur-xl border border-green-700 rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition duration-300"
>
  <div className="flex items-center gap-3 mb-4">
    <PieChartIcon className="w-6 h-6 text-green-300" />
    <Text strong className="text-white text-lg">Attendance Distribution</Text>
  </div>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <defs>
        <linearGradient id="gradient1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="gradient3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="gradient4" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
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
        {pieData.map((entry, index) => {
          let gradientId;
          if (index % chartColors.length === 0) gradientId = "gradient1";
          else if (index % chartColors.length === 1) gradientId = "gradient2";
          else if (index % chartColors.length === 2) gradientId = "gradient3";
          else gradientId = "gradient4";
          return <Cell key={`cell-${index}`} fill={`url(#${gradientId})`} />;
        })}
      </Pie>
      <Legend wrapperStyle={{ color: '#e5e7eb', fontSize: '14px' }} />
      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
    </PieChart>
  </ResponsiveContainer>
</motion.div>

              {/* Attendance Trend Line Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6"
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
                      dot={{ fill: '#3b82f6' }}
                    />
                    <XAxis dataKey="name" stroke="#d1d5db" />
                    <YAxis stroke="#d1d5db" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
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