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
  CloseCircleOutlined 
} from '@ant-design/icons';
import useAttendanceStore from '/Users/aashiqmahato/Documents/Codes/Attendance Management System/Frontend/src/zustand/attendanceStore.js';

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
        <div className="flex items-center text-gray-600">
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
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="w-full max-w-6xl mx-auto">
        <div className="p-4 mb-4 transition-all duration-500 transform bg-white shadow-2xl md:p-8 md:mb-8 rounded-2xl hover:shadow-3xl">
          <h2 className="flex items-center mb-4 text-xl font-bold text-gray-800 md:mb-6 md:text-3xl">
            <CalendarOutlined className="mr-2 text-blue-600 md:mr-4" />
            Attendance Management
          </h2>
          <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-gray-700">Select Subject</label>
              <Select
                placeholder="Choose Subject"
                className="w-full"
                onChange={(value) => setSelectedSubject(value)}
                options={subjects.map(subject => ({
                  value: subject._id,
                  label: isMobile 
                    ? `${subject.name}` 
                    : `${subject.name} (${subject.code})`
                }))}
                suffixIcon={<BookOutlined className="text-blue-500" />}
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Select Date</label>
              <DatePicker 
                value={attendanceDate}
                onChange={(date) => setAttendanceDate(date)}
                className="w-full"
                placeholder="Pick Attendance Date"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto transition-all duration-500 transform bg-white shadow-xl rounded-2xl hover:shadow-2xl">
          <Table 
            columns={columns}
            dataSource={attendanceData}
            rowKey="id"
            loading={loading}
            scroll={{ x: 'max-content' }}
            locale={{ 
              emptyText: 'Select a subject to view students' 
            }}
            rowClassName="transition-all duration-300 hover:bg-blue-50"
            className="w-full"
          />
        </div>

        <div className="mt-4 text-center md:mt-6 md:text-right">
          <Button 
            type="primary" 
            size="large" 
            onClick={handleAttendanceSubmit}
            disabled={attendanceData.length === 0 || !selectedSubject}
            className="w-full transition-all duration-300 transform bg-green-600 shadow-md md:w-auto hover:bg-green-700 hover:scale-105 hover:shadow-lg"
          >
            Submit Attendance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSheet;