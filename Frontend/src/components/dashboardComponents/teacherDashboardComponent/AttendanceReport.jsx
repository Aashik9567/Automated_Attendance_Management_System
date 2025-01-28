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

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchAttendanceData();
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects/getsubject');
      setSubjects(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedSubject(response.data.data[0]._id);
      }
    } catch (error) {
      message.error('Failed to fetch subjects');
      console.error(error);
    }
  };

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/attendance/${selectedSubject}`);
      const attendanceRecords = response.data.data;

      const processedData = attendanceRecords.map(record => ({
        date: new Date(record.date).toLocaleDateString(),
        presentCount: record.students.filter(s => s.status === 'present').length,
        totalStudents: record.students.length
      }));

      const totalPresent = attendanceRecords.reduce((sum, record) => 
        sum + record.students.filter(s => s.status === 'present').length, 0);
      
      const totalStudents = attendanceRecords.reduce((sum, record) => 
        sum + record.students.length, 0);

      setAttendanceData(processedData);
      setOverallStats({
        totalDays: processedData.length,
        avgAttendance: processedData.length ? (totalPresent / processedData.length).toFixed(2) : 0,
        highestAttendance: Math.max(...processedData.map(d => d.presentCount)),
        lowestAttendance: Math.min(...processedData.map(d => d.presentCount)),
        totalPresent: totalPresent,
        totalAbsent: totalStudents - totalPresent
      });
    } catch (error) {
      message.error('Failed to fetch attendance data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const barChartConfig = {
    data: attendanceData,
    xField: 'date',
    yField: 'presentCount',
    color: '#1890ff',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  const pieChartConfig = {
    data: [
      { type: 'Present', value: overallStats.totalPresent },
      { type: 'Absent', value: overallStats.totalAbsent }
    ],
    angleField: 'value',
    colorField: 'type',
    color: ['#52c41a', '#ff4d4f'],
    label: {
      text: ({ type, value, percent }) => 
        `${type} ${value} (${(percent * 100).toFixed(2)}%)`,
      position: 'outside',
    },
    legend: {
      position: 'bottom',
    },
  };

  if (loading) {
    return <Spin size="large" className="flex items-center justify-center min-h-screen" />;
  }

  return (
    <Card className="w-full bg-blue-200 rounded-lg shadow-md">
      <Row gutter={[16, 16]} className="mb-4">
        <Col span={24}>
          <Select
            className="w-full"
            placeholder="Select Subject"
            value={selectedSubject}
            onChange={setSelectedSubject}
            options={subjects.map(subject => ({
              value: subject._id,
              label: `${subject.name} (${subject.code})`
            }))}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card type="inner" title="Daily Attendance">
            <Column {...barChartConfig} height={300} />
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <Card type="inner" title="Overall Attendance">
            <Pie {...pieChartConfig} height={300} />
          </Card>
        </Col>

        <Col xs={24}>
          <Card type="inner" title="Summary Statistics">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Total Days: </Text>
                <Text>{overallStats.totalDays}</Text>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Avg. Attendance: </Text>
                <Text>{overallStats.avgAttendance} students</Text>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Highest Attendance: </Text>
                <Text>{overallStats.highestAttendance} students</Text>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Lowest Attendance: </Text>
                <Text>{overallStats.lowestAttendance} students</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default AttendanceReport;