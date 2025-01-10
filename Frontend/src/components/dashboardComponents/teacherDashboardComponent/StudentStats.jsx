import React from 'react';
import { Card, Statistic, Progress, Row, Col, Tooltip, Badge } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  ReadOutlined, 
  SafetyCertificateOutlined,
  RocketOutlined,
  AlertOutlined
} from '@ant-design/icons';

const StudentStats = () => {
  // Mock data - in a real application, this would come from an API or backend
  const studentData = {
    totalStudents: 450,
    averageAttendance: 88.5,
    studentsAtRisk: 15,
    graduationRate: 95,
    newEnrollments: 120,
    internshipPlacements: 75
  };

  return (
    <Card 
      title="Student Performance Dashboard" 
      style={{ 
        header: {
          backgroundColor: '#f0f2f5',
          borderBottom: '2px solid #1890ff',
        },
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
      }}
    >
      <Row gutter={[16, 16]}>
        {/* Total Students */}
        <Col xs={24} sm={12} md={8}>
          <Card 
            hoverable 
            style={{ 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' 
            }}
          >
            <Statistic
              title={
                <div style={{ color: '#ffffff', fontWeight: 'bold' }}>
                  Total Students
                </div>
              }
              value={studentData.totalStudents}
              prefix={<UserOutlined style={{ color: '#ffffff', fontSize: '24px' }} />}
              valueStyle={{ color: '#ffffff', fontSize: '24px' }}
            />
          </Card>
        </Col>

        {/* Average Attendance */}
        <Col xs={24} sm={12} md={8}>
          <Card 
            hoverable 
            style={{ 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' 
            }}
          >
            <Statistic
              title={
                <div style={{ color: '#ffffff', fontWeight: 'bold' }}>
                  Average Attendance
                </div>
              }
              value={`${studentData.averageAttendance}%`}
              prefix={<TeamOutlined style={{ color: '#ffffff', fontSize: '24px' }} />}
              suffix={
                <Tooltip title="Improvement from last semester">
                  <Badge 
                    count={"+5.36%"} 
                    style={{ 
                      backgroundColor: '#52c41a', 
                      color: '#ffffff' 
                    }} 
                  />
                </Tooltip>
              }
              valueStyle={{ color: '#ffffff', fontSize: '24px' }}
            />
          </Card>
        </Col>

        {/* Students at Risk */}
        <Col xs={24} sm={12} md={8}>
          <Card 
            hoverable 
            style={{ 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #ff8a78 0%, #ff6a88 100%)' 
            }}
          >
            <Statistic
              title={
                <div style={{ color: '#ffffff', fontWeight: 'bold' }}>
                  Students at Risk
                </div>
              }
              value={studentData.studentsAtRisk}
              prefix={<AlertOutlined style={{ color: '#ffffff', fontSize: '24px' }} />}
              valueStyle={{ color: '#ffffff', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Statistics Row */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Graduation Rate"
            value={`${studentData.graduationRate}%`}
            prefix={<SafetyCertificateOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="New Enrollments"
            value={studentData.newEnrollments}
            prefix={<RocketOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Internship Placements"
            value={studentData.internshipPlacements}
            prefix={<ReadOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Col>
      </Row>

      {/* Attendance Overview Progress */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Attendance Overview</h3>
        <Progress
          percent={studentData.averageAttendance}
          status="active"
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          style={{ 
            borderRadius: '10px', 
            overflow: 'hidden' 
          }}
        />
      </div>
    </Card>
  );
};

export default StudentStats;