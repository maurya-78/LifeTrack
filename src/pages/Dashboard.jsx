import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... (Keep your existing useEffect for fetching events)

  // New Delete Function
  const handleDelete = async (eventId) => {
    // 1. Ask for confirmation (UX Best Practice)
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      // 2. Create a reference to the specific document to delete
      const eventDocRef = doc(db, "users", userId, "events", eventId);

      // 3. Remove the document from Firestore
      await deleteDoc(eventDocRef);

      // 4. Update local state to remove the card from UI immediately
      setEvents(events.filter(event => event.id !== eventId));
      
      console.log("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete the event. Please try again.");
    }
  };

  if (loading) return <div className="text-center mt-20 dark:text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      {/* ... Header ... */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold dark:text-white">{event.title}</h3>
            <p className="text-gray-500 dark:text-gray-400">{event.date}</p>
            
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => navigate(`/edit-event/${event.id}`)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 py-2 rounded text-sm dark:text-white hover:bg-gray-200 transition"
              >
                Edit
              </button>
              {/* Delete Button */}
              <button 
                onClick={() => handleDelete(event.id)}
                className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 py-2 rounded text-sm font-semibold hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;