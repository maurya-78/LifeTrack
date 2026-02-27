import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Ye zaroori hai

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen for Auth State (User ke login hone ka wait karein)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 2. Sirf login user ka data fetch karein
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
        // Agar user login nahi hai toh redirect karein
        navigate('/');
      }
    });

    // Cleanup listener
    return () => unsubscribe();
  }, [navigate]);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const userId = auth.currentUser?.uid;
      await deleteDoc(doc(db, "users", userId, "events", eventId));
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (loading) return <div className="text-center mt-20 dark:text-white">Loading events...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
       <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Your Events</h1>
        <button 
          onClick={() => navigate('/add-event')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold dark:text-white">{event.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{event.date}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => navigate(`/edit-event/${event.id}`)} className="flex-1 bg-gray-100 dark:bg-gray-700 py-2 rounded text-sm dark:text-white">Edit</button>
                <button onClick={() => handleDelete(event.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded text-sm font-semibold">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p className="dark:text-white">No events found. Add your first event!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;