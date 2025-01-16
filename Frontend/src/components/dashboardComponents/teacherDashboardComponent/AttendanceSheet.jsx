import React, { useState } from 'react';
import {  
  Button, 
  Table, 
  Tag, 
  DatePicker, 
  Space, 
  Popconfirm,
  message 
} from 'antd';

const AttendanceSheet = () => {
  const [attendanceDate, setAttendanceDate] = useState();
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: 'Aashik Kumar Mahato', present: true },
    { id: 2, name: 'Bhawana Adhikari', present: false },
    { id: 3, name: 'Mandeep Kumar Mishra', present: true },
    { id: 4, name: 'Rensa Neupane', present: true },
  ]);


  const handleAttendanceChange = (id) => {
    setAttendanceData(attendanceData.map(student => 
      student.id === id ? {...student, present: !student.present} : student
    ));
  };


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'present',
      key: 'status',
      render: (present) => (
        <Tag color={present ? 'green' : 'red'}>
          {present ? 'Present' : 'Absent'}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => handleAttendanceChange(record.id)}
          >
            Change Status
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDeleteStudent(record.id)}
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-blue-200 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <DatePicker 
          value={attendanceDate}
          onChange={(date) => setAttendanceDate(date)}
          className="mr-4"
        />
      </div>

      <Table 
        columns={columns} 
        dataSource={attendanceData} 
        rowKey="id"
      />

        
    </div>
  );
};

export default AttendanceSheet;