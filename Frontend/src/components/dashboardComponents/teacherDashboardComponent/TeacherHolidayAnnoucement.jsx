import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import axios from 'axios';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

const TeacherHolidayAnnouncement = () => {
  const [form] = Form.useForm();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:8080/api/v1/holidays', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setHolidays(data.data);
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to fetch holidays');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        startDate: values.dates[0].toISOString(),
        endDate: values.dates[1].toISOString()
      };

      if (editId) {
        await axios.put(`http://localhost:8080/api/v1/holidays/${editId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        message.success('Holiday updated successfully!');
      } else {
        await axios.post('http://localhost:8080/api/v1/holidays', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        message.success('Holiday announced successfully!');
      }
      
      setEditId(null);
      form.resetFields();
      fetchHolidays();
    } catch (error) {
      message.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/holidays/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      message.success('Holiday deleted successfully!');
      fetchHolidays();
    } catch (error) {
      message.error(error.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
            {editId ? 'Edit Holiday' : '🎉 Announce New Holiday'}
          </h2>
          
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="title"
              label="Holiday Title"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter holiday name" className="h-12 rounded-xl" />
            </Form.Item>

            <Form.Item
              name="dates"
              label="Holiday Period"
              rules={[{ required: true }]}
            >
              <DatePicker.RangePicker
                className="w-full h-12 rounded-xl"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true }]}
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
              {editId ? 'Update Holiday' : 'Publish Announcement'}
            </Button>
          </Form>
        </motion.div>

        {/* Holidays List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {holidays.map((holiday) => (
            <motion.div
              key={holiday._id}
              whileHover={{ scale: 1.02 }}
              className="relative p-6 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl"
            >
              <div className="absolute flex gap-2 top-4 right-4">
                <button 
                  onClick={() => {
                    setEditId(holiday._id);
                    form.setFieldsValue({
                      title: holiday.title,
                      description: holiday.description,
                      dates: [dayjs(holiday.startDate), dayjs(holiday.endDate)]
                    });
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEdit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(holiday._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash size={18} />
                </button>
              </div>
              
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TeacherHolidayAnnouncement;