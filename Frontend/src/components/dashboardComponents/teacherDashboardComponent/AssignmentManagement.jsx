import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Select, DatePicker, Table, Tag, message, Typography, Upload ,Grid} from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import dayjs from 'dayjs';
import store from '../../../zustand/loginStore';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

const AssignmentManagement = () => {
  const screens = useBreakpoint();
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
      render: (text) => (
        <div className="max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
          <Text strong className="text-sm sm:text-base line-clamp-2">
            {text}
          </Text>
        </div>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      responsive: ['sm'],
      render: (subject) => (
        <Tag color="blue" className="text-xs sm:text-sm">
          {subject.name}
        </Tag>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => (
        <span className="text-xs sm:text-sm whitespace-nowrap">
          {dayjs(date).format('YYYY-MM-DD')}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-1 flex-nowrap sm:gap-2">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            className="px-2 text-xs bg-blue-500 sm:text-sm sm:px-3"
          >
            {screens.sm ? 'Edit' : ''}
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            className="px-2 text-xs sm:text-sm sm:px-3"
          >
            {screens.sm ? 'Delete' : ''}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <motion.div 
      className="min-h-screen p-2 rounded-lg sm:p-4 md:p-6 sm:rounded-xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className="p-3 rounded-md shadow-lg sm:p-4 md:p-6 sm:rounded-lg backdrop-blur-sm bg-white/90"
      >
        <div className="flex flex-col gap-4 mb-4 sm:gap-6 md:mb-6 md:flex-row md:items-center md:justify-between">
          <Title level={3} className="!text-xl sm:!text-2xl md:!text-3xl !mb-0 text-center md:text-left">
            Assignment Management
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            className="self-center h-8 px-3 text-sm md:self-auto sm:text-base sm:px-4 sm:h-9"
          >
            Create Assignment
          </Button>
        </div>

        <div className="-mx-3 overflow-x-auto sm:-mx-4">
          <Table 
            columns={columns} 
            dataSource={assignments} 
            rowKey="_id" 
            loading={loading}
            pagination={{ 
              pageSize: 5,
              responsive: true,
              showSizeChanger: false,
              className: "px-3 sm:px-4"
            }} 
            className="min-w-full"
            scroll={{ x: 'max-content' }}
            size={screens.sm ? "middle" : "small"}
          />
        </div>
      </Card>

      <Modal
        title={
          <Text className="text-lg font-semibold sm:text-xl">
            Create New Assignment
          </Text>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={screens.sm ? 520 : "95%"}
        className="responsive-modal"
        destroyOnClose
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit} 
          className="space-y-3 sm:space-y-4"
        >
          <Form.Item 
            name="title" 
            label={<span className="text-sm sm:text-base">Title</span>} 
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input 
              placeholder="Enter assignment title" 
              className="text-sm sm:text-base"
            />
          </Form.Item>

          <Form.Item 
            name="subject" 
            label={<span className="text-sm sm:text-base">Subject</span>} 
            rules={[{ required: true, message: 'Please select subject' }]}
          >
            <Select 
              placeholder="Select subject"
              className="text-sm sm:text-base"
            >
              {subjects.map((subject) => (
                <Option key={subject._id} value={subject._id}>
                  {subject.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="description" 
            label={<span className="text-sm sm:text-base">Description</span>} 
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea 
              rows={screens.sm ? 4 : 3} 
              placeholder="Enter description"
              className="text-sm sm:text-base"
            />
          </Form.Item>

          <Form.Item 
            name="dueDate" 
            label={<span className="text-sm sm:text-base">Due Date</span>} 
            rules={[{ required: true, message: 'Please select due date' }]}
          >
            <DatePicker 
              className="w-full text-sm sm:text-base" 
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item 
            name="attachments" 
            label={<span className="text-sm sm:text-base">Attachments</span>}
          >
            <Upload 
              maxCount={3} 
              listType="picture" 
              beforeUpload={() => false}
              className="text-sm sm:text-base"
            >
              <Button 
                icon={<UploadOutlined />}
                className="h-8 text-sm sm:text-base sm:h-9"
              >
                Upload Files
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item className="!mb-0">
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button 
                onClick={() => setIsModalVisible(false)}
                className="h-8 text-sm sm:text-base sm:h-9"
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                className="h-8 text-sm bg-blue-500 sm:text-base sm:h-9"
              >
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

// Add these styles to your CSS file or create a new style tag
const styles = `
  .responsive-modal .ant-modal-content {
    padding: 16px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
  }

  @media (min-width: 640px) {
    .responsive-modal .ant-modal-content {
      padding: 24px;
    }
  }

  .ant-table-cell {
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .ant-table-cell {
      padding: 8px !important;
      font-size: 0.875rem;
    }
    
    .ant-table-thead > tr > th {
      padding: 8px !important;
      font-size: 0.875rem;
    }
  }

  .ant-modal-mask {
    backdrop-filter: blur(4px);
  }

  .ant-upload-list-item {
    font-size: 0.875rem;
  }

  @media (max-width: 640px) {
    .ant-upload-list-item {
      font-size: 0.75rem;
    }
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default AssignmentManagement;