import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Table, 
  Tag, 
  Button, 
  Modal, 
  Upload, 
  message, 
  Spin,
  Drawer,
  Space,
  Descriptions,
  Empty,
  Progress
} from 'antd';
import {
  CloudUploadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const StudentAssignmentViewer = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/assignments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setAssignments(response.data.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch assignments');
      setLoading(false);
    }
  };

  const handleSubmission = async () => {
    if (!uploadFile) {
      message.error('Please select a file to submit');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('submission', uploadFile);

    try {
      await axios.post(
        `http://localhost:8080/api/v1/assignments/${selectedAssignment._id}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      message.success('Assignment submitted successfully');
      setSubmitModalVisible(false);
      fetchAssignments();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
      setUploadFile(null);
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf': return <FilePdfOutlined className="text-red-500" />;
      case 'xlsx': return <FileExcelOutlined className="text-green-500" />;
      case 'doc':
      case 'docx': return <FileWordOutlined className="text-blue-500" />;
      default: return <FileImageOutlined className="text-gray-500" />;
    }
  };

  const getStatusTag = (assignment) => {
    const hasSubmitted = assignment.submissions?.some(
      sub => sub.student === localStorage.getItem('userId')
    );
    const isOverdue = new Date(assignment.dueDate) < new Date();

    if (hasSubmitted) {
      return <Tag icon={<CheckCircleOutlined />} color="success">Submitted</Tag>;
    }
    if (isOverdue) {
      return <Tag icon={<ClockCircleOutlined />} color="error">Overdue</Tag>;
    }
    return <Tag icon={<ClockCircleOutlined />} color="warning">Pending</Tag>;
  };

  const columns = [
    {
      title: 'Assignment',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" className="text-sm">
            {record.subject.name}
          </Text>
        </div>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => (
        <span>
          <CalendarOutlined className="mr-2" />
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => getStatusTag(record),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedAssignment(record);
              setDrawerVisible(true);
            }}
            className="bg-blue-500"
          >
            View
          </Button>
          {!record.submissions?.some(sub => sub.student === localStorage.getItem('userId')) && (
            <Button
              icon={<CloudUploadOutlined />}
              onClick={() => {
                setSelectedAssignment(record);
                setSubmitModalVisible(true);
              }}
            >
              Submit
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="shadow-xl rounded-xl backdrop-blur-lg bg-white/90">
        <Title level={3} className="mb-6">My Assignments</Title>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spin size="large" />
          </div>
        ) : assignments.length === 0 ? (
          <Empty description="No assignments found" />
        ) : (
          <Table
            columns={columns}
            dataSource={assignments}
            rowKey="_id"
            className="transition-all duration-300"
            rowClassName="hover:bg-blue-50 transition-colors duration-200"
          />
        )}
      </Card>

      <Drawer
        title={selectedAssignment?.title}
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedAssignment && (
          <div className="space-y-6">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Subject">
                {selectedAssignment.subject.name}
              </Descriptions.Item>
              <Descriptions.Item label="Due Date">
                {new Date(selectedAssignment.dueDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {getStatusTag(selectedAssignment)}
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Title level={5}>Description</Title>
              <Paragraph className="p-4 rounded-lg bg-gray-50">
                {selectedAssignment.description}
              </Paragraph>
            </div>

            {selectedAssignment.attachments?.length > 0 && (
              <div>
                <Title level={5}>Attachments</Title>
                <div className="space-y-2">
                  {selectedAssignment.attachments.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center p-2 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      {getFileIcon(file.split('.').pop())}
                      <Text className="ml-2">{file.split('/').pop()}</Text>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedAssignment.submissions?.find(sub => sub.student === localStorage.getItem('userId')) && (
              <div>
                <Title level={5}>Your Submission</Title>
                <Card className="bg-green-50">
                  <div className="flex items-center justify-between">
                    <Text>Submitted successfully</Text>
                    <CheckCircleOutlined className="text-xl text-green-500" />
                  </div>
                  {selectedAssignment.submissions[0].grade && (
                    <div className="mt-4">
                      <Progress 
                        percent={selectedAssignment.submissions[0].grade} 
                        status="active"
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                      />
                      <Paragraph className="mt-2">
                        <strong>Feedback:</strong> {selectedAssignment.submissions[0].feedback}
                      </Paragraph>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <Modal
        title="Submit Assignment"
        open={submitModalVisible}
        onCancel={() => {
          setSubmitModalVisible(false);
          setUploadFile(null);
        }}
        onOk={handleSubmission}
        okButtonProps={{ 
          loading: submitting,
          className: "bg-blue-500"
        }}
        okText="Submit"
      >
        <Upload
          beforeUpload={(file) => {
            setUploadFile(file);
            return false;
          }}
          maxCount={1}
          onRemove={() => setUploadFile(null)}
        >
          <Button icon={<CloudUploadOutlined />}>Select File</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default StudentAssignmentViewer;