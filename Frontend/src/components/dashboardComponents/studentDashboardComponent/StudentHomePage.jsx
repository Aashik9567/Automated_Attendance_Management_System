import React from 'react';
import { Line, Column, Pie } from '@ant-design/charts';
import { Card, Row, Col, Typography, Select } from 'antd';

const { Title } = Typography;

const StudentHomePage = () => {
  const lineChartData = [
    { month: 'Apr', attendance: 250 },
    { month: 'May', attendance: 450 },
    { month: 'Jun', attendance: 360 },
    { month: 'Jul', attendance: 450 },
    { month: 'Aug', attendance: 320 },
    { month: 'Sep', attendance: 370.5 }
  ];

  const leaveTypesData = [
    { leaveType: 'Sick Leave', count: 5 },
    { leaveType: 'Vacation', count: 10 },
    { leaveType: 'Personal', count: 3 },
  ];

  const lineChartConfig = {
    data: lineChartData,
    xField: 'month',
    yField: 'attendance',
    smooth: true,
    color: '#4169E1',
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: '#4169E1',
        stroke: '#fff',
        lineWidth: 2,
      },
    },
    area: {
      style: {
        fill: 'l(270) 0:#fff 0.5:#e6f7ff 1:#4169E1',
        fillOpacity: 0.3,
      },
    },
    yAxis: {
      max: 550,
      grid: {
        line: {
          style: {
            stroke: '#e5e7eb',
            lineWidth: 1,
            lineDash: [4, 4],
          },
        },
      },
    },
    tooltip: {
      showMarkers: false,
    },
  };

  const pieChartConfig = {
    data: leaveTypesData.map((item, index) => ({
      type: item.leaveType,
      value: item.count,
      color: ['rgb(74, 222, 128)', 'rgb(96, 165, 250)', 'rgb(251, 191, 36)'][index % 3],
    })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <Title level={2} className="m-0">Attendance Overview</Title>
        <Select
          defaultValue="last6months"
          className="w-40"
          options={[
            { value: 'last6months', label: 'Last 6 months' },
            { value: 'last3months', label: 'Last 3 months' },
            { value: 'lastyear', label: 'Last year' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Overall Attendance', value: '95%', change: '+5%', color: 'bg-indigo-500' },
          { title: 'On-time Rate', value: '85%', change: '-2%', color: 'bg-blue-500' },
          { title: 'Leave Requests', value: '78%', change: '+3%', color: 'bg-orange-500' },
          { title: 'Productivity', value: '92%', change: '+1%', color: 'bg-green-500' }
        ].map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-xl shadow-lg p-6 text-white`}>
            <h4 className="mb-2 text-2xl font-semibold">{stat.value}</h4>
            <p className="text-lg font-medium">{stat.title}</p>
            <p className="mt-2 text-sm font-medium">{stat.change} vs last month</p>
          </div>
        ))}
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className="shadow-md rounded-xl" title="Attendance Trends">
            <Line {...lineChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="shadow-md rounded-xl" title="Leave Distribution">
            <Pie {...pieChartConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentHomePage;