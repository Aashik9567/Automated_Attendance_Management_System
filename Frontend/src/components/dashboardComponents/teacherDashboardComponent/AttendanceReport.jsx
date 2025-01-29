import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Select, Spin, message } from 'antd';
import { Column } from '@ant-design/plots';
import { Pie } from '@ant-design/plots';
import axios from 'axios';

const { Title, Text } = Typography;

const AttendanceReport = () => {
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
      color: '#1890ff',
      label: {
        position: 'middle',
        style: { fill: '#fff', opacity: 0.6 }
      }
    },
    pie: {
      data: [
        { type: 'Present', value: overallStats.totalPresent },
        { type: 'Absent', value: overallStats.totalAbsent }
      ],
      angleField: 'value',
      colorField: 'type',
      color: ['#52c41a', '#ff4d4f'],
      label: ({ type, percent }) => `${type} (${(percent * 100).toFixed(2)}%)`,
      legend: { position: 'bottom' }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Spin size="large" />
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <Card className="shadow-lg rounded-xl">
        <Select
          className="w-full mb-6"
          placeholder="Select Subject"
          value={selectedSubject}
          onChange={handleSubjectChange}
          options={subjects.map(s => ({
            value: s._id,
            label: `${s.name} (${s.code})`
          }))}
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card 
              title="Daily Attendance" 
              className="shadow-md rounded-xl"
            >
              <Column {...chartConfigs.bar} height={300} />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card 
              title="Overall Attendance" 
              className="shadow-md rounded-xl"
            >
              <Pie {...chartConfigs.pie} height={300} />
            </Card>
          </Col>

          <Col span={24}>
            <Card 
              title="Summary Statistics" 
              className="shadow-md rounded-xl"
            >
              <Row gutter={[24, 16]}>
                {Object.entries({
                  'Total Days': overallStats.totalDays,
                  'Avg. Attendance': `${overallStats.avgAttendance} students`,
                  'Highest Attendance': `${overallStats.highestAttendance} students`,
                  'Lowest Attendance': `${overallStats.lowestAttendance} students`
                }).map(([label, value], idx) => (
                  <Col key={idx} xs={24} sm={12} md={6}>
                    <div className="p-3 rounded-lg bg-blue-50">
                      <Text strong className="text-gray-600">{label}: </Text>
                      <Text className="text-blue-600">{value}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AttendanceReport;