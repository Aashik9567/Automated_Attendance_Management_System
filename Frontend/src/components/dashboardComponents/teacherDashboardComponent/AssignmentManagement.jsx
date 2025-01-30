
import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Modal, Form, Input, Select, DatePicker, 
  Table, Tag, message, Spin, Typography, Upload 
} from 'antd';
import { 
  PlusOutlined, FileTextOutlined, CalendarOutlined,
  UploadOutlined, DeleteOutlined, EditOutlined,CheckCircleOutlined,
  CloseCircleOutlined, LoadingOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AssignmentManagement = () => {
  // ... existing state variables
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
      const res = await axios.get('http://localhost:8080/api/v1/assignments', {
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
      const res = await axios.get('http://localhost:8080/api/v1/subjects/getsubject', {
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
      
      // Append basic fields
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('subject', values.subject);
      formData.append('dueDate', values.dueDate.format('YYYY-MM-DD'));
      
      // Append files
      values.attachments?.fileList?.forEach((file) => {
        formData.append('files', file.originFileObj);
      });

      await axios.post(
        'http://localhost:8080/api/v1/assignments',
        formData,
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      message.success({
        content: 'Assignment created successfully',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      });
      setIsModalVisible(false);
      form.resetFields();
      fetchAssignments();
    } catch (error) {
      message.error({
        content: 'Failed to create assignment',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      });
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <Text strong className="text-lg">
          <FileTextOutlined className="mr-2 text-blue-500" />
          {text}
        </Text>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => (
        <Tag color="blue" className="px-3 py-1 text-sm">
          {subject.name}
        </Tag>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => (
        <span className="flex items-center">
          <CalendarOutlined className="mr-2 text-green-500" />
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const isOverdue = new Date(record.dueDate) < new Date();
        return (
          <Tag color={isOverdue ? 'red' : 'green'} className="px-3 py-1">
            {isOverdue ? 'Overdue' : 'Active'}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="space-x-2">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            className="bg-blue-500"
          >
            Edit
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <Card 
        className="transition-all duration-300 shadow-xl rounded-xl backdrop-blur-lg bg-white/90 hover:shadow-2xl"
        title={
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <Title level={3} className="mb-0 text-gradient">
              Assignment Management
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
              className="transition-all duration-300 transform bg-blue-500 hover:bg-blue-600 hover:scale-105"
            >
              Create Assignment
            </Button>
          </motion.div>
        }
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-64"
            >
              <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
              <Text className="mt-4">Loading assignments...</Text>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Table
                columns={columns}
                dataSource={assignments}
                rowKey="_id"
                className="transition-all duration-300"
                rowClassName="hover:bg-blue-50 transition-colors duration-200"
                pagination={{
                  pageSize: 8,
                  className: "pb-4"
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Create Assignment Modal */}
      <Modal
        title="Create New Assignment"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        className="rounded-lg"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="title"
            label="Assignment Title"
            rules={[{ required: true, message: 'Please enter assignment title' }]}
          >
            <Input 
              prefix={<FileTextOutlined className="text-gray-400" />}
              placeholder="Enter assignment title"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please select a subject' }]}
          >
            <Select placeholder="Select subject" className="rounded-lg">
              {subjects.map((subject) => (
                <Option key={subject._id} value={subject._id}>
                  {subject.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea 
              rows={4}
              placeholder="Enter assignment description"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select due date' }]}
          >
            <DatePicker 
              className="w-full rounded-lg"
              disabledDate={(current) => current && current < Date.now()}
            />
          </Form.Item>

          <Form.Item
            name="attachments"
            label="Attachments"
          >
            <Upload
              maxCount={3}
              listType="picture"
              beforeUpload={() => false}
              className="rounded-lg"
            >
              <Button icon={<UploadOutlined />} className="rounded-lg">
                Upload Files
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item className="flex justify-end mb-0 space-x-2">
            <Button 
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Create Assignment
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .text-gradient {
          background: linear-gradient(to right, #2563eb, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </motion.div>
  );
};

export default AssignmentManagement;