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

  // Enhanced events data with upcoming festivals and holidays
  const events = {
    '2081-07-20': { title: 'Team Meeting', type: 'work' },
    '2081-07-25': { title: 'Birthday Party', type: 'celebration' },
    '2081-07-15': { title: 'Project Deadline', type: 'deadline' },
    '2081-08-15': { title: 'Tihar Festival', type: 'festival' },
    '2081-09-25': { title: 'Christmas', type: 'holiday' },
    '2081-09-30': { title: 'New Year Eve', type: 'holiday' },
    '2081-10-01': { title: 'New Year 2025', type: 'holiday' }
  };

  // Function to get days in current month
  const getDaysInMonth = (bsDate) => {
    const year = bsDate.getYear();
    const month = bsDate.getMonth();
    return daysInMonth[year]?.[month] || daysInMonth[2081][month];
  };

  const generateCalendarDays = () => {
    const year = currentDate.getYear();
    const month = currentDate.getMonth();
    const startDay = new NepaliDate(year, month, 1).getDay();
    const totalDays = getDaysInMonth(currentDate);
    
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= totalDays; i++) {
      days.push(new NepaliDate(year, month, i));
    }
    return days;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new NepaliDate();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getYear() === today.getYear();
  };

  // Get upcoming events (next 3)
  const getUpcomingEvents = () => {
    const today = new NepaliDate();
    return Object.entries(events)
      .map(([date, event]) => ({ date, ...event }))
      .filter(event => {
        const [year, month, day] = event.date.split('-').map(Number);
        const eventDate = new NepaliDate(year, month - 1, day);
        return eventDate.valueOf() >= today.valueOf();
      })
      .sort((a, b) => {
        const [yearA, monthA, dayA] = a.date.split('-').map(Number);
        const [yearB, monthB, dayB] = b.date.split('-').map(Number);
        return new NepaliDate(yearA, monthA - 1, dayA).valueOf() - 
               new NepaliDate(yearB, monthB - 1, dayB).valueOf();
      })
      .slice(0, 3);
  };

  const compareDates = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getYear() === date2.getYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const handleSearch = () => {
    const [year, month, day] = searchDate.split('-').map(Number);
    if (year && month && day) {
      setCurrentDate(new NepaliDate(year, month - 1, day));
      setSelectedDate(new NepaliDate(year, month - 1, day));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-16 text-gray-900 bg-blue-300 rounded-xl min-h-max">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
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
              className="text-4xl font-bold text-black"
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
              onClick={handleSearch}
              icon={<SearchOutlined />}
              style={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'transparent',
                color: 'white'
              }}
            />
          </div>

          <div className="p-6 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={() => setCurrentDate(new NepaliDate(currentDate.getYear(), currentDate.getMonth() - 1, 1))}
                icon={<LeftOutlined />}
                type="text"
                style={{ color: 'white' }}
              />
              <h4 className="text-2xl font-bold text-black">
                {nepaliMonths[currentDate.getMonth()]} {currentDate.getYear()}
              </h4>
              <Button
                onClick={() => setCurrentDate(new NepaliDate(currentDate.getYear(), currentDate.getMonth() + 1, 1))}
                icon={<RightOutlined />}
                type="text"
                style={{ color: 'white' }}
              />
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {nepaliDays.map(day => (
                <div key={day} className="text-sm font-medium text-center text-black">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {generateCalendarDays().map((date, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className={`
                    h-14 w-full p-1 rounded-lg text-center relative
                    ${!date ? 'invisible' : ''}
                    ${isToday(date) ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-white hover:bg-opacity-10'}
                    ${compareDates(selectedDate, date) ? 'ring-2 ring-white' : ''}
                  `}
                  onClick={() => date && setSelectedDate(date)}
                  disabled={!date}
                >
                  {date && (
                    <span className="text-xl font-medium text-black">
                      {date.getDate()}
                    </span>
                  )}
                  {date && events[`${date.getYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`] && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-2 h-2 mx-auto mt-1 rounded-full ${
                        events[`${date.getYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`].type === 'work' ? 'bg-blue-400' :
                        events[`${date.getYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`].type === 'celebration' ? 'bg-yellow-400' :
                        events[`${date.getYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`].type === 'festival' ? 'bg-purple-400' :
                        events[`${date.getYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`].type === 'holiday' ? 'bg-red-400' :
                        'bg-gray-400'
                      }`}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Upcoming Events Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mt-6 rounded-lg"
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
          >
            <h4 className="mb-4 text-xl font-bold text-black">Upcoming Events</h4>
            <div className="space-y-3">
              {getUpcomingEvents().map((event, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <span className="font-medium text-black">{event.title}</span>
                  <span className="text-black opacity-75">{event.date}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <AnimatePresence>
            {selectedDate && events[`${selectedDate.getYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 mt-4 rounded-lg"
                style={{ background: 'rgba(255, 255, 255, 0.2)' }}
              >
                <h4 className="text-lg font-semibold text-black">
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