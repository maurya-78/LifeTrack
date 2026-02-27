import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default styling zaroori hai
import { db, auth } from '../firebase';
import { collection, getDocs, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Is function se hum check karenge ki kis date par event hai
  const getEventsForDate = (selectedDate) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  // Calendar ki tiles par dot dikhane ke liye
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length > 0) {
        return <div className="h-2 w-2 bg-blue-500 rounded-full mx-auto mt-1"></div>;
      }
    }
    return null;
  };

  if (loading) return <div className="text-center mt-20 dark:text-white">Loading Calendar...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold dark:text-white mb-8">Event Calendar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
          {/* Left Side: The Calendar */}
          <div className="calendar-container">
            <Calendar 
              onChange={setDate} 
              value={date} 
              tileContent={tileContent}
              className="rounded-lg border-none shadow-sm dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Right Side: Event Details for Selected Date */}
          <div className="event-details">
            <h2 className="text-xl font-semibold mb-4 dark:text-blue-400">
              Events on {date.toDateString()}
            </h2>
            {getEventsForDate(date).length > 0 ? (
              getEventsForDate(date).map(event => (
                <div key={event.id} className="mb-4 p-4 border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-700 rounded-r-lg">
                  <h3 className="font-bold dark:text-white">{event.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{event.category}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No events for this day.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;