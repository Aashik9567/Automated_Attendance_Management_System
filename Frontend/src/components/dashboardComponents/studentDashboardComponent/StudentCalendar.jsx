import React, { useState } from 'react';
import { Input, Button, Card } from 'antd';
import { SearchOutlined, LeftOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import NepaliDate from 'nepali-date-converter';

const StudentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new NepaliDate());
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchDate, setSearchDate] = useState('');

  // Nepali calendar reference data
  const nepaliMonths = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangshir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];

  const nepaliDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Nepali calendar days in each month for year 2080-2081
  const daysInMonth = {
    2080: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2081: [31, 31, 32, 32, 31, 30, 30, 30, 30, 29, 30, 30]
  };

  // Sample events data
  const events = {
    '2081-07-20': { title: 'Team Meeting', type: 'work' },
    '2081-07-25': { title: 'Birthday Party', type: 'celebration' },
    '2081-07-15': { title: 'Project Deadline', type: 'deadline' },
  };

  // Function to get days in current month
  const getDaysInMonth = (bsDate) => {
    const year = bsDate.getYear();
    const month = bsDate.getMonth();
    
    // Default to 2081 if year not found
    return daysInMonth[year]?.[month] || daysInMonth[2081][month];
  };

  const generateCalendarDays = () => {
    const year = currentDate.getYear();
    const month = currentDate.getMonth();
    const startDay = new NepaliDate(year, month, 1).getDay();
    const totalDays = getDaysInMonth(currentDate);
    
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(new NepaliDate(year, month, i));
    }
    return days;
  };

  const handlePrevMonth = () => {
    const newDate = new NepaliDate(currentDate.getYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new NepaliDate(currentDate.getYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
  };

  const handleDateSearch = () => {
    try {
      const [year, month, day] = searchDate.split('-').map(num => parseInt(num));
      const newDate = new NepaliDate(year, month - 1, day);
      setCurrentDate(newDate);
      setSelectedDate(newDate);
    } catch (error) {
      console.error('Invalid date format');
    }
  };

  const getEventType = (date) => {
    if (!date) return null;
    const dateStr = `${date.getYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return events[dateStr]?.type;
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8" style={{ background: 'linear-gradient(to bottom right, #4F46E5, #9333EA)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card 
          className="backdrop-blur-lg"
          style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '1.5rem',
            border: 'none'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h3 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-3xl font-bold text-white"
            >
              <CalendarOutlined className="mr-2" />
              Nepali Calendar
            </motion.h3>
          </div>

          <div className="flex gap-2 mb-6">
            <Input
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              placeholder="Search date (YYYY-MM-DD)..."
              style={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'transparent',
                color: 'white'
              }}
            />
            <Button 
              onClick={handleDateSearch}
              icon={<SearchOutlined />}
              style={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'transparent',
                color: 'white'
              }}
            />
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={handlePrevMonth}
                icon={<LeftOutlined />}
                type="text"
                style={{ color: 'white' }}
              />
              <h4 className="text-xl font-bold text-white">
                {nepaliMonths[currentDate.getMonth()]} {currentDate.getYear()}
              </h4>
              <Button
                onClick={handleNextMonth}
                icon={<RightOutlined />}
                type="text"
                style={{ color: 'white' }}
              />
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {nepaliDays.map(day => (
                <div key={day} className="text-sm font-medium text-center text-white">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((date, index) => {
                const eventType = getEventType(date);
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    className={`
                      aspect-square p-1 rounded-lg text-center relative
                      ${date === null ? 'invisible' : ''}
                      ${selectedDate?.getDate() === date?.getDate() ? 'bg-white bg-opacity-25' : ''}
                      ${eventType ? 'ring-2 ring-opacity-50 ring-offset-2 ring-offset-transparent' : ''}
                      hover:bg-white hover:bg-opacity-10
                    `}
                    onClick={() => date && setSelectedDate(date)}
                    disabled={!date}
                  >
                    {date && (
                      <span className="text-sm font-medium text-white">
                        {date.getDate()}
                      </span>
                    )}
                    {eventType && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-2 h-2 mx-auto mt-1 rounded-full ${
                          eventType === 'work' ? 'bg-blue-400' :
                          eventType === 'celebration' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {selectedDate && events[`${selectedDate.getYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 mt-4 rounded-lg"
                style={{ background: 'rgba(255, 255, 255, 0.2)' }}
              >
                <h4 className="text-lg font-semibold text-white">
                  {events[`${selectedDate.getYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`].title}
                </h4>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentCalendar;