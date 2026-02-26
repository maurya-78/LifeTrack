import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Calendar Component
 * Renders a dynamic monthly grid layout with event highlighting.
 * Features: Automatic date generation for the current month and event mapping.
 */
const Calendar = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentMonth] = useState(today.getMonth());
  const [currentYear] = useState(today.getFullYear());

  // Dummy events data for highlighting
  const events = [
    { date: '2026-02-28', title: 'Tech Conference' },
    { date: '2026-03-05', title: 'Project Deadline' },
    { date: '2026-03-10', title: 'Cricket Match' },
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper to get days in month
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = getDaysInMonth(currentMonth, currentYear);

  // Generate calendar cells
  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null); // Empty slots for previous month
  }
  for (let d = 1; d <= totalDays; d++) {
    calendarCells.push(d);
  }

  const handleDateClick = (day) => {
    if (!day) return;
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    console.log("Selected Date:", dateString);
  };

  const hasEvent = (day) => {
    if (!day) return false;
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(e => e.date === dateString);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Click a date to see details</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarCells.map((day, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  h-24 md:h-32 border-b border-r border-gray-100 dark:border-gray-700 p-2 transition-colors relative
                  ${day ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20' : 'bg-gray-50/50 dark:bg-gray-800/50'}
                `}
              >
                {day && (
                  <>
                    <span className={`text-sm font-semibold ${day === today.getDate() && currentMonth === today.getMonth() ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-gray-700 dark:text-gray-300'}`}>
                      {day}
                    </span>
                    
                    {hasEvent(day) && (
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-orange-400 rounded-full mb-1"></div>
                        <span className="hidden md:block text-[10px] font-medium text-orange-600 dark:text-orange-400 truncate">
                          Event Scheduled
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;