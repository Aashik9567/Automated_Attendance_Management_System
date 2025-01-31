import React from 'react';
import { 
  Form, Input,  Select, 
  Button, 
  Avatar,  Typography,  Row, 
  Col, 
  Divider, 
  message 
} from 'antd';
import { CameraOutlined, SaveOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import store from '../../../zustand/loginStore';

const { Title } = Typography;

const Settings = () => {
  const { loginUserData } = store(state => state);
  const [form] = Form.useForm();

  const handleSaveChanges = () => {
    form.validateFields()
      .then(values => {
        message.success('Settings saved successfully');
      })
      .catch(errorInfo => {
        message.error('Validation failed');
      });
  };

  const initialValues = {
    ...loginUserData,
    semester: loginUserData.semester?.toString()
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 border shadow-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-lg rounded-3xl border-white/20"
    >
      <Title level={2} className="!text-4xl !mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Account Settings
      </Title>

      <Form form={form} layout="vertical" initialValues={initialValues}>
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-8">
            <Title level={4} className="!text-xl !mb-6 text-blue-800">Profile Information</Title>
            <Row align="middle" gutter={24} className="mb-6">
              <Col>
                <Avatar 
                  size={140}
                  src={loginUserData.avatar || `https://ui-avatars.com/api/?name=${loginUserData.fullName}&background=0D8ABC&color=fff`}
                  className="transition-transform border-4 border-white shadow-lg hover:scale-105"
                />
              </Col>
              <Col>
                <Button 
                  type="text" 
                  icon={<CameraOutlined className="text-blue-600" />}
                  className="flex items-center font-medium text-blue-600 hover:text-blue-800"
                  onClick={() => {/* Add profile picture logic */}}
                >
                  Change Avatar
                </Button>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item 
                  name="fullName"
                  label="Full Name"
                  rules={[{ 
                    required: true, 
                    message: 'Please input your full name',
                    pattern: /^[A-Za-z ]+$/ 
                  }]}
                  className="custom-form-item"
                >
                  <Input 
                    placeholder="John Doe"
                    className="h-12 border-gray-300 rounded-xl hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item 
                  name="email"
                  label="Email"
                  rules={[{ 
                    required: true, 
                    type: 'email', 
                    message: 'Please input a valid email' 
                  }]}
                >
                  <Input 
                    placeholder="john.doe@example.com" 
                    className="h-12 rounded-xl"
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item 
                  name="semester"
                  label="Semester"
                  rules={[{ 
                    required: true,
                    pattern: new RegExp(/^[1-8]$/),
                    message: 'Semester must be between 1-8' 
                  }]}
                >
                  <Select
                    placeholder="Select Semester"
                    className="h-12 rounded-xl"
                    options={Array.from({length: 8}, (_, i) => ({
                      value: (i+1).toString(),
                      label: `Semester ${i+1}`
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item 
                  name="role"
                  label="Account Type"
                >
                  <Select
                    className="h-12 rounded-xl"
                    disabled
                    options={[
                      { value: 'Student', label: 'Student' },
                      { value: 'Teacher', label: 'Teacher' }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </motion.div>

        <Divider className="!border-gray-200" />

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-8">
            <Title level={4} className="!text-xl !mb-6 text-blue-800">Security Settings</Title>
            
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item 
                  name="password"
                  label="New Password"
                  rules={[{ 
                    min: 6, 
                    message: 'Password must be at least 6 characters' 
                  }]}
                >
                  <Input.Password 
                    placeholder="••••••••"
                    className="h-12 rounded-xl"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item 
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('Passwords do not match!');
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    placeholder="••••••••"
                    className="h-12 rounded-xl"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <Button 
            type="primary" 
            size="large" 
            onClick={handleSaveChanges}
            icon={<SaveOutlined />}
            className="w-full transition-all shadow-lg h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
          >
            Save Changes
          </Button>
        </motion.div>
      </Form>
    </motion.div>
  );
};

export default Settings;