import React, { useState } from 'react';
import { 
  Layout, 
  Form, 
  Input, 
  Select, 
  Button, 
  Avatar, 
  Typography, 
  Row, 
  Col, 
  Divider, 
  message 
} from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import store from '../../../zustand/loginStore';

const { Title } = Typography;

const Settings = () => {
  const { isLogin, loginUserData } = store(state => state);
  const [form] = Form.useForm();

  const handleSaveChanges = () => {
    form.validateFields()
      .then(values => {
        // Logic to save changes would go here
        message.success('Settings saved successfully');
      })
      .catch(errorInfo => {
        message.error('Validation failed');
      });
  };
 const response= 'https://ui-avatars.com/api/?name=Aashik+Mahato&background=0D8ABC&color=fff'
  return (
    <Layout.Content style={{ padding: '24px', backgroundColor: 'rgb(214 211 209)', borderRadius: '10px' }}>
      <Title level={3} style={{ marginBottom: 24 }}>Account Settings</Title>
      <Form form={form} layout="vertical">
        {/* Profile Information */}
        <div>
          <Title level={4} style={{ marginBottom: 16 }}>Profile Information</Title>
          <Row align="middle" gutter={16} style={{ marginBottom: 16 }}>
            <Col>
              <Avatar size={128} src={response} />
            </Col>
            <Col>
              <Button 
                type="text" 
                icon={<CameraOutlined />}
                onClick={() => {/* Logic to change profile picture */}}
              >
                Change Profile Picture
              </Button>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="fullName" 
                label="Full Name"
                rules={[{ required: true, message: 'Please input your full name' }]}
              >
                <Input placeholder="John" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="email" 
                label="Email Address"
                rules={[{ 
                  required: true, 
                  type: 'email', 
                  message: 'Please input a valid email' 
                }]}
              >
                <Input placeholder="aashik.077@example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="phoneNumber" 
                label="Phone Number"
              >
                <Input placeholder="+977980000000" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Account Security */}
        <div>
          <Title level={4} style={{ marginBottom: 16 }}>Account Security</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="newPassword" 
                label="Change Password"
                rules={[{ 
                  min: 6, 
                  message: 'Password must be at least 6 characters' 
                }]}
              >
                <Input.Password placeholder="New password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="confirmPassword" 
                label="Confirm New Password"
                dependencies={['newPassword']}
                rules={[
                  { 
                    validator: async (_, value) => {
                      const newPassword = form.getFieldValue('newPassword');
                      if (newPassword && value !== newPassword) {
                        throw new Error('Passwords do not match');
                      }
                    } 
                  }
                ]}
              >
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="twoFactor" 
                label="Two-Factor Authentication"
              >
                <Select placeholder="Select option">
                  <Select.Option value="disabled">Disabled</Select.Option>
                  <Select.Option value="sms">SMS</Select.Option>
                  <Select.Option value="app">Authenticator App</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Teaching Preferences */}
        <div>
          <Title level={4} style={{ marginBottom: 16 }}>Teaching Preferences</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="teachingMode" 
                label="Preferred Teaching Mode"
              >
                <Select placeholder="Select mode">
                  <Select.Option value="in-person">In-person</Select.Option>
                  <Select.Option value="online">Online</Select.Option>
                  <Select.Option value="hybrid">Hybrid</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="classSizePreference" 
                label="Class Size Preference"
              >
                <Select placeholder="Select size">
                  <Select.Option value="small">Small (1-15 students)</Select.Option>
                  <Select.Option value="medium">Medium (16-30 students)</Select.Option>
                  <Select.Option value="large">Large (31+ students)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Save Changes Button */}
        <Form.Item>
          <Button 
            type="primary" 
            size="large" 
            onClick={handleSaveChanges}
            block
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Layout.Content>
  );
};

export default Settings;