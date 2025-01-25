import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, 
  Tag, 
  DatePicker, 
  Select, 
  Button, 
  message, 
  Modal 
} from 'antd';
import moment from 'moment';
import { 
  UserOutlined, 
  CalendarOutlined, 
  BookOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined 
} from '@ant-design/icons';

const AttendanceSheet = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(moment());
  const [attendanceData, setAttendanceData] = useState([]);
  const [recognizedStudents, setRecognizedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/subjects/getsubject', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setSubjects(response.data.data || []);
      } catch (error) {
        message.error('Failed to load subjects');
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      loadStudents();
    }
  }, [selectedSubject]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/users/students', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const studentsWithAttendance = response.data.data.map(student => ({
        id: student._id,
        name: student.fullName,
        semester: student.semester,
        present: recognizedStudents.some(rs => rs.name === student.fullName)
      }));

      setAttendanceData(studentsWithAttendance);
      message.success(`Loaded ${studentsWithAttendance.length} students`);
    } catch (error) {
      message.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceSubmit = async () => {
    try {
      const attendancePayload = {
        subjectId: selectedSubject,
        date: attendanceDate.toDate(),
        students: attendanceData.map(student => ({
          student: student.id,
          status: student.present ? 'present' : 'absent'
        }))
      };

      await axios.post('http://localhost:8080/api/v1/attendance/mark', attendancePayload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      message.success('Attendance marked successfully!');
    } catch (error) {
      message.error('Failed to mark attendance');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      responsive: ['md'],
      render: (name, record) => {
        const recognizedStudent = recognizedStudents.find(rs => rs.name === name);
        return (
          <div className="flex items-center transition-all duration-300 transform hover:scale-105">
            <UserOutlined className="mr-2 text-blue-500" />
            {name}
            {recognizedStudent && (
              <Tag color="blue" className="hidden ml-2 md:inline">
                {(recognizedStudent.confidence * 100).toFixed(2)}% Confidence
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