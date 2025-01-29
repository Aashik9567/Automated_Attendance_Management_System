import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Spin, message } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import axios from 'axios';

const StudentStats = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageAttendance: 0,
    attendanceBySubject: [],
    totalSubjects: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch total students
      const studentsRes = await axios.get('http://localhost:8080/api/v1/users/students', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const totalStudents = studentsRes.data.data.length;

      // Fetch teacher's subjects
      const subjectsRes = await axios.get('http://localhost:8080/api/v1/subjects/getsubject', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const subjects = subjectsRes.data.data;
      const totalSubjects = subjects.length;

      // Process each subject's attendance
      const attendanceBySubject = [];
      let totalAttendanceRate = 0;

      for (const subject of subjects) {
        const attendanceRes = await axios.get(`http://localhost:8080/api/v1/attendance/subject/${subject._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const attendanceRecords = attendanceRes.data;

        const studentPresence = {};
        attendanceRecords.forEach(record => {
          record.students.forEach(student => {
            if (!studentPresence[student.student]) {
              studentPresence[student.student] = { present: 0, total: 0 };
            }
            studentPresence[student.student].total += 1;
            if (student.status === 'present') {
              studentPresence[student.student].present += 1;
            }
          });
        });

        const rates = Object.values(studentPresence).map(s => (s.present / s.total) * 100);
        const averageRate = rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;
        totalAttendanceRate += averageRate;

        attendanceBySubject.push({
          subjectName: subject.name,
          subjectCode: subject.code,
          attendanceRate: averageRate,
          totalClasses: attendanceRecords.length
        });
      }

      // Calculate overall average attendance
      const averageAttendance = totalSubjects > 0 ? totalAttendanceRate / totalSubjects : 0;

      setStats({
        totalStudents,
        averageAttendance,
        attendanceBySubject,
        totalSubjects
      });
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const subjectColumns = [
    { title: 'Subject', dataIndex: 'subjectName', key: 'subjectName' },
    { title: 'Code', dataIndex: 'subjectCode', key: 'subjectCode' },
    {
      title: 'Attendance Rate',
      dataIndex: 'attendanceRate',
      key: 'attendanceRate',
      render: rate => (
        <Progress 
          percent={Number(rate.toFixed(2))} 
          size="small" 
          status={rate < 75 ? 'exception' : 'success'}
        />
      )
    },
    { title: 'Total Classes', dataIndex: 'totalClasses', key: 'totalClasses' }
  ];

  if (loading) return <Spin size="large" className="flex justify-center mt-8" />;

  return (
    <div className="space-y-4">
      <Card className="shadow-lg rounded-xl">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12}>
            <Card hoverable className="rounded-lg bg-gradient-to-r from-blue-400 to-blue-600">
              <Statistic
                title={<div className="font-bold text-white">Total Students</div>}
                value={stats.totalStudents}
                prefix={<UserOutlined className="text-2xl text-white" />}
                valueStyle={{ color: '#ffffff', fontSize: '24px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Card hoverable className="rounded-lg bg-gradient-to-r from-green-400 to-green-600">
              <Statistic
                title={<div className="font-bold text-white">Average Attendance</div>}
                value={stats.averageAttendance.toFixed(2)}
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
              dataSource={stats.attendanceBySubject}
              rowKey="subjectCode"
              pagination={false}
            />
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default StudentStats;