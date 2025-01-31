
  import React, { useState, useEffect } from 'react';
  import { Card, Typography, Row, Col, Select, Spin, message } from 'antd';
  import { Column } from '@ant-design/plots';
  import { Pie } from '@ant-design/plots';
  import axios from 'axios';
  import { motion } from 'framer-motion';
  
  const { Title, Text } = Typography;
  
  const AttendanceReport = () => {
    // ... existing state and logic remains the same ...
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [overallStats, setOverallStats] = useState({
      totalDays: 0,
      avgAttendance: 0,
      highestAttendance: 0,
      lowestAttendance: 0,
      totalPresent: 0,
      totalAbsent: 0
    });
  
    const fetchData = async () => {
      try {
        // Fetch subjects first
        const subjectsRes = await axios.get('http://localhost:8080/api/v1/subjects/getsubject', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const subjects = subjectsRes.data.data;
        setSubjects(subjects);
  
        // Set first subject as default selected
        if (subjects.length > 0 && !selectedSubject) {
          setSelectedSubject(subjects[0]._id);
        }
  
        if (selectedSubject) {
          // Fetch attendance data for selected subject
          const attendanceRes = await axios.get(`http://localhost:8080/api/v1/attendance/subject/${selectedSubject}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
          });
          const attendanceRecords = attendanceRes.data;
  
          // Process attendance data for charts
          const processedData = attendanceRecords.map(record => {
            const presentCount = record.students.filter(s => s.status === 'present').length;
            return {
              date: new Date(record.date).toLocaleDateString(),
              presentCount,
              totalStudents: record.students.length
            };
          });
  
          // Calculate statistics
          const totalPresent = attendanceRecords.reduce((sum, record) => 
            sum + record.students.filter(s => s.status === 'present').length, 0);
          const totalStudents = attendanceRecords.reduce((sum, record) => 
            sum + record.students.length, 0);
          const presentCounts = processedData.map(d => d.presentCount);
  
          setAttendanceData(processedData);
          setOverallStats({
            totalDays: processedData.length,
            avgAttendance: processedData.length ? (totalPresent / processedData.length).toFixed(2) : 0,
            highestAttendance: Math.max(...presentCounts, 0),
            lowestAttendance: Math.min(...presentCounts, 0),
            totalPresent,
            totalAbsent: totalStudents - totalPresent
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
    const chartConfigs = {
      bar: {
        data: attendanceData,
        xField: 'date',
        yField: 'presentCount',
        colorField: 'presentCount',
        color: ({ presentCount }) => {
          const ratio = presentCount / Math.max(...attendanceData.map(d => d.presentCount));
          return `l(270) 0:#3b82f6 1:#8b5cf6${ratio}`;
        },
        columnStyle: { radius: [8, 8, 0, 0] },
        label: {
          position: 'middle',
          style: { fill: '#fff', fontSize: 12, fontWeight: 500 }
        },
        xAxis: { label: { style: { fill: '#64748b', fontSize: 12 } } },
        yAxis: { label: { style: { fill: '#64748b', fontSize: 12 } } }
      },
      pie: {
        data: [
          { type: 'Present', value: overallStats.totalPresent },
          { type: 'Absent', value: overallStats.totalAbsent }
        ],
        angleField: 'value',
        colorField: 'type',
        color: ['#4ade80', '#f87171'],
        innerRadius: 0.6,
        label: { type: 'inner', content: '{percentage}', style: { fontSize: 14 } },
        legend: { position: 'bottom', itemName: { style: { fill: '#64748b' } } },
        interactions: [{ type: 'element-active' }]
      }
    };
  
    if (loading) return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
      >
        <Spin size="large" className="[&>.ant-spin-dot]:!size-10 [&>.ant-spin-dot>.ant-spin-dot-item]:!bg-gradient-to-r from-blue-600 to-purple-600" />
      </motion.div>
    );
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen p-6 bg-gradient-to-br from-blue-50/90 to-indigo-50/90"
      >
        <div className="mx-auto space-y-6 max-w-7xl">
        <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  className="relative w-full"
>
  <div className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
  <Select
    className="relative w-full"
    placeholder="Select Subject"
    value={selectedSubject}
    onChange={handleSubjectChange}
    dropdownStyle={{ 
      background: '#1a1a1a',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}
    style={{
      height: '56px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(12px)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}
  >
    {subjects.map(s => (
      <Select.Option 
        key={s._id} 
        value={s._id}
        style={{
          background: 'transparent',
          color: 'white'
        }}
      >
        <span className="font-medium">
          {s.name}
          <span className="ml-2 opacity-70">({s.code})</span>
        </span>
      </Select.Option>
    ))}
  </Select>
</motion.div>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <Card
                  bordered={false}
                  className="!rounded-2xl !bg-white/90 !backdrop-blur-sm !shadow-xl"
                  title={
                    <Title level={4} className="!mb-0 !text-lg !text-slate-700">
                      📅 Daily Attendance Trend
                    </Title>
                  }
                >
                  <Column {...chartConfigs.bar} height={300} />
                </Card>
              </motion.div>
            </Col>
  
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
              >
                <Card
                  bordered={false}
                  className="!rounded-2xl !bg-white/90 !backdrop-blur-sm !shadow-xl"
                  title={
                    <Title level={4} className="!mb-0 !text-lg !text-slate-700">
                      🎯 Attendance Distribution
                    </Title>
                  }
                >
                  <Pie {...chartConfigs.pie} height={300} />
                </Card>
              </motion.div>
            </Col>
  
            <Col span={24}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card
                  bordered={false}
                  className="!rounded-2xl !bg-white/90 !backdrop-blur-sm !shadow-xl"
                  title={
                    <Title level={4} className="!mb-0 !text-lg !text-slate-700">
                      📊 Performance Summary
                    </Title>
                  }
                >
                  <Row gutter={[24, 16]}>
                    {Object.entries({
                      '📆 Total Days': overallStats.totalDays,
                      '📈 Average Daily Attendance': `${overallStats.avgAttendance}`,
                      '🚀 Highest Attendance': `${overallStats.highestAttendance}`,
                      '⚠️ Lowest Attendance': `${overallStats.lowestAttendance}`
                    }).map(([label, value], idx) => (
                      <Col key={idx} xs={24} sm={12} md={6}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-4 border border-white shadow-sm bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl"
                        >
                          <Text className="!text-sm !text-slate-600 block mb-1">{label}</Text>
                          <Text className="!text-2xl !font-bold !text-blue-600">{value}</Text>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </motion.div>
    );
  };
  
  export default AttendanceReport;