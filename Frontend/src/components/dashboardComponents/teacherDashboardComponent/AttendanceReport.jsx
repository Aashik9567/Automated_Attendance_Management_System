import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Select, Spin, message } from 'antd';
import { Column, Pie } from '@ant-design/plots';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, AlertCircle, ChevronDown } from 'lucide-react';
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
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      className="relative h-full p-6 overflow-hidden bg-transparent border shadow-none rounded-3xl backdrop-blur-xl border-blue-400/20"
    >
      <div className="absolute inset-0 bg-gradient-radial from-sky-500/10 to-purple-600/10 opacity-20 rounded-3xl" />
      <div className="relative z-10 flex items-center justify-between">
        <div className={`p-3 rounded-3xl bg-gradient-to-br ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <Text className="!text-sm !text-blue-300 block mb-1">{title}</Text>
          <Title level={3} className="!m-0 text-sky-600 animate-pulse">
            {value}
          </Title>
        </div>
      </div>
    </motion.div>
  );

  const chartConfigs = {
    bar: {
      data: attendanceData,
      xField: 'date',
      yField: 'presentCount',
      colorField: 'presentCount',
      color: ({ presentCount }) => {
        const maxPresent = Math.max(...attendanceData.map((d) => d.presentCount), 1);
        const ratio = presentCount / maxPresent;
        return `l(270) 0:${ratio > .7 ? '#3b82f6' : '#a5b4fc'} 1:${ratio > .7 ? '#8b5cf6' : '#d2b4f2'}`;
      },
      columnStyle: { 
        radius: [12, 12, 0, 0],
        shadowColor: 'rgba(79,70,229,0.08)',
        shadowBlur: 18
      },
      label: {
        position: 'top',
        style: { 
          fill: '#d4d4d4',
          fontSize: 12,
          fontWeight: 500 
        },
      },
      xAxis: {
        line: { style: { fill: 'none', stroke: 'rgba(255,255,255,0.05)' } },
        label: {
          style: { 
            fill: '#9ca3af',
            fontSize: 12
          }
        }
      },
      yAxis: {
        grid: { line: { style: { dashArray: '2,2', strokeOpacity: 0.2 } } },
        label: {
          style: { 
            fill: '#9ca3af',
            fontSize: 12
          }
        }
      },
    },
    pie: {
      data: [
        { type: 'Present', value: overallStats.totalPresent, color: '#3b82f6' },
        { type: 'Absent', value: overallStats.totalAbsent, color: '#f87171' }
      ],
      angleField: 'value',
      colorField: 'type',
      innerRadius: 0.6,
      pieStyle: {
        lineWidth: 0,
        stroke: 'transparent'
      },
      label: {
        type: 'spider',
        position: 'outer',
        content: '{value}',
        style: { 
          fontSize: 12,
          fontWeight: 500,
          fill: '#d4d4d4',
          textShadow: '0 1px 1px #222'
        }
      },
      legend: {
        position: 'bottom',
        itemName: {
          style: { 
            fill: '#d4d4d4',
            fontSize: 10
          }
        }
      },
      statistic: {
        title: {
          style: {
            fontSize: '10px',
            lineHeight: '1.2',
            color: '#64748b',
            textShadow: '0 0 1px #111',
          },
          content: ({ type }) => ` ${type === 'Present' ? '✅' : '❌'} ${type}`
        },
        content: {
          style: {
            fontSize: '14px',
            fontWeight: 800,
            color: '#e4e4e4',
            textShadow: '0 0 2px #333'
          }
        }
      },
      interactions: [{ type: 'element-single-selected' }],
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
            <Spin size="large" />
          </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen p-8 bg-gradient-to-br from-slate-600 via-blue-600 to-indigo-700"
    >
      <div className="mx-auto space-y-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-8 border shadow-2xl bg-gradient-radial from-white/5 to-slate-700 backdrop-blur-lg rounded-3xl border-white/10 glass-card"
        >
          <Title level={2} className="!mb-6 gradient-text-8">
            📊 Attendance Analytics
          </Title>
          <Select
            className="w-full md:w-96 [&>span.select-selector]:!bg-transparent [&>span.select-selector]:!border-sky-700 
                       [&>span.select-selector]:!text-sky-300 [&>span.select-selector]:!hover:border-sky-500
                       [&>span.select-item]:!font-semibold [&>span.select-item]:!text-sky-400"
            placeholder="🔍 Select Subject"
            value={selectedSubject}
            onChange={handleSubjectChange}
            size="large"
            suffixIcon={<ChevronDown className="text-sky-300 hover:text-sky-500" />}
            popupClassName="bg-slate-800 border-sky-700 
                           shadow-sky-700/40 text-sky-300 divide-sky-500"
            notFoundContent={<div className="text-sky-300">No subjects</div>}
          >
            {subjects.map((s) => (
              <Select.Option key={s._id} value={s._id} 
                             className="hover:bg-sky-900/60 active:bg-indigo-900/60">
                <div className="flex items-center space-x-3">
                  <Calendar size={18} className="text-sky-400" />
                  <span className="font-medium text-sky-300">
                    {s.name} <span className="ml-2 opacity-70">({s.code})</span>
                  </span>
                </div>
              </Select.Option>
            ))}
          </Select>
          <div className="absolute p-2 rounded-full right-6 top-6 bg-gradient-radial from-sky-600 via-sky-600/20 to-transparent animate-rotate-right-slow">
            <Users size={32} className="text-sky-100" />
          </div>
        </motion.div>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              icon={<Calendar className="w-6 h-6 text-white" />}
              title="Total Days"
              value={overallStats.totalDays}
              color="from-sky-400 to-blue-400"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              icon={<Users className="w-6 h-6 text-white" />}
              title="Average Attendance"
              value={`${overallStats.avgAttendance}%`}
              color="from-lime-400 via-lime-400/60 to-sky-400/30"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              title="Best Attendance Day"
              value={overallStats.highestAttendance}
              color="from-teal-600 to-emerald-400"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              icon={<AlertCircle className="w-6 h-6 text-white" />}
              title="Lowest Attendance"
              value={overallStats.lowestAttendance}
              color="from-red-600 to-pink-600"
            />
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-6 border shadow-2xl bg-gradient-radial from-sky-500/20 to-transparent rounded-3xl backdrop-blur-3xl border-sky-800/50 glass-card"
              style={{ backgroundBlendMode: 'luminosity' }}
            >
              <Title level={4} className="!mb-4 !text-transparent gradient-text-5">
                📈 Daily Attendance Trend
              </Title>
              <Column {...chartConfigs.bar} height={250} />
            </motion.div>
          </Col>

          <Col xs={24} lg={10}>
            <motion.div
              initial={{ scale: 0.95, filter: 'saturate(50%)' }}
              animate={{ scale: 1, filter: 'saturate(100%)' }}
              className="p-6 border shadow-2xl bg-gradient-radial from-emerald-300/20 to-transparent rounded-3xl backdrop-blur-3xl border-emerald-800/50 glass-card"
              style={{ backgroundBlendMode: 'color' }}
            >
              <Title level={4} className="!mb-4 !text-transparent gradient-text-3">
                🎯 Attendance Distribution
              </Title>
              <Pie {...chartConfigs.pie} height={250} />
            </motion.div>
          </Col>
        </Row>
      </div>
    </motion.div>
  );
};

export default AttendanceReport;