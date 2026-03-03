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

  const categoryColors = {
    Exam: 'bg-red-500',
    Sports: 'bg-green-500', 
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
    
    const dateString = selectedDate.toLocaleDateString('en-CA'); 
    return events.filter(event => event.date === dateString);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = getEventsForDate(date);
      return (
        <div className="flex justify-center gap-1 mt-1">
          {dayEvents.slice(0, 3).map(event => (
            <div 
              key={event.id} 
              className={`h-1.5 w-1.5 rounded-full ${categoryColors[event.category] || 'bg-gray-400'}`}
            ></div>
          ))}
          {dayEvents.length > 3 && <div className="h-1 w-1 rounded-full bg-gray-300"></div>}
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      {/*  CSS */}
      <style>
        {`
          .react-calendar {
            width: 100% !important;
            border: none !important;
            background: transparent !important;
            font-family: inherit !important;
          }
          .react-calendar__tile {
            padding: 20px 10px !important;
            border-radius: 16px !important;
            font-weight: 600 !important;
            color: #475569 !important;
          }
          .react-calendar__tile--active {
            background: #2563eb !important;
            color: white !important;
            box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2) !important;
          }
          .react-calendar__tile--now {
            background: #eff6ff !important;
            color: #2563eb !important;
          }
          .react-calendar__navigation button {
            font-weight: 900 !important;
            font-size: 1.2rem !important;
            color: #1e293b !important;
          }
          .react-calendar__month-view__weekdays__weekday abbr {
            text-decoration: none !important;
            text-transform: uppercase !important;
            font-weight: 800 !important;
            font-size: 0.75rem !important;
            color: #94a3b8 !important;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">Timeline</h1>
            <p className="text-slate-500 font-bold mt-1">Manage your schedule visually</p>
          </div>
          <button 
            onClick={() => window.history.back()} 
            className="bg-white px-6 py-3 rounded-2xl font-black text-slate-600 shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
          >
            ← Back
          </button>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Calendar Card */}
          <div className="lg:col-span-8 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
            <Calendar 
              onChange={setDate} 
              value={date} 
              tileContent={tileContent}
            />
          </div>

          {/* Sidebar Events List */}
          <div className="lg:col-span-4 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col h-fit sticky top-12">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="text-blue-600">●</span> {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
            </h2>
            
            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {getEventsForDate(date).length > 0 ? (
                getEventsForDate(date).map(event => (
                  <div 
                    key={event.id} 
                    className="p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-white border border-slate-100 ${categoryColors[event.category]?.replace('bg-', 'text-')}`}>
                        {event.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{event.title}</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1 line-clamp-2">{event.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4 opacity-20">📅</div>
                  <p className="text-slate-400 font-bold italic text-sm">Free day, {auth.currentUser?.displayName?.split(' ')[0] || "User"}! Enjoy. 🌴</p>
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