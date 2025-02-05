import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Spin, message } from 'antd';
import { Users, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import store from '../../../zustand/loginStore';

const StudentStats = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageAttendance: 0,
    attendanceBySubject: [],
    totalSubjects: 0
  });
  const [loading, setLoading] = useState(true);
  const { loginUserData } = store(state => state);
  const fetchData = async () => {
    try {
      // Fetch total students
      const studentsRes = await axios.get(`${loginUserData.baseURL}/users/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const totalStudents = studentsRes.data.data.length;

      // Fetch teacher's subjects
      const subjectsRes = await axios.get(`${loginUserData.baseURL}/subjects`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const subjects = subjectsRes.data.data;
      const totalSubjects = subjects.length;

      // Process each subject's attendance
      const attendanceBySubject = [];
      let totalAttendanceRate = 0;

      for (const subject of subjects) {
        const attendanceRes = await axios.get(`${loginUserData.baseURL}/attendance/subject/${subject._id}`, {
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
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-100">Total Students</p>
                        <p className="mt-2 text-3xl font-bold text-white">{stats.totalStudents}</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                </div>
            </motion.div>

            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-100">Avg Attendance</p>
                        <p className="mt-2 text-3xl font-bold text-white">
                            {stats.averageAttendance.toFixed(2)}%
                        </p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl">
                        <LineChart className="w-8 h-8 text-white" />
                    </div>
                </div>
            </motion.div>
        </div>

        <div className="p-6 bg-white shadow-sm rounded-2xl">
            <h4 className="mb-4 text-xl font-semibold text-gray-800">Subject Performance</h4>
            <Table
                columns={subjectColumns}
                dataSource={stats.attendanceBySubject}
                rowKey="subjectCode"
                pagination={false}
                rowClassName="hover:bg-gray-50 transition-colors"
                className="overflow-hidden rounded-lg"
            />
        </div>
    </div>
);
};

export default StudentStats;