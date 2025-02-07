import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, Typography, Table, Grid,
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
  CloudUploadOutlined, EyeOutlined, CheckCircleOutlined, ClockCircleOutlined, FilePdfOutlined,
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
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ReactTyped } from 'react-typed';
import store from '../../../zustand/loginStore';
dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const StudentAssignmentViewer = () => {
  const screens = useBreakpoint();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { loginUserData } = store((state) => state);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `${loginUserData.baseURL}/assignments`, 
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
        `${loginUserData.baseURL}/assignments/${selectedAssignment._id}/submit`,
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

  const responsiveColumns = () => {
    const baseColumns = [
      {
        title: 'Assignment',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <div className="flex flex-col">
            <Text strong className="text-base md:text-lg">{text}</Text>
            <Text type="secondary" className="text-xs md:text-sm">
              {record.subject.name}
            </Text>
          </div>
        ),
      },
      {
        title: 'Due Date',
        dataIndex: 'dueDate',
        key: 'dueDate',
        responsive: ['md'],
        render: (date) => (
          <Tooltip title={dayjs(date).format('MMMM D, YYYY h:mm A')}>
            <span className="flex items-center">
              <CalendarOutlined className="mr-2" />
              {dayjs(date).format(screens.md ? 'MMM D, YYYY' : 'MM/DD/YY')}
            </span>
          </Tooltip>
        ),
      },
      {
        title: 'Status',
        key: 'status',
        responsive: ['sm'],
        render: (_, record) => getStatusTag(record),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space direction={screens.md ? 'horizontal' : 'vertical'}>
            <Tooltip title="View Details">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => {
                  setSelectedAssignment(record);
                  setDrawerVisible(true);
                }}
                className="text-xs bg-blue-500 hover:bg-blue-600 md:text-base"
                size={screens.md ? 'default' : 'small'}
              >
                {screens.md ? 'View' : <EyeOutlined />}
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
                  className="text-xs hover:border-blue-500 hover:text-blue-500 md:text-base"
                  size={screens.md ? 'default' : 'small'}
                >
                  {screens.md ? 'Submit' : <CloudUploadOutlined />}
                </Button>
              </Tooltip>
            )}
          </Space>
        ),
      },
    ];

    return baseColumns.filter(col => !col.responsive || col.responsive.some(br => screens[br]));
  };

  const downloadFile = (url) => {
    window.open(url, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-xl"
    >
      <Card className="border shadow-xl rounded-xl backdrop-blur-lg bg-white/5 border-white/10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Title level={3} className="mb-4 text-lg text-transparent md:mb-6 md:text-2xl text-gradient bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text">
            <ReactTyped className='text-blue-400'
              strings={["My Assignments", "Academic Tasks", "Learning Progress"]}
              typeSpeed={50}
              backSpeed={30}
              loop
            />
          </Title>
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
              <Text className="mt-4 text-blue-200">Loading assignments...</Text>
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
                columns={responsiveColumns()}
                dataSource={assignments}
                rowKey="_id"
                className="transition-all duration-300"
                rowClassName="hover:bg-white/5 transition-colors duration-200"
                pagination={{
                  pageSize: 8,
                  className: "pb-4",
                  showSizeChanger: false
                }}
                scroll={{ x: true }}
                size={screens.md ? 'default' : 'middle'}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <Drawer
        title={
          <Text strong className="text-lg text-transparent md:text-xl text-gradient bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text">
            {selectedAssignment?.title}
          </Text>
        }
        placement="right"
        width={screens.md ? 600 : '100%'}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="assignment-drawer backdrop-blur-lg bg-white/5"
      >
        {selectedAssignment && (
          <div className="space-y-4 md:space-y-6">
            <Descriptions bordered column={1} size={screens.md ? 'default' : 'small'}>
              <Descriptions.Item label="Subject">
                {selectedAssignment.subject.name}
              </Descriptions.Item>
              <Descriptions.Item label="Due Date">
                {dayjs(selectedAssignment.dueDate).format(
                  screens.md ? 'MMMM D, YYYY h:mm A' : 'MMM D, YYYY'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {getStatusTag(selectedAssignment)}
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Title level={5} className="text-base text-blue-200 md:text-lg">Description</Title>
              <Paragraph className="p-2 text-sm rounded-lg md:p-4 md:text-base bg-white/5">
                {selectedAssignment.description}
              </Paragraph>
            </div>

            {selectedAssignment.attachments?.length > 0 && (
              <div>
                <Title level={5} className="text-base text-blue-200 md:text-lg">Attachments</Title>
                <div className="space-y-2">
                  {selectedAssignment.attachments.map((file, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-2 text-sm rounded-lg md:p-3 md:text-base bg-white/5 hover:bg-white/10"
                    >
                      <div className="flex items-center truncate">
                        {getFileIcon(file)}
                        <Text className="ml-2 text-blue-200 truncate">{file.split('/').pop()}</Text>
                      </div>
                      <Button
                        type="link"
                        icon={<DownloadOutlined className="text-blue-400" />}
                        onClick={() => downloadFile(file)}
                        size="small"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {selectedAssignment.submissions?.find(
              sub => sub.student === localStorage.getItem('userId')
            ) && (
              <div>
                <Title level={5} className="text-blue-200">Your Submission</Title>
                <Card className="bg-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <Text strong className="text-blue-200">Submitted successfully</Text>
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
                      <Paragraph className="mt-4 text-blue-200">
                        <strong>Feedback:</strong>
                        <div className="p-3 mt-2 rounded-lg bg-white/5">
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
            <CloudUploadOutlined className="text-lg text-blue-500 md:text-xl" />
            <span className="text-base text-transparent md:text-lg text-gradient bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text">Submit Assignment</span>
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
          className: "bg-blue-500 hover:bg-blue-600 text-xs md:text-base"
        }}
        okText="Submit"
        className="submission-modal backdrop-blur-lg bg-white/5"
        destroyOnClose
        width={screens.md ? 600 : '90%'}
      >
        <div className="p-2 text-center md:p-4">
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
            className="px-2 py-4 text-xs md:px-4 md:py-8 md:text-base bg-white/5"
          >
            <p className="text-2xl text-blue-200 md:text-3xl">
              <InboxOutlined />
            </p>
            <p className="text-sm text-blue-200 md:text-lg">Click or drag file to upload</p>
            <p className="text-xs text-blue-300 md:text-sm">Support for PDF, DOC, DOCX, and image files</p>
          </Upload.Dragger>
          
          {uploadFile && uploadProgress > 0 && (
            <Progress percent={uploadProgress} status="active" className="mt-2 md:mt-4" />
          )}
        </div>
      </Modal>
    </motion.div>
  );
};

export default StudentAssignmentViewer;