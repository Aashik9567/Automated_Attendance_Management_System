// StudentAssignmentViewer.jsx
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
  Progress,
  Tooltip
} from 'antd';
import {
  CloudUploadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileImageOutlined,
  CalendarOutlined,
  LoadingOutlined,
  InboxOutlined,
  CloseCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'react-lottie';
import uploadAnimation from '../animations/upload.json';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

const StudentAssignmentViewer = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: uploadAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/assignments`, 
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        }
      );
      setAssignments(response.data.data);
    } catch (error) {
      message.error({
        content: 'Failed to fetch assignments',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmission = async () => {
    if (!uploadFile) {
      message.error('Please select a file to submit');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('files', uploadFile);

    try {
      await axios.post(
        `http://localhost:8080/api/v1/assignments/${selectedAssignment._id}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        }
      );

      message.success({
        content: 'Assignment submitted successfully',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      });
      setSubmitModalVisible(false);
      fetchAssignments();
    } catch (error) {
      message.error({
        content: error.response?.data?.message || 'Failed to submit assignment',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      });
    } finally {
      setSubmitting(false);
      setUploadFile(null);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (fileUrl) => {
    const extension = fileUrl.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FilePdfOutlined className="text-xl text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <FileExcelOutlined className="text-xl text-green-500" />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined className="text-xl text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileImageOutlined className="text-xl text-purple-500" />;
      default:
        return <FileImageOutlined className="text-xl text-gray-500" />;
    }
  };

  const getStatusTag = (assignment) => {
    const studentSubmission = assignment.submissions?.find(
      sub => sub.student === localStorage.getItem('userId')
    );
    const isOverdue = dayjs(assignment.dueDate).isBefore(dayjs());

    if (studentSubmission) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {studentSubmission.grade ? `Graded: ${studentSubmission.grade}%` : 'Submitted'}
        </Tag>
      );
    }
    if (isOverdue) {
      return <Tag icon={<ClockCircleOutlined />} color="error">Overdue</Tag>;
    }
    return (
      <Tag icon={<ClockCircleOutlined />} color="warning">
        Due {dayjs(assignment.dueDate).fromNow()}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Assignment',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="flex flex-col">
          <Text strong className="text-lg">{text}</Text>
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
        <Tooltip title={dayjs(date).format('MMMM D, YYYY h:mm A')}>
          <span className="flex items-center">
            <CalendarOutlined className="mr-2" />
            {dayjs(date).format('MMM D, YYYY')}
          </span>
        </Tooltip>
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
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedAssignment(record);
                setDrawerVisible(true);
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              View
            </Button>
          </Tooltip>
          {!record.submissions?.some(sub => sub.student === localStorage.getItem('userId')) && (
            <Tooltip title="Submit Assignment">
              <Button
                icon={<CloudUploadOutlined />}
                onClick={() => {
                  setSelectedAssignment(record);
                  setSubmitModalVisible(true);
                }}
                className="hover:border-blue-500 hover:text-blue-500"
              >
                Submit
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const downloadFile = (url) => {
    window.open(url, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <Card className="shadow-xl rounded-xl backdrop-blur-lg bg-white/90">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Title level={3} className="mb-6 text-gradient">My Assignments</Title>
        </motion.div>
        
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
          ) : assignments.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Empty 
                description="No assignments found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="my-8"
              />
            </motion.div>
          ) : (
            <motion.div
              key="table"
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

      <Drawer
        title={
          <Text strong className="text-xl">
            {selectedAssignment?.title}
          </Text>
        }
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="assignment-drawer"
      >
        {selectedAssignment && (
          <div className="space-y-6">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Subject">
                {selectedAssignment.subject.name}
              </Descriptions.Item>
              <Descriptions.Item label="Due Date">
                {dayjs(selectedAssignment.dueDate).format('MMMM D, YYYY h:mm A')}
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
                    <motion.div 
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        {getFileIcon(file)}
                        <Text className="ml-2">{file.split('/').pop()}</Text>
                      </div>
                      <Button
                        type="link"
                        icon={<DownloadOutlined />}
                        onClick={() => downloadFile(file)}
                      >
                        Download
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {selectedAssignment.submissions?.find(
              sub => sub.student === localStorage.getItem('userId')
            ) && (
              <div>
                <Title level={5}>Your Submission</Title>
                <Card className="bg-green-50">
                  <div className="flex items-center justify-between mb-4">
                    <Text strong>Submitted successfully</Text>
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
                      <Paragraph className="mt-4">
                        <strong>Feedback:</strong>
                        <div className="p-3 mt-2 bg-white rounded-lg">
                          {selectedAssignment.submissions[0].feedback || 'No feedback provided'}
                        </div>
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
        title={
          <div className="flex items-center space-x-2">
            <CloudUploadOutlined className="text-xl text-blue-500" />
            <span>Submit Assignment</span>
          </div>
        }
        open={submitModalVisible}
        onCancel={() => {
          setSubmitModalVisible(false);
          setUploadFile(null);
          setUploadProgress(0);
        }}
        onOk={handleSubmission}
        okButtonProps={{ 
          loading: submitting,
          className: "bg-blue-500 hover:bg-blue-600"
        }}
        okText="Submit"
        className="submission-modal"
      >
        <div className="p-4 text-center">
  {!uploadFile && (
    <div className="mb-4">
      <Lottie 
        options={lottieOptions}
        height={200}
        width={200}
      />
    </div>
  )}
  
  <Upload.Dragger
    maxCount={1}
    beforeUpload={(file) => {
      setUploadFile(file);
      return false;
    }}
    onRemove={() => {
      setUploadFile(null);
      setUploadProgress(0);
    }}
    fileList={uploadFile ? [uploadFile] : []}
    className="px-4 py-8"
  >
    <p className="text-3xl">
      <InboxOutlined />
    </p>
    <p className="text-lg">Click or drag file to upload</p>
    <p className="text-gray-500">Support for PDF, DOC, DOCX, and image files</p>
  </Upload.Dragger>
  
  {uploadFile && uploadProgress > 0 && (
    <Progress percent={uploadProgress} status="active" className="mt-4" />
  )}
</div>
          </Modal>
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
      </motion.div>
  );
};
export default StudentAssignmentViewer;