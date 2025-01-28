import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Spin, message, Badge, Tooltip, Table, Select } from 'antd';
import { UserOutlined, TeamOutlined, AlertOutlined, SafetyCertificateOutlined, } from '@ant-design/icons';

const StudentStats = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageAttendance: 0,
    attendanceBySubject: [],
    semesterDistribution: {},
    totalSubjects: 0
  });

  const subjectColumns = [
    {
      title: 'Subject',
      dataIndex: 'subjectName',
      key: 'subjectName',
    },
    {
      title: 'Code',
      dataIndex: 'subjectCode',
      key: 'subjectCode',
    },
    {
      title: 'Attendance Rate',
      dataIndex: 'attendanceRate',
      key: 'attendanceRate',
      render: (rate) => (
        <Progress 
          percent={Number(rate)} 
          size="small" 
          status={rate < 75 ? 'exception' : 'success'}
        />
      ),
    },
    {
      title: 'Total Classes',
      dataIndex: 'totalClasses',
      key: 'totalClasses',
    },
  ];


  return (
    <div className="space-y-4">
      <Card className="shadow-lg rounded-xl">

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={14} md={12}>
            <Card 
              hoverable 
              className="rounded-lg bg-gradient-to-r from-blue-400 to-blue-600"
            >
              <Statistic
                title={<div className="font-bold text-white">Total Students</div>}
                value={stats.totalStudents}
                prefix={<UserOutlined className="text-2xl text-white" />}
                valueStyle={{ color: '#ffffff', fontSize: '24px' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={14} md={12}>
            <Card 
              hoverable 
              className="rounded-lg bg-gradient-to-r from-green-400 to-green-600"
            >
              <Statistic
                title={<div className="font-bold text-white">Average Attendance</div>}
                value={stats.averageAttendance}
                prefix={<TeamOutlined className="text-2xl text-white" />}
                suffix="%"
                valueStyle={{ color: '#ffffff', fontSize: '24px' }}
              />
            </Card>
          </Col>

        </Row>

        <div className="mt-8">
          <Card title="Subject-wise Attendance" className="rounded-lg">
            <Table 
              columns={subjectColumns} 
              rowKey="subjectCode"
              pagination={false}
              className="overflow-x-auto"
            />
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default StudentStats;