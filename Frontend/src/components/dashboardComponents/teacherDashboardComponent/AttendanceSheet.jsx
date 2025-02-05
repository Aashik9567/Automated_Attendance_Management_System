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
import { ReactTyped } from 'react-typed';
import { 
  UserOutlined, 
  CalendarOutlined, 
  BookOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined ,
  SyncOutlined
} from '@ant-design/icons';
import store from '../../../zustand/loginStore';
import useAttendanceStore from '/Users/aashiqmahato/Documents/Codes/Attendance Management System/Frontend/src/zustand/attendanceStore.js';
import { motion } from 'framer-motion';
// Create axios instance with default config


const AttendanceSheet = () => {
  const [subjects, setSubjects] = useState([]);
  const {loginUserData }= store(state => state);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(moment());
  const [attendanceData, setAttendanceData] = useState([]);
  const [recognizedStudents, setRecognizedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { attendanceRecords, addAttendanceRecord } = useAttendanceStore();
  const api = axios.create({
    baseURL: loginUserData.baseURL,
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
        const response = await api.get('/subjects');
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
    <div className="min-h-screen p-4 rounded-xl md:p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="mx-auto space-y-8 max-w-7xl"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative p-8 overflow-hidden border shadow-2xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
        
        <div className="relative">
          <div className="flex items-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="mr-4"
            >
              <CalendarOutlined className="text-3xl text-purple-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text">
              <ReactTyped
                strings={["Attendance Management Portal"]}
                typeSpeed={40}
                showCursor={false}
              />
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
              <label className="block font-medium text-blue-200">Subject</label>
              <Select
                placeholder="Select Subject"
                className="w-full"
                onChange={value => setSelectedSubject(value)}
                options={subjects.map(subject => ({
                  value: subject._id,
                  label: isMobile ? subject.name : `${subject.name} (${subject.code})`
                }))}
                popupClassName="bg-slate-200 border-white/10"
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
              <label className="block font-medium text-blue-200">Date</label>
              <DatePicker
                className="w-full"
                value={attendanceDate}
                onChange={date => setAttendanceDate(date)}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Attendance Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="overflow-hidden border shadow-2xl bg-white/5 backdrop-blur-xl rounded-3xl border-white/10"
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
          loading={loading}
          rowKey="id"
          className="custom-dark-table"
          rowClassName="hover:bg-white/5 transition-colors"
          pagination={{
            className: 'custom-dark-pagination',
            position: ['bottomRight']
          }}
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div
          className="flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleAttendanceSubmit}
            disabled={!selectedSubject || attendanceData.length === 0}
            className="h-auto px-8 py-2 border-0 bg-gradient-to-r from-blue-600 to-purple-500"
            type="secondary"
          >
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-2"
            >
              <CheckCircleOutlined />
              <span>Submit Attendance</span>
            </motion.span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AttendanceSheet;