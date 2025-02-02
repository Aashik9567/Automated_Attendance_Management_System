import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import axios from 'axios';
import { message } from 'antd';

const Holiday = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const getHolidayStatus = (startDate, endDate) => {
    const today = dayjs();
    if (today.isBefore(startDate)) return 'upcoming';
    if (today.isAfter(endDate)) return 'passed';
    return 'ongoing';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-6 bg-gradient-to-br from-blue-50/90 to-indigo-50/90"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
          🎉 Upcoming Holidays
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {holidays.map((holiday) => {
            const status = getHolidayStatus(dayjs(holiday.startDate), dayjs(holiday.endDate));
            const statusColors = {
              upcoming: 'bg-orange-100 text-orange-800',
              ongoing: 'bg-green-100 text-green-800',
              passed: 'bg-gray-100 text-gray-600',
            };

            return (
              <motion.div
                key={holiday._id}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="p-6 transition-shadow shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl hover:shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-blue-600">{holiday.title}</h3>
                  <span className={`${statusColors[status]} px-3 py-1 rounded-full text-sm`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <p className="mb-4 text-gray-600">{holiday.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-500">
                    <div>📅 Starts: {dayjs(holiday.startDate).format('MMM D, YYYY')}</div>
                    <div>📅 Ends: {dayjs(holiday.endDate).format('MMM D, YYYY')}</div>
                  </div>
                  <span className="text-2xl">
                    {status === 'ongoing' ? '🎉' : '📅'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Holiday;