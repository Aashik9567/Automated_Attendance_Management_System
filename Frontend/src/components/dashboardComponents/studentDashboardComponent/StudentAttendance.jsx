import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Tag, Table, Grid } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  CalendarOutlined,
  BookOutlined,
  PieChartOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { ReactTyped } from 'react-typed';
import dayjs from 'dayjs';
import { Pie, Column } from '@ant-design/plots'; // Changed from Bar to Column for better visualization
import store from '../../../zustand/loginStore';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// Add glassmorphism styles
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
};


const StudentAttendance = () => {
  const screens = useBreakpoint();
  const [attendanceData, setAttendanceData] = useState([]);
  const [subjectStats, setSubjectStats] = useState([]);
  const { loginUserData } = store(state => state);
  
  const api = axios.create({
    baseURL: loginUserData.baseURL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  useEffect(() => {
    if (attendanceData.length > 0) {
      const stats = Object.entries(
        attendanceData.reduce((acc, curr) => {
          if (!acc[curr.subject]) {
            acc[curr.subject] = { present: 0, absent: 0, total: 0 };
          }
          acc[curr.subject][curr.status]++;
          acc[curr.subject].total++;
          return acc;
        }, {})
      ).flatMap(([subject, data]) => ([
        {
          subject,
          status: 'Present',
          count: data.present,
          percentage: Math.round((data.present / data.total) * 100)
        },
        {
          subject,
          status: 'Absent',
          count: data.absent,
          percentage: Math.round((data.absent / data.total) * 100)
        }
      ]));
      
      setSubjectStats(stats);
    }
  }, [attendanceData]);
  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const { data } = await api.get('/attendance/student');
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
  
  // Modified bar chart configuration
  const barConfig = {
    data: subjectStats,
    xField: 'subject',
    yField: 'count',
    seriesField: 'status',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: ['#52c41a', '#ff4d4f'],
    label: {
      position: 'top', // Changed from 'middle' to 'top'
      style: {
        fill: '#000000',
        fontSize: screens.xs ? 10 : 12,
        opacity: 0.6,
      },
    },
    legend: {
      position: screens.xs ? 'bottom' : 'top-right',
      itemHeight: screens.xs ? 8 : 12,
    },
    xAxis: {
      label: {
        autoRotate: true,
        style: {
          fontSize: screens.xs ? 10 : 12,
          fill: '#666',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fontSize: screens.xs ? 10 : 12,
          fill: '#666',
        },
      },
    },
    tooltip: {
      customContent: (title, items) => {
        const tooltipData = items.map(item => ({
          color: item.color,
          name: item.name,
          value: item.value,
          percentage: subjectStats.find(
            (stat) => stat.subject === title && stat.status === item.name
          )?.percentage || 0
        }));
  
        return (
          <div style={{ padding: '8px' }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{title}</div>
            {tooltipData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    marginRight: '8px',
                  }}
                />
                <span>{`${item.name}: ${item.value} (${item.percentage}%)`}</span>
              </div>
            ))}
          </div>
        );
      },
    },
  };
  const columns = [
    {
      title: <div className="flex items-center gap-1 text-sm md:text-base"><CalendarOutlined /> Date</div>,
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <span className="text-xs md:text-sm">
          {dayjs(date).format(screens.xs ? 'DD/MM/YY' : 'DD MMM YYYY')}
        </span>
      ),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      responsive: ['sm'],
    },
    {
      title: <div className="flex items-center gap-1 text-sm md:text-base"><BookOutlined /> Subject</div>,
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => (
        <span className="text-xs md:text-sm">{subject}</span>
      ),
      filters: [
        { text: 'Mathematics', value: 'Mathematics' },
        { text: 'Physics', value: 'Physics' },
      ],
      onFilter: (value, record) => record.subject.includes(value),
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          icon={status === 'present' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={status === 'present' ? 'success' : 'error'}
          className="flex items-center gap-1 text-xs font-medium md:text-sm"
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => (
        <span className="text-xs md:text-sm">
          {dayjs(timestamp).format(screens.xs ? 'DD/MM HH:mm' : 'DD MMM YYYY HH:mm')}
        </span>
      ),
      responsive: ['lg'],
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-2 md:p-6 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-xl"
    >
      <div className="mx-auto max-w-7xl">
        {/* Animated Header with Glassmorphism */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="p-4 mb-4 text-center md:mb-8 rounded-2xl"
          style={glassStyle}
        >
          <Title level={2} className="!mb-2 !text-xl md:!text-4xl flex items-center justify-center gap-2">
            <ReactTyped
              strings={['Attendance Tracker', 'Academic Presence', 'Learning Journey']}
              typeSpeed={40}
              backSpeed={50}
              loop
            />
          </Title>
          <Text className="block px-2 text-sm text-gray-700 md:text-lg">
            Your comprehensive attendance history
          </Text>
        </motion.div>

        {/* Data Visualization Section */}
        <div className="grid gap-4 mb-4 md:gap-6 md:mb-8 md:grid-cols-2">

          {/* Bar Chart with Glassmorphism */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative p-3 overflow-hidden md:p-6 rounded-xl"
            style={glassStyle}
          >
            <div className="flex items-center gap-2 mb-3">
              <BarChartOutlined className="text-base text-blue-600 md:text-xl" />
              <Text strong className="text-sm md:text-lg">Subject-wise Attendance</Text>
            </div>
            <Column {...barConfig} height={screens.xs ? 200 : screens.md ? 300 : 250} />
          </motion.div>
        </div>

        {/* Attendance Table with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-2 mb-4 md:p-6 rounded-xl"
          style={glassStyle}
        >
          <Table
            dataSource={attendanceData}
            columns={columns}
            pagination={{ 
              pageSize: screens.xs ? 5 : 10, 
              showSizeChanger: false,
              size: screens.xs ? 'small' : 'default',
            }}
            bordered={false}
            scroll={{ x: 'max-content' }}
            size={screens.xs ? 'small' : 'middle'}
            title={() => (
              <div className="flex items-center gap-2 text-sm md:text-lg">
                <CheckCircleOutlined className="text-green-600" />
                Records: {attendanceData.length}
              </div>
            )}
            className="attendance-table-glass" // Add custom CSS for table styling
          />
        </motion.div>

        {/* Analytics Footer with Glassmorphism */}
        <motion.div
          className="relative p-3 mt-4 overflow-hidden text-center md:p-6 md:mt-6 rounded-xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          style={{
            ...glassStyle,
            background: 'rgba(59, 130, 246, 0.2)',
          }}
        >
          <Title level={3} className="!text-gray-800 !mb-2 text-base md:text-xl">
            📊 Quick Stats
          </Title>
          <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4">
            {[
              { label: 'Total Days', value: attendanceData.length, color: 'text-blue-700' },
              { 
                label: 'Present', 
                value: attendanceData.filter(a => a.status === 'present').length, 
                color: 'text-green-700' 
              },
              { 
                label: 'Absent', 
                value: attendanceData.filter(a => a.status === 'absent').length, 
                color: 'text-red-700' 
              },
              { 
                label: 'Percentage', 
                value: `${Math.round((attendanceData.filter(a => a.status === 'present').length / 
                  attendanceData.length) * 100) || 0}%`,
                color: 'text-purple-700'
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="p-2 rounded-lg md:p-3"
                style={{
                  ...glassStyle,
                  background: 'rgba(255, 255, 255, 0.15)',
                }}
              >
                <Text className="block text-xs text-gray-700 md:text-sm">{stat.label}</Text>
                <Text strong className={`text-lg md:text-2xl ${stat.color}`}>
                  {stat.value}
                </Text>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Add custom CSS for table styling
// Add these styles to your custom CSS
const additionalStyles = `
  .ant-chart-container {
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
  }

  .ant-chart-container:hover {
    backdrop-filter: blur(12px);
  }

  .ant-tooltip {
    backdrop-filter: blur(8px);
    background: rgba(255, 255, 255, 0.9);
  }
`;
const customStyles = `
  .attendance-table-glass .ant-table {
    background: transparent !important;
  }
  
  .attendance-table-glass .ant-table-thead > tr > th {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  }
  
  .attendance-table-glass .ant-table-tbody > tr > td {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  }
  
  .attendance-table-glass .ant-table-tbody > tr:hover > td {
    background: rgba(255, 255, 255, 0.15) !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = customStyles + additionalStyles;
  document.head.appendChild(styleSheet);
}

export default StudentAttendance;