import React, { useState } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Table, 
  Tag, 
  DatePicker, 
  Space, 
  Popconfirm,
  message 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const AttendanceSheet = () => {
  const [attendanceDate, setAttendanceDate] = useState(moment());
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: 'Aashik Kumar Mahato', present: true },
    { id: 2, name: 'Bhawana Adhikari', present: false },
    { id: 3, name: 'Mandeep Kumar Mishra', present: true },
    { id: 4, name: 'Rensa Neupane', present: true },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAttendanceChange = (id) => {
    setAttendanceData(attendanceData.map(student => 
      student.id === id ? {...student, present: !student.present} : student
    ));
  };

  const handleAddStudent = () => {
    form.validateFields()
      .then(values => {
        const newStudent = {
          id: attendanceData.length + 1,
          name: values.studentName,
          present: false
        };
        setAttendanceData([...attendanceData, newStudent]);
        setIsModalVisible(false);
        form.resetFields();
        message.success('Student added successfully');
      })
      .catch(errorInfo => {
        console.log('Validation Failed:', errorInfo);
      });
  };

  const handleDeleteStudent = (id) => {
    setAttendanceData(attendanceData.filter(student => student.id !== id));
    message.success('Student removed successfully');
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
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <DatePicker 
          value={attendanceDate}
          onChange={(date) => setAttendanceDate(date)}
          className="mr-4"
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalVisible(true)}
        >
          Add Student
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={attendanceData} 
        rowKey="id"
      />

      <Modal
        title="Add New Student"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleAddStudent}
          >
            Add Student
          </Button>
        ]}
      >
        <Form form={form}>
          <Form.Item
            name="studentName"
            rules={[{ 
              required: true, 
              message: 'Please input student name' 
            }]}
          >
            <Input placeholder="Enter student name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AttendanceSheet;