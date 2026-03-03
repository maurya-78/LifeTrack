import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddEvent = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'Exam' 
  });

  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    
    const user = auth.currentUser;
    if(!user) {
        alert("Session expired! Please login again.");
        navigate('/');
        return;
    }

    setLoading(true);
    try {
      const userEventsRef = collection(db, "users", user.uid, "events");

      // Add data in the firebase
      await addDoc(userEventsRef, {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        category: formData.category, 
        createdAt: serverTimestamp() 
      });

      console.log("Event added successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Theme 
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        
        <div className="px-10 pt-10 pb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight italic">Create Event</h2>
          <p className="text-slate-500 font-bold mt-1">Set a new smart reminder, {auth.currentUser?.displayName?.split(' ')[0] || "User"}!</p>
        </div>

        <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 ml-1">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Event Title "
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 ml-1">Notes</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              placeholder="Any details?"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Field */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 ml-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 transition-all"
              />
            </div>

            {/* Category  */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 ml-1">Category</label>
             <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-black text-slate-600 cursor-pointer"
             >
              <option value="Exam">Exam 📝</option>
              <option value="Travel">Travel ✈️</option> 
              <option value="Birthday">Birthday 🎂</option>
              <option value="Marriage">Marriage 💍</option>
             <option value="Sports">Sports 🏏</option>
          </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] px-6 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
            >
              {loading ? "Adding..." : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;