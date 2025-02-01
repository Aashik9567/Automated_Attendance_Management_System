import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const TeacherHolidayAnnouncement = () => {
  const [form] = Form.useForm();
  const [holidays, setHolidays] = useState([]);

  const onFinish = (values) => {
    const newHoliday = {
      ...values,
      startDate: values.dates[0].format('YYYY-MM-DD'),
      endDate: values.dates[1].format('YYYY-MM-DD'),
    };
    setHolidays([...holidays, newHoliday]);
    message.success('Holiday announced successfully!');
    form.resetFields();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-6 bg-gradient-to-br from-blue-50/90 to-indigo-50/90"
    >
      <div className="mx-auto space-y-6 max-w-7xl">
        {/* Announcement Form */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="p-6 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl"
        >
          <h2 className="mb-6 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            🎉 Announce New Holiday
          </h2>
          
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              name="title"
              label="Holiday Title"
              rules={[{ required: true, message: 'Please enter holiday title' }]}
            >
              <Input placeholder="Enter holiday name" className="h-12 rounded-xl" />
            </Form.Item>

            <Form.Item
              name="dates"
              label="Holiday Period"
              rules={[{ required: true, message: 'Please select dates' }]}
            >
              <DatePicker.RangePicker
                className="w-full h-12 rounded-xl"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Add holiday details..."
                className="rounded-xl"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Announce Holiday
            </Button>
          </Form>
        </motion.div>

        {/* Existing Holidays */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {holidays.map((holiday, index) => (
            <div
              key={index}
              className="p-6 transition-shadow shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-blue-600">{holiday.title}</h3>
                <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                  {dayjs(holiday.endDate).diff(holiday.startDate, 'day') + 1} days
                </span>
              </div>
              <p className="mb-4 text-gray-600">{holiday.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>📅 {dayjs(holiday.startDate).format('MMM D')}</span>
                <span>➔</span>
                <span>📅 {dayjs(holiday.endDate).format('MMM D')}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TeacherHolidayAnnouncement;