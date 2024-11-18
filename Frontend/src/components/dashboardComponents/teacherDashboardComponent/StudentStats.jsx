import React from 'react';
import { Row, Col, Statistic, Card, Progress } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  ReadOutlined 
} from '@ant-design/icons';

const StudentStats = () => {
  return (
    <Card title="Student Statistics">
      <Row gutter={16}>
        <Col span={8}>
          <Statistic 
            title="Total Students" 
            value={120} 
            prefix={<UserOutlined />} 
          />
        </Col>
        <Col span={8}>
          <Statistic 
            title="Average Attendance" 
            value="85%" 
            suffix={<span style={{ color: '#3f8600' }}>+5.36%</span>} 
            prefix={<TeamOutlined />} 
          />
        </Col>
        <Col span={8}>
          <Statistic 
            title="Students at Risk" 
            value={5} 
            prefix={<ReadOutlined />} 
          />
        </Col>
      </Row>
      
      <div style={{ marginTop: 16 }}>
        <h3>Attendance Overview</h3>
        <Progress 
          percent={85} 
          success={{ percent: 85, strokeColor: '#52c41a' }} 
          strokeColor="#ff4d4f"
        />
      </div>
    </Card>
  );
};

export default StudentStats;
