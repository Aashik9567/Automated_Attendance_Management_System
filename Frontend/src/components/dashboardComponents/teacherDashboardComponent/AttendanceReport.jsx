import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { Column } from '@ant-design/plots';
import { Pie } from '@ant-design/plots';

const { Title, Text } = Typography;

const AttendanceReport = ({ attendanceData }) => {
  // Calculate average attendance
  const averageAttendance = attendanceData.reduce((sum, day) => sum + day.presentCount, 0) / attendanceData.length;

  // Prepare data for pie chart
  const overallAttendance = {
    present: attendanceData.reduce((sum, day) => sum + day.presentCount, 0),
    absent: attendanceData.reduce((sum, day) => sum + (day.totalStudents - day.presentCount), 0),
  };

  const pieChartData = [
    { type: 'Present', value: overallAttendance.present },
    { type: 'Absent', value: overallAttendance.absent },
  ];

  // Bar Chart Configuration
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

  // Pie Chart Configuration
  const pieChartConfig = {
    data: pieChartData,
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

  return (
    <Card 
      title="Attendance Report" 
      className="w-full bg-blue-200 rounded-lg shadow-md"
    >
      <Row gutter={[16, 16]}>
        {/* Daily Attendance Bar Chart */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card type="inner" title="Daily Attendance">
            <Column {...barChartConfig} height={300} />
          </Card>
        </Col>

        {/* Overall Attendance Pie Chart */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card type="inner" title="Overall Attendance">
            <Pie {...pieChartConfig} height={300} />
          </Card>
        </Col>

        {/* Summary Statistics */}
        <Col xs={24}>
          <Card type="inner" title="Summary Statistics">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Total Days: </Text>
                <Text>{attendanceData.length}</Text>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Avg. Attendance: </Text>
                <Text>{averageAttendance.toFixed(2)} students</Text>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Highest Attendance: </Text>
                <Text>{Math.max(...attendanceData.map(day => day.presentCount))} students</Text>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Lowest Attendance: </Text>
                <Text>{Math.min(...attendanceData.map(day => day.presentCount))} students</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default AttendanceReport;