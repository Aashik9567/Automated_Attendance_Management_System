import React from 'react';
import { Line, Column, Pie } from '@ant-design/charts';
import { Card, Row, Col, Typography } from 'antd';

const { Title } = Typography;

const StudentHomePage = () => {
  const leaveTypesData = [
    { leaveType: 'Sick Leave', count: 5 },
    { leaveType: 'Vacation', count: 10 },
    { leaveType: 'Personal', count: 3 },
  ];

  const barChartData = [
    { name: 'Jan', attendance: 85 },
    { name: 'Feb', attendance: 90 },
    { name: 'Mar', attendance: 88 },
    { name: 'Apr', attendance: 92 },
    { name: 'May', attendance: 95 },
    { name: 'Jun', attendance: 89 },
  ];

  const lineChartData = [
    { month: 'Jan', type: 'Present', value: 85 },
    { month: 'Jan', type: 'Late', value: 10 },
    { month: 'Jan', type: 'Absent', value: 5 },
    { month: 'Feb', type: 'Present', value: 80 },
    { month: 'Feb', type: 'Late', value: 15 },
    { month: 'Feb', type: 'Absent', value: 5 },
    // Add other months similarly
  ];

  const lineChartConfig = {
    data: lineChartData,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    color: ['#8884d8', '#82ca9d', '#ff7300'],
  };

  const barChartConfig = {
    data: barChartData,
    xField: 'name',
    yField: 'attendance',
    color: 'rgba(74, 222, 128,1)',
  };

  const pieChartConfig = {
    data: leaveTypesData.map((item, index) => ({
      type: item.leaveType,
      value: item.count,
      color: ['rgb(74, 222, 128)', 'rgb(96, 165, 250)', 'rgb(251, 191, 36)'][index % 3],
    })),
    angleField: 'value',
    colorField: 'type',
  };

  return (
    <div className="p-6 bg-stone-300">
       <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                {['bg-indigo-400', 'bg-blue-400', 'bg-orange-400', 'bg-green-400'].map((color, index) => (
                  <div key={index} className={`${color} rounded-lg shadow-md p-6 text-white`}>
                    <h4 className="mb-2 text-2xl font-semibold">{['95%', '85%', '78%', '92%'][index]}</h4>
                    <p className="text-lg">{['Overall Attendance', 'On-time Rate', 'Leave Requests', 'Productivity'][index]}</p>
                    <p className="mt-2 text-sm">{['+5%', '-2%', '+3%', '+1%'][index]} vs last month</p>
                  </div>
                ))}        
              </div>

      <Card className="mb-8" title="Monthly Attendance Trends">
        <Line {...lineChartConfig} />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Monthly Attendance Record">
            <Column {...barChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Attendance Statistics">
            <Pie {...pieChartConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentHomePage;