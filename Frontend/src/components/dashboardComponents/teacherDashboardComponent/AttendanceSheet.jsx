import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, 
  Tag, 
  DatePicker, 
  Select, 
  Button, 
  message,
} from 'antd';
import moment from 'moment';
import { 
  UserOutlined, 
  CalendarOutlined, 
  BookOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined ,
  SyncOutlined
} from '@ant-design/icons';
import useAttendanceStore from '/Users/aashiqmahato/Documents/Codes/Attendance Management System/Frontend/src/zustand/attendanceStore.js';
import { motion } from 'framer-motion';
import { variants, itemVariants } from './animationVariants.js'
// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AttendanceSheet = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(moment());
  const [attendanceData, setAttendanceData] = useState([]);
  const [recognizedStudents, setRecognizedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { attendanceRecords, addAttendanceRecord } = useAttendanceStore();

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/subjects/getsubject');
        if (response.data?.data) {
          setSubjects(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load subjects:', error);
        message.error('Failed to load subjects');
      }
    };
    fetchSubjects();
  }, []);

  // Load students when subject changes
  useEffect(() => {
    if (selectedSubject) {
      loadStudents();
    }
  }, [selectedSubject, attendanceRecords]);

const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/students');
      
      // Add null checks and validation
      const latestRecord = attendanceRecords
        .filter(record => 
          record && 
          record.subjects && 
          Array.isArray(record.subjects) && 
          record.subjects.some(subject => subject && subject._id === selectedSubject)
        )
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

      const studentsWithAttendance = response.data.data.map(student => ({
        id: student._id,
        name: student.fullName,
        semester: student.semester,
        present: false,
        confidence: 0
      }));
  // Update with recognition data if available
      if (latestRecord && Array.isArray(latestRecord.students)) {
        studentsWithAttendance.forEach(student => {
          const recognizedStudent = latestRecord.students.find(
            rs => rs && rs.name && student.name && 
                 rs.name.toLowerCase().trim() === student.name.toLowerCase().trim()
          );
          if (recognizedStudent) {
            student.present = recognizedStudent.confidence >= 0.75;
            student.confidence = recognizedStudent.confidence;
          }
        });
        setRecognizedStudents(latestRecord.students);
      } else {
        setRecognizedStudents([]);
      }

      setAttendanceData(studentsWithAttendance);
      message.success(`Loaded ${studentsWithAttendance.length} students`);
    } catch (error) {
      console.error('Failed to load students:', error);
      message.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };


  const handleAttendanceSubmit = async () => {
    try {
      if (!selectedSubject || !attendanceDate || !attendanceData?.length) {
        message.error('Please ensure all required fields are filled');
        return;
      }

      const attendancePayload = {
        subjectId: selectedSubject,
        date: attendanceDate.toDate(),
        students: attendanceData.map(student => ({
          student: student.id,
          status: student.present ? 'present' : 'absent',
          confidence: student.confidence || null
        }))
      };

      // Get current subject details
      const currentSubject = subjects.find(subject => subject._id === selectedSubject);
      
      // Submit attendance
      const response = await api.post('/attendance/markattendance', attendancePayload);

      if (response.data) {
        const recognitionResults = attendanceData.map(student => ({
          name: student.name,
          confidence: student.confidence
        }));

        // Add to store with current subject
        addAttendanceRecord(recognitionResults, currentSubject, null);
        message.success('Attendance marked successfully!');
        
        // Optionally refresh the student list
        await loadStudents();
      }
    } catch (error) {
      console.error('Attendance submission error:', error);
      if (error.response?.data?.message) {
        message.error(`Error: ${error.response.data.message}`);
      } else {
        message.error('Failed to mark attendance. Please try again.');
      }
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      responsive: ['md'],
      render: (name, record) => {
        const recognizedStudent = recognizedStudents.find(
          rs => rs.name.toLowerCase().trim() === name.toLowerCase().trim()
        );
        return (
          <div className="flex items-center transition-all duration-300 transform hover:scale-105">
            <UserOutlined className="mr-2 text-blue-500" />
            {name}
            {recognizedStudent && (
              <Tag color="blue" className="hidden ml-2 md:inline">
                {(record.confidence * 100).toFixed(2)}% Confidence
              </Tag>
            )}
          </div>
        );
      }
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      responsive: ['md'],
      render: (semester) => (
        <div className="flex items-center text-gray-800">
          <BookOutlined className="mr-2 text-green-500" />
          {semester}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'present',
      key: 'status',
      render: (present, record) => (
        <Tag 
          icon={present ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={present ? 'green' : 'red'} 
          className="transition-all duration-300 transform hover:scale-110"
        >
          {present ? 'Present' : 'Absent'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          onClick={() => {
            setAttendanceData(prev => 
              prev.map(student => 
                student.id === record.id 
                  ? { ...student, present: !student.present } 
                  : student
              )
            );
          }}
          type="link"
          className="text-blue-600 transition-colors duration-300 hover:text-blue-800"
        >
          Toggle
        </Button>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div className="w-full">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 mb-4 bg-gray-100 shadow-2xl md:p-8 md:mb-8 rounded-2xl backdrop-blur-lg bg-opacity-90"
        >
          <div className="flex items-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="mr-4"
            >
              <CalendarOutlined className="text-3xl text-blue-600" />
            </motion.div>
            <motion.h1
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text md:text-4xl"
            >
              Attendance Portal
            </motion.h1>
          </div>
  
          <motion.div
            className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block mb-2 font-medium text-gray-700">Subject</label>
              <Select
                placeholder="Select Subject"
                className="w-full"
                suffixIcon={
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <BookOutlined className="text-blue-500" />
                  </motion.div>
                }
                options={subjects.map(subject => ({
                  value: subject._id,
                  label: isMobile 
                    ? `${subject.name}` 
                    : `${subject.name} (${subject.code})`
                }))}
                onChange={(value) => setSelectedSubject(value)}
              />
            </motion.div>
  
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block mb-2 font-medium text-gray-700">Date</label>
              <DatePicker
                className="w-full"
                value={attendanceDate}
                onChange={(date) => setAttendanceDate(date)}
                suffixIcon={
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <CalendarOutlined className="text-blue-500" />
                  </motion.div>
                }
              />
            </motion.div>
          </motion.div>
        </motion.div>
  
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="overflow-hidden bg-gray-100 shadow-xl rounded-2xl backdrop-blur-lg bg-opacity-90"
      >
        <Table
          columns={[
            {
              title: 'Student',
              key: 'mobile-view',
              responsive: ['xs'],
              render: (_, record) => (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      <UserOutlined className="mr-2 text-blue-500" />
                      {record.name.split(' ')[0]} {/* Show first name only */}
                    </span>
                    <span className="text-xs text-gray-700">
                      Sem {record.semester}
                    </span>
                  </div>
                  <Tag 
                    icon={record.present ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    color={record.present ? 'green' : 'red'}
                    className="ml-2"
                  >
                    {isMobile ? '' : record.present ? 'Present' : 'Absent'}
                  </Tag>
                </div>
              )
            },
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              responsive: ['md'],
              render: (name, record) => (
                <div className="flex items-center">
                  <UserOutlined className="mr-2 text-blue-500" />
                  {name}
                  {recognizedStudents.some(rs => 
                    rs.name.toLowerCase() === name.toLowerCase()
                  ) && (
                    <Tag color="blue" className="hidden ml-2 md:inline">
                      {(record.confidence * 100).toFixed(2)}%
                    </Tag>
                  )}
                </div>
              )
            },
            {
              title: 'Semester',
              dataIndex: 'semester',
              key: 'semester',
              responsive: ['md'],
              render: (semester) => (
                <div className="flex items-center">
                  <BookOutlined className="mr-2 text-green-500" />
                  {semester}
                </div>
              )
            },
            {
              title: 'Status',
              dataIndex: 'present',
              key: 'status',
              responsive: ['md'],
              render: (present) => (
                <Tag 
                  icon={present ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  color={present ? 'green' : 'red'}
                >
                  {present ? 'Present' : 'Absent'}
                </Tag>
              )
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Button 
                  onClick={() => {
                    setAttendanceData(prev => 
                      prev.map(student => 
                        student.id === record.id 
                          ? { ...student, present: !student.present } 
                          : student
                      )
                    );
                  }}
                  type="link"
                  className="p-0"
                >
                  {isMobile ? (
                    <SyncOutlined className="text-blue-600" />
                  ) : (
                    <span className="text-blue-600">Toggle</span>
                  )}
                </Button>
              )
            }
          ]}
          dataSource={attendanceData}
          rowKey="id"
          loading={loading}
          scroll={{ x: true }}
          locale={{ emptyText: 'Select a subject to view students' }}
          rowClassName="group hover:bg-blue-50 transition-colors duration-200"
          pagination={{ 
            position: ['bottomRight'],
            showSizeChanger: false,
            pageSizeOptions: ['10', '20', '50'],
            className: 'px-4 py-2',
            responsive: true
          }}
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div
        className="mt-6 text-center md:text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button 
          type="primary"
          size="large"
          onClick={handleAttendanceSubmit}
          disabled={attendanceData.length === 0 || !selectedSubject}
          className="w-full font-semibold text-white transition-all duration-300 transform shadow-lg md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
        >
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center justify-center gap-2"
          >
            <CheckCircleOutlined />
            <span className="hidden md:inline">Submit Attendance</span>
            <span className="md:hidden">Submit</span>
          </motion.span>
        </Button>
      </motion.div>
      </div>
    </motion.div>
  );
};

export default AttendanceSheet;