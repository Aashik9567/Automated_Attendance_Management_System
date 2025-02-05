import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Tag, Table } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  CalendarOutlined,
  BookOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { ReactTyped } from 'react-typed';
import dayjs from 'dayjs';
import store from '../../../zustand/loginStore';

const { Title, Text } = Typography;



const StudentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const { loginUserData } = store(state => state);
  const api = axios.create({
    baseURL: loginUserData.baseURL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const { data } = await api.get('/attendance/student');
      console.log(data);

      const transformedData = data.flatMap(record =>
        record.students
          .filter(student => student.student === loginUserData._id)
          .map(student => ({
            key: student._id,
            date: record.date,
            subject: record.subject.name,
            status: student.status,
            timestamp: student.timestamp
          }))
      );

      setAttendanceData(transformedData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const columns = [
    {
      title: <div className="flex items-center gap-2"><CalendarOutlined /> Date</div>,
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD MMM YYYY'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: <div className="flex items-center gap-2"><BookOutlined /> Subject</div>,
      dataIndex: 'subject',
      key: 'subject',
      filters: [
        { text: 'Mathematics', value: 'Mathematics' },
        { text: 'Physics', value: 'Physics' },
      ],
      onFilter: (value, record) => record.subject.includes(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          icon={status === 'present' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={status === 'present' ? 'success' : 'error'}
          className="flex items-center gap-2 font-medium"
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => dayjs(timestamp).format('DD MMM YYYY HH:mm'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Title level={2} className="!mb-3 !text-3xl md:!text-4xl flex items-center justify-center gap-3">
            <ReactTyped
              strings={[
                'Attendance Tracker',
                'Academic Presence',
                'Learning Journey'
              ]}
              typeSpeed={40}
              backSpeed={50}
              loop
            />
          </Title>
          <Text className="block px-4 text-lg text-gray-600">
            Your comprehensive attendance history with detailed timestamps
          </Text>
        </div>

        {/* Attendance Table */}
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="p-4 overflow-x-auto bg-white border shadow-xl md:p-6 rounded-xl border-blue-50"
        >
          <Table
            dataSource={attendanceData}
            columns={columns}
            pagination={{ 
              pageSize: 5, 
              showSizeChanger: false,
              itemRender: (current, type, element) => (
                <div className="font-medium text-blue-600">
                  {type === 'page' ? current : element}
                </div>
              )
            }}
            bordered
            scroll={{ x: 600 }}
            title={() => (
              <div className="flex items-center gap-3 text-lg">
                <CheckCircleOutlined className="text-green-600" />
                Total Records: {attendanceData.length}
              </div>
            )}
          />
        </motion.div>

        {/* Attendance Analytics */}
        <motion.div
          className="p-4 mt-6 text-center shadow-xl md:p-6 md:mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <Title level={3} className="!text-white !mb-2 text-lg md:text-xl">
            📊 Attendance Analytics
          </Title>
          <Text className="text-sm text-blue-100 md:text-lg">
            {attendanceData.filter(a => a.status === 'present').length} Present • 
            {attendanceData.filter(a => a.status === 'absent').length} Absent • 
            {Math.round((attendanceData.filter(a => a.status === 'present').length / 
              attendanceData.length) * 100) || 0}% Overall
          </Text>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentAttendance;
