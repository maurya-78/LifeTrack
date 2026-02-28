import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { db, auth } from '../firebase';
import { collection, getDocs, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phase 3: Category Colors
  const categoryColors = {
    Exam: 'bg-red-500',
    Sports: 'bg-green-500', // Rahul, aapke cricket matches ke liye
    Birthday: 'bg-yellow-500',
    Travel: 'bg-blue-500',
    Marriage: 'bg-purple-500'
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const eventsRef = collection(db, "users", user.uid, "events");
          const querySnapshot = await getDocs(query(eventsRef));
          const eventsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setEvents(eventsData);
        } catch (error) {
          console.error("Error fetching events:", error);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const getEventsForDate = (selectedDate) => {
    const offset = selectedDate.getTimezoneOffset();
    const adjustedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
    const dateString = adjustedDate.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = getEventsForDate(date);
      return (
        <div className="flex justify-center gap-1 mt-1">
          {dayEvents.map(event => (
            <div 
              key={event.id} 
              className={`h-1.5 w-1.5 rounded-full ${categoryColors[event.category] || 'bg-gray-400'}`}
            ></div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="text-center mt-20 dark:text-white">Loading Calendar...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      {/* Visibility Fix CSS */}
     <style>
  {`
    /* Poore calendar ka background white karne ke liye */
    .react-calendar {
      width: 100% !important;
      border: none !important;
      background-color: white !important; /* Grey background hta diya */
      font-family: 'Inter', sans-serif !important;
    }

    /* Tiles (dates) ka background aur border hatane ke liye */
    .react-calendar__tile {
      background: white !important;
      border: none !important;
      padding: 15px 5px !important;
      transition: all 0.2s ease;
    }

    /* Dates ka text color ekdum saaf dikhane ke liye */
    .react-calendar__month-view__days__day {
      color: #374151 !important; /* Dark text */
      font-weight: 500 !important;
    }

    /* Hover karne par halka sa change */
    .react-calendar__tile:hover {
      background-color: #f3f4f6 !important;
      border-radius: 8px !important;
    }

    /* Aaj ki date (Today) ka highlight style */
    .react-calendar__tile--now {
      background: #eff6ff !important;
      color: #2563eb !important;
      border-radius: 8px !important;
      font-weight: bold !important;
    }

    /* Selected date ka blue background */
    .react-calendar__tile--active {
      background: #2563eb !important;
      color: white !important;
      border-radius: 8px !important;
    }

    /* Navigation buttons (Prev/Next) ka background fix */
    .react-calendar__navigation button {
      background: white !important;
      color: #374151 !important;
      font-size: 1.2rem !important;
      font-weight: bold !important;
    }

    .react-calendar__navigation button:hover {
      background-color: #f9fafb !important;
    }

    /* Weekdays (Su, Mo, Tu...) ka color */
    .react-calendar__month-view__weekdays__weekday abbr {
      text-decoration: none !important;
      color: #9ca3af !important;
      font-weight: 600 !important;
      text-transform: uppercase;
      font-size: 0.8rem;
    }
  `}
</style>

      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold dark:text-white">Events Calendar</h1>
            <p className="text-gray-500 dark:text-gray-400">Track your schedule visually.</p>
          </div>
          <button 
            onClick={() => window.history.back()} 
            className="text-blue-600 font-bold hover:underline"
          >
            Go Back
          </button>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
            <Calendar 
              onChange={setDate} 
              value={date} 
              tileContent={tileContent}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b dark:text-white dark:border-gray-700">
              {date.toDateString()}
            </h2>
            
            <div className="space-y-4 overflow-y-auto max-h-[450px] pr-2">
              {getEventsForDate(date).length > 0 ? (
                getEventsForDate(date).map(event => (
                  <div 
                    key={event.id} 
                    className={`p-4 rounded-2xl border-l-4 shadow-sm ${categoryColors[event.category]?.replace('bg-', 'border-') || 'border-gray-300'} bg-gray-50 dark:bg-gray-700/50`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{event.category}</span>
                    <h3 className="font-bold text-gray-800 dark:text-white">{event.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{event.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">🌟</p>
                  <p className="text-gray-400 font-medium">No plans for today, Rahul!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;