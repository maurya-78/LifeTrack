import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Category Styling
  const categoryStyles = {
    Exam: 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-700',
    Sports: 'border-green-500 bg-green-50 dark:bg-green-900/10 text-green-700', // For RCB fans!
    Birthday: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700',
    Travel: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-blue-700'
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const eventsRef = collection(db, "users", user.uid, "events");
          const q = query(eventsRef, orderBy("date", "asc"));
          const querySnapshot = await getDocs(q);
          const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setEvents(eventsData);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div className="text-center mt-20 dark:text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold dark:text-white">
              {/* Dynamic Name logic */}
              Welcome Back, <span className="text-blue-600">
                {auth.currentUser?.displayName?.split(' ')[0] || "User"}
              </span> 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Here are your upcoming reminders.</p>
          </div>
          <button onClick={() => navigate('/add-event')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition">
            + New Event
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className={`p-6 rounded-2xl shadow-sm border-l-8 bg-white dark:bg-gray-800 ${categoryStyles[event.category] || 'border-gray-200'}`}>
              <span className="text-xs font-bold uppercase tracking-widest">{event.category}</span>
              <h3 className="text-xl font-bold mt-2 dark:text-white">{event.title}</h3>
              <p className="text-gray-500 mt-1">{new Date(event.date).toDateString()}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => navigate(`/edit-event/${event.id}`)} className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm dark:text-white">Edit</button>
                <button onClick={() => handleDelete(event.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;