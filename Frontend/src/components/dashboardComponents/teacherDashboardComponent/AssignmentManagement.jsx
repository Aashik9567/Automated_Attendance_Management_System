import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Table, 
  Tag, 
  message, 
  Spin,
  Typography,
  Upload 
} from 'antd';
import { 
  PlusOutlined, 
  FileTextOutlined, 
  CalendarOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AssignmentManagement = () => {
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
      await axios.post('http://localhost:8080/api/v1/assignments', {
        ...values,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card 
        className="transition-all duration-300 shadow-xl rounded-xl backdrop-blur-lg bg-white/90 hover:shadow-2xl"
        title={
          <div className="flex items-center justify-between">
            <Title level={3} className="mb-0">
              Assignment Management
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
              className="transition-colors duration-300 bg-blue-500 hover:bg-blue-600"
            >
              Create Assignment
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spin size="large" />
          </div>
        ) : (
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
        )}
      </Card>

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
    </div>
  );
};

export default AssignmentManagement;