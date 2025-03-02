import React, { useState } from 'react';
import { 
  Form, Input, Select, 
  Button, 
  Avatar, Typography, Row, 
  Col, 
  Divider, 
  message,
  Upload
} from 'antd';
import { 
  CameraOutlined, 
  SaveOutlined, 
  LoadingOutlined, 
  LockOutlined, 
  UserOutlined,
  MailOutlined,
  BookOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import store from '../../../zustand/loginStore';

const { Title } = Typography;

const Settings = () => {
  const { loginUserData } = store(state => state);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(loginUserData.avatar);
  const [loading, setLoading] = useState(false);

  const handleSaveChanges = () => {
    setLoading(true);
    
    setTimeout(() => {
      form.validateFields()
        .then(values => {
          setLoading(false);
          message.success({
            content: 'Settings saved successfully!',
            className: 'custom-message-success',
            style: {
              borderRadius: '10px',
            },
          });
        })
        .catch(errorInfo => {
          setLoading(false);
          message.error({
            content: 'Please check the form for errors',
            style: {
              borderRadius: '10px',
            },
          });
        });
    }, 800);
  };

  const initialValues = {
    ...loginUserData,
    semester: loginUserData.semester?.toString()
  };
  
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world
      getBase64(info.file.originFileObj, imageUrl => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const uploadButton = (
    <div className="flex flex-col items-center justify-center h-full rounded-full">
      {loading ? <LoadingOutlined /> : <CameraOutlined className="text-2xl text-blue-500" />}
      <div className="mt-2 text-xs text-blue-500">Upload</div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Background decorations */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 bg-blue-600 rounded-full w-96 h-96 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 bg-purple-600 rounded-full w-96 h-96 opacity-10 blur-3xl"></div>
        <div className="absolute w-64 h-64 bg-indigo-500 rounded-full top-1/3 left-1/4 opacity-10 blur-3xl"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-5xl mx-auto overflow-hidden border shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl border-white/20"
      >
        {/* Header Banner */}
        <div className="relative h-32 overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="absolute w-full h-full opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNMzYgMzRjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDRjMCAxLjMuNiAyLjQgMS41IDMuMUgyNVYyNGgxNXYxM2gtNS41Yy45LS43IDEuNS0xLjggMS41LTN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/80 to-transparent"></div>
        </div>

        <div className="relative px-6 pt-6 pb-10 -mt-16 md:p-10 md:-mt-16">
          {/* Title with Avatar */}
          <div className="flex flex-col items-start sm:flex-row sm:items-end">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="relative mb-4 sm:mb-0 sm:mr-6"
            >
              <div className="relative group">
                <Avatar 
                  size={120}
                  src={imageUrl || `https://ui-avatars.com/api/?name=${loginUserData.fullName}&background=0D8ABC&color=fff&size=200`}
                  className="border-4 border-white shadow-xl"
                />
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="absolute inset-0 transition-opacity opacity-0 avatar-uploader hover:opacity-100"
                  showUploadList={false}
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity rounded-full opacity-0 bg-black/50 group-hover:opacity-100">
                    <CameraOutlined className="text-2xl text-white" />
                    <span className="mt-1 text-xs font-medium text-white">Change</span>
                  </div>
                </Upload>
              </div>
            </motion.div>

            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold tracking-tight text-transparent md:text-4xl text-gradient bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-800 bg-clip-text"
              >
                Account Settings
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-1 text-gray-500"
              >
                Manage your personal information and preferences
              </motion.p>
            </div>
          </div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Form 
              form={form} 
              layout="vertical" 
              initialValues={initialValues}
              className="settings-form"
            >
              {/* Profile Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-6 mb-8 border shadow-lg md:p-8 bg-white/70 backdrop-blur-sm rounded-2xl border-white/40"
              >
                <h2 className="flex items-center text-xl font-semibold text-blue-800">
                  <UserOutlined className="mr-2 text-blue-600" />
                  Profile Information
                </h2>
                <p className="mb-6 text-sm text-gray-500">Your personal details visible to the system</p>

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item 
                      name="fullName"
                      label={
                        <span className="text-gray-700 font-medium flex items-center gap-1.5">
                          <UserOutlined className="text-blue-500" /> Full Name
                        </span>
                      }
                      rules={[{ 
                        required: true, 
                        message: 'Please input your full name',
                        pattern: /^[A-Za-z ]+$/ 
                      }]}
                    >
                      <Input 
                        placeholder="John Doe"
                        className="h-12 text-gray-800 border border-blue-100 shadow-sm rounded-xl hover:border-blue-300 focus:border-blue-500 focus:shadow-blue-100/50"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item 
                      name="email"
                      label={
                        <span className="text-gray-700 font-medium flex items-center gap-1.5">
                          <MailOutlined className="text-blue-500" /> Email Address
                        </span>
                      }
                      rules={[{ 
                        required: true, 
                        type: 'email', 
                        message: 'Please input a valid email' 
                      }]}
                    >
                      <Input 
                        placeholder="john.doe@example.com" 
                        className="h-12 text-gray-600 bg-gray-100 border border-transparent rounded-xl"
                        disabled
                        prefix={<MailOutlined className="text-gray-400" />}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item 
                      name="semester"
                      label={
                        <span className="text-gray-700 font-medium flex items-center gap-1.5">
                          <BookOutlined className="text-blue-500" /> Semester
                        </span>
                      }
                      rules={[{ 
                        required: true,
                        message: 'Please select your semester' 
                      }]}
                    >
                      <Select
                        placeholder="Select Semester"
                        className="h-12 rounded-xl"
                        options={Array.from({length: 8}, (_, i) => ({
                          value: (i+1).toString(),
                          label: `Semester ${i+1}`
                        }))}
                        dropdownStyle={{
                          borderRadius: '12px',
                          overflow: 'hidden',
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item 
                      name="role"
                      label={
                        <span className="text-gray-700 font-medium flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          Account Type
                        </span>
                      }
                    >
                      <Select
                        className="h-12 rounded-xl"
                        disabled
                        options={[
                          { value: 'Student', label: 'Student' },
                          { value: 'Teacher', label: 'Teacher' }
                        ]}
                        dropdownStyle={{
                          borderRadius: '12px',
                          overflow: 'hidden',
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </motion.div>

              {/* Security Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-6 mb-8 border shadow-lg md:p-8 bg-white/70 backdrop-blur-sm rounded-2xl border-white/40"
              >
                <h2 className="flex items-center text-xl font-semibold text-blue-800">
                  <LockOutlined className="mr-2 text-blue-600" />
                  Security Settings
                </h2>
                <p className="mb-6 text-sm text-gray-500">Update your password to secure your account</p>
                
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item 
                      name="password"
                      label={
                        <span className="text-gray-700 font-medium flex items-center gap-1.5">
                          <LockOutlined className="text-blue-500" /> New Password
                        </span>
                      }
                      rules={[{ 
                        min: 6, 
                        message: 'Password must be at least 6 characters' 
                      }]}
                    >
                      <Input.Password 
                        placeholder="••••••••"
                        className="h-12 border border-blue-100 shadow-sm rounded-xl hover:border-blue-300 focus:border-blue-500 focus:shadow-blue-100/50"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item 
                      name="confirmPassword"
                      label={
                        <span className="text-gray-700 font-medium flex items-center gap-1.5">
                          <LockOutlined className="text-blue-500" /> Confirm Password
                        </span>
                      }
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
                        className="h-12 border border-blue-100 shadow-sm rounded-xl hover:border-blue-300 focus:border-blue-500 focus:shadow-blue-100/50"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </motion.div>

              {/* Save Button */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
                className="flex justify-center"
              >
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={handleSaveChanges}
                  loading={loading}
                  icon={!loading && <SaveOutlined />}
                  className={`
                    min-w-[200px] h-14 text-base font-medium rounded-2xl shadow-xl
                    bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
                    hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700
                    border-0 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl
                    flex items-center justify-center gap-2
                  `}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </motion.div>

              {/* Last Login Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-sm text-center text-gray-500"
              >
                <p>Last login: 2025-03-02 16:24:28 | User: Aashik9567</p>
              </motion.div>
            </Form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;