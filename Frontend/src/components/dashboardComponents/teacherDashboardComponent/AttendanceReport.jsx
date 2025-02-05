import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Select, Spin, message } from 'antd';
import { Column, Pie } from '@ant-design/plots';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, AlertCircle,ChevronDown } from 'lucide-react';
import store from '../../../zustand/loginStore';

const { Title, Text } = Typography;

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

  // Keeping the original fetch functionality
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

  const StatsCard = ({ icon, title, value, color }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative h-full p-6 overflow-hidden border shadow-2xl bg-white/5 backdrop-blur-xl rounded-2xl border-white/10"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-20" />
      <div className="relative flex items-center justify-between">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <Text className="!text-sm !text-blue-300 block mb-1">{title}</Text>
          <Title level={3} className="!m-0 !text-transparent bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text">
            {value}
          </Title>
        </div>
      </div>
    </motion.div>
  );


  // Enhanced chart configurations
  const chartConfigs = {
    bar: {
      data: attendanceData,
      xField: 'date',
      yField: 'presentCount',
      colorField: 'presentCount',
      color: ({ presentCount }) => {
        const maxPresent = Math.max(...attendanceData.map((d) => d.presentCount), 1);
        const ratio = presentCount / maxPresent;
        return `l(270) 0:#3b82f6 1:#8b5cf6${ratio}`;
      },
      columnStyle: { 
        radius: [8, 8, 0, 0],
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowBlur: 10
      },
      label: {
        position: 'top',
        style: { 
          fill: '#64748b',
          fontSize: 12,
          fontWeight: 500 
        },
      },
      xAxis: {
        label: {
          style: { 
            fill: '#64748b',
            fontSize: 12
          }
        }
      },
      yAxis: {
        label: {
          style: { 
            fill: '#64748b',
            fontSize: 12
          }
        }
      },
    },
    pie: {
      data: [
        { type: 'Present', value: overallStats.totalPresent },
        { type: 'Absent', value: overallStats.totalAbsent },
      ],
      angleField: 'value',
      colorField: 'type',
      color: ['#4ade80', '#f87171'],
      innerRadius: 0.7,
      label: {
        content: '{percentage}',
        style: { 
          fontSize: 14,
          fontWeight: 500
        },
      },
      legend: {
        position: 'bottom',
        itemName: {
          style: { 
            fill: '#64748b',
            fontSize: 12
          }
        }
      },
      statistic: {
        title: {
          style: {
            fontSize: '14px',
            lineHeight: '1.2',
            color: '#64748b'
          },
          content: 'Attendance'
        },
        content: {
          style: {
            fontSize: '24px',
            lineHeight: '1',
            color: '#3b82f6'
          }
        }
      },
      interactions: [{ type: 'element-active' }],
    },
  };
  chartConfigs.bar.color = '#3b82f6';
  chartConfigs.bar.columnStyle = {
    radius: [8, 8, 0, 0],
    shadowColor: 'rgba(59, 130, 246, 0.2)',
    shadowBlur: 12
  };

  chartConfigs.pie.color = ['#3b82f6', '#8b5cf6'];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
      >
        <Spin size="large" className="[&>.ant-spin-dot]:!size-10" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
    >
      <div className="mx-auto space-y-8 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 border shadow-2xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
        >
          <Title level={2} className="!mb-6 !text-transparent bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text">
            📊 Attendance Analytics
          </Title>
          <Select
            className="w-full md:w-96 [&>.ant-select-selector]:!bg-white/5 [&>.ant-select-selector]:!border-white/10 [&>.ant-select-selection-item]:!text-white"
            placeholder="Select Subject"
            value={selectedSubject}
            onChange={handleSubjectChange}
            size="large"
            suffixIcon={<ChevronDown className="text-blue-300" />}
          >
            {subjects.map((s) => (
              <Select.Option key={s._id} value={s._id}>
                <span className="font-medium text-blue-200">
                  {s.name} <span className="ml-2 opacity-70">({s.code})</span>
                </span>
              </Select.Option>
            ))}
          </Select>
        </motion.div>

        {/* Stats Grid */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              icon={<Calendar className="w-6 h-6 text-white" />}
              title="Total Days"
              value={overallStats.totalDays}
              color="from-blue-600 to-purple-500"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              icon={<Users className="w-6 h-6 text-white" />}
              title="Average Attendance"
              value={`${overallStats.avgAttendance}%`}
              color="from-emerald-600 to-cyan-500"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              title="Highest Attendance"
              value={overallStats.highestAttendance}
              color="from-green-600 to-teal-500"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              icon={<AlertCircle className="w-6 h-6 text-white" />}
              title="Lowest Attendance"
              value={overallStats.lowestAttendance}
              color="from-red-600 to-pink-500"
            />
          </Col>
        </Row>

        {/* Charts Section */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-6 border shadow-2xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
            >
              <Title level={4} className="!mb-4 !text-transparent bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text">
                📈 Daily Attendance Trend
              </Title>
              <Column {...chartConfigs.bar} height={300} />
            </motion.div>
          </Col>

          <Col xs={24} lg={10}>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-6 border shadow-2xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
            >
              <Title level={4} className="!mb-4 !text-transparent bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text">
                🎯 Attendance Distribution
              </Title>
              <Pie {...chartConfigs.pie} height={300} />
            </motion.div>
          </Col>
        </Row>
      </div>
    </motion.div>
  );
};

export default AttendanceReport;