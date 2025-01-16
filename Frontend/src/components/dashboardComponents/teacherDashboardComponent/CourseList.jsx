import React, { useState } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  List, 
  message, 
  Popconfirm,
  Tag,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const CourseList = () => {
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      name: 'Advanced Electronics', 
      code: 'EX 707', 
      students: 35,
      description: 'Advanced course exploring complex electronic systems and signal processing techniques.'
    },
    { 
      id: 2, 
      name: 'Digital Signal Processing', 
      code: 'EX 703', 
      students: 40,
      description: 'In-depth study of digital signal analysis, filtering, and transformation methods.'
    },
    { 
      id: 3, 
      name: 'Computer Networks', 
      code: 'EX 705', 
      students: 38,
      description: 'Comprehensive exploration of network architectures, protocols, and security.'
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({});
  const [form] = Form.useForm();

  const showModal = (course) => {
    if (course) {
      setIsEditMode(true);
      setCurrentCourse(course);
      form.setFieldsValue(course);
    } else {
      setIsEditMode(false);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (isEditMode) {
          setCourses(courses.map(course => 
            course.id === currentCourse.id ? { ...course, ...values } : course
          ));
          message.success('Course updated successfully');
        } else {
          const newCourse = { 
            ...values, 
            id: courses.length + 1 
          };
          setCourses([...courses, newCourse]);
          message.success('Course added successfully');
        }
        handleCancel();
      })
      .catch(errorInfo => {
        console.log('Validation Failed:', errorInfo);
      });
  };

  const handleDelete = (id) => {
    setCourses(courses.filter(course => course.id !== id));
    message.success('Course deleted successfully');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-blue-200 rounded-lg shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <Title level={3}>Your Courses</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => showModal()}
        >
          Add New Course
        </Button>
      </div>

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={courses}
        renderItem={(course) => (
          <List.Item>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                actions={[
                  <Tooltip title="Edit Course">
                    <EditOutlined key="edit" onClick={() => showModal(course)} />
                  </Tooltip>,
                  <Popconfirm
                    title="Are you sure to delete this course?"
                    onConfirm={() => handleDelete(course.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Tooltip title="Delete Course">
                      <DeleteOutlined key="delete" />
                    </Tooltip>
                  </Popconfirm>,
                  <Tooltip title="Course Details">
                    <InfoCircleOutlined key="info" />
                  </Tooltip>
                ]}
              >
                <Card.Meta 
                  title={
                    <div className="flex justify-between">
                      <span>{course.name}</span>
                      <Tag color="blue">{course.code}</Tag>
                    </div>
                  }
                  description={
                    <div>
                      <Text type="secondary">{course.description}</Text>
                      <div className="mt-2 text-right">
                        <Text strong>{course.students} students</Text>
                      </div>
                    </div>
                  }
                />
              </Card>
            </motion.div>
          </List.Item>
        )}
      />

      <Modal
        title={isEditMode ? "Edit Course" : "Add New Course"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {isEditMode ? "Update" : "Add"}
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Course Name"
            rules={[{ required: true, message: 'Please input course name' }]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>
          
          <Form.Item
            name="code"
            label="Course Code"
            rules={[{ required: true, message: 'Please input course code' }]}
          >
            <Input placeholder="Enter course code" />
          </Form.Item>
          
          <Form.Item
            name="students"
            label="Number of Students"
            rules={[{ required: true, message: 'Please input number of students' }]}
          >
            <Input type="number" placeholder="Enter number of students" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Course Description"
          >
            <Input.TextArea rows={4} placeholder="Enter course description" />
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default CourseList;