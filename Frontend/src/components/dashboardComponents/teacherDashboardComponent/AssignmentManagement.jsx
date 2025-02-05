import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Modal, Form, Input, Select, DatePicker,  Table, Tag, message, Typography, Upload 
} from 'antd';
import { 
  PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { motion} from 'framer-motion';
import axios from 'axios';
import store from '../../../zustand/loginStore';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AssignmentManagement = () => {
  const { loginUserData } = store((state) => state);  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAssignments();
    fetchSubjects();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`${loginUserData.baseURL}/assignments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setAssignments(res.data.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch assignments');
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${loginUserData.baseURL}/subjects`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setSubjects(res.data.data);
    } catch (error) {
      message.error('Failed to fetch subjects');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('subject', values.subject);
      formData.append('dueDate', values.dueDate.format('YYYY-MM-DD'));
      values.attachments?.fileList?.forEach((file) => {
        formData.append('files', file.originFileObj);
      });

      await axios.post(
        `${loginUserData.baseURL}/assignments`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      message.success('Assignment created successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchAssignments();
    } catch (error) {
      message.error('Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Text strong className="text-lg">{text}</Text>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => <Tag color="blue">{subject.name}</Tag>,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => <span>{new Date(date).toLocaleDateString()}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          <Button type="primary" icon={<EditOutlined />} className="bg-blue-500">Edit</Button>
          <Button danger icon={<DeleteOutlined />}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <motion.div className="min-h-screen p-4 bg-gray-100 md:p-6">
      <Card className="p-4 rounded-lg shadow-lg md:p-6">
        <div className="flex flex-col items-center justify-between mb-4 md:flex-row">
          <Title level={3} className="text-center md:text-left">Assignment Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Create Assignment
          </Button>
        </div>
        <Table 
          columns={columns} 
          dataSource={assignments} 
          rowKey="_id" 
          pagination={{ pageSize: 5 }} 
          className="overflow-x-auto"
        />
      </Card>

      <Modal
        title="Create New Assignment"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-4">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter assignment title" />
          </Form.Item>
          <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
            <Select placeholder="Select subject">
              {subjects.map((subject) => <Option key={subject._id} value={subject._id}>{subject.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="attachments" label="Attachments">
            <Upload maxCount={3} listType="picture" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Files</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-500">Create</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default AssignmentManagement;