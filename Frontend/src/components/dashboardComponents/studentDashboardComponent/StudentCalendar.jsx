import React, { useState } from 'react';
import { Input, Button, Card } from 'antd';
import { SearchOutlined, LeftOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';
import NepaliDate from 'nepali-date-converter';

const StudentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new NepaliDate());
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchDate, setSearchDate] = useState('');

  const nepaliMonths = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangshir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];

  const nepaliDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = {
    2080: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2081: [31, 31, 32, 32, 31, 30, 30, 30, 30, 29, 30, 30]
  };

  const events = {
    '2081-07-20': { title: 'Team Meeting', type: 'work' },
    '2081-07-25': { title: 'Birthday Party', type: 'celebration' },
    '2081-07-15': { title: 'Project Deadline', type: 'deadline' },
    '2081-08-15': { title: 'Tihar Festival', type: 'festival' },
    '2081-09-25': { title: 'Christmas', type: 'holiday' },
    '2081-09-30': { title: 'New Year Eve', type: 'holiday' },
    '2081-10-01': { title: 'New Year 2025', type: 'holiday' }
  };

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
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-200 to-indigo-300 md:p-8 lg:p-16 rounded-2xl">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          <Card 
            className="shadow-lg"
            style={{ padding: '1.5rem' }}
          >
            <div className="flex flex-col pb-4 mb-6 space-y-4 border-b sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center space-x-3">
                <CalendarOutlined className="text-2xl text-blue-600" />
                <h2 className="text-2xl font-bold md:text-3xl">
                  Nepali Calendar
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  className="w-32 sm:w-40"
                />
                <Button 
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  type="primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <Button
                icon={<LeftOutlined />}
                onClick={() => setCurrentDate(new NepaliDate(currentDate.getYear(), currentDate.getMonth() - 1, 1))}
                type="text"
              />
              <h3 className="text-xl font-semibold">
                {nepaliMonths[currentDate.getMonth()]} {currentDate.getYear()}
              </h3>
              <Button
                icon={<RightOutlined />}
                onClick={() => setCurrentDate(new NepaliDate(currentDate.getYear(), currentDate.getMonth() + 1, 1))}
                type="text"
              />
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 sm:gap-2">
              {nepaliDays.map(day => (
                <div key={day} className="py-2 text-xs font-medium text-center text-gray-600 sm:text-sm">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {generateCalendarDays().map((date, index) => (
                <button
                  key={index}
                  className={`
                    aspect-square p-1 rounded-lg text-center relative
                    transition-all duration-200 ease-in-out
                    hover:bg-blue-50
                    ${!date ? 'invisible' : ''}
                    ${isToday(date) ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                    ${compareDates(selectedDate, date) ? 'ring-2 ring-blue-400' : ''}
                  `}
                  onClick={() => date && setSelectedDate(date)}
                  disabled={!date}
                >
                  {date && (
                    <>
                      <span className="text-sm font-medium sm:text-base">
                        {date.getDate()}
                      </span>
                      {events[`${date.getYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`] && (
                        <div className={`
                          w-1.5 h-1.5 mx-auto mt-1 rounded-full
                          ${events[`${date.getYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`].type === 'work' ? 'bg-blue-400' :
                          events[`${date.getYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`].type === 'celebration' ? 'bg-yellow-400' :
                          events[`${date.getYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`].type === 'festival' ? 'bg-purple-400' :
                          events[`${date.getYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`].type === 'holiday' ? 'bg-red-400' :
                          'bg-gray-400'}
                        `} />
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-lg" title="Upcoming Events">
              <div className="space-y-3">
                {getUpcomingEvents().map((event, index) => (
                  <div
                    key={index}
                    className="p-3 transition-all duration-200 rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                      <span className="font-medium">{event.title}</span>
                      <span className="text-sm text-gray-600">{event.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {selectedDate && events[`${selectedDate.getYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`] && (
              <Card className="shadow-lg">
                <h4 className="text-lg font-semibold">
                  {events[`${selectedDate.getYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`].title}
                </h4>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCalendar;