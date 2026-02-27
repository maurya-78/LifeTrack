import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phase 3: Category based styling
  const categoryStyles = {
    Exam: 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400',
    Travel: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400',
    Birthday: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400',
    Sports: 'border-green-500 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400',
    Marriage: 'border-purple-500 bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-400'
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const eventsRef = collection(db, "users", user.uid, "events");
          const q = query(eventsRef, orderBy("date", "asc"));
          const querySnapshot = await getDocs(q);
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
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const userId = auth.currentUser?.uid;
      await deleteDoc(doc(db, "users", userId, "events", eventId));
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome Back, <span className="text-blue-600">Rahul</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your smart reminders and upcoming tasks.</p>
          </div>
          <button 
            onClick={() => navigate('/add-event')}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all transform hover:-translate-y-1"
          >
            + Create New Event
          </button>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div 
                key={event.id} 
                className={`group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border-l-8 ${categoryStyles[event.category] || 'border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${categoryStyles[event.category]}`}>
                    {event.category || 'General'}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-6">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">{new Date(event.date).toDateString()}</span>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button 
                    onClick={() => navigate(`/edit-event/${event.id}`)} 
                    className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)} 
                    className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2.5 rounded-lg text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-inner border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="text-64px mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white">No Events Yet</h2>
            <p className="text-gray-500 mb-8">Start your journey by adding your first reminder.</p>
            <button 
              onClick={() => navigate('/add-event')}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Add Your First Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;