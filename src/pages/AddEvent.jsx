import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/** AddEvent Component */

const AddEvent = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'Exam' // Default category
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try{

        const userId = auth.currentUser.uid;
        
        if(!userId) {
            alert("You must be logged in to add events!");
            return;
        }

       // Reference the subcollection

        const userEventsRef = collection(db,"user",userId,"events");

        //  Add the document to Firestore

        await addDoc(userEventsRef, {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        category: formData.category,
        createdAt: serverTimestamp() // Better than new Date() for global consistency
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-6 bg-blue-600 dark:bg-blue-700">
          <h2 className="text-2xl font-bold text-white">Create New Event</h2>
          <p className="text-blue-100 mt-1">Fill in the details for your smart reminder</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Final Semester Exam"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white transition"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Add some notes about this event..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Date Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Event Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white transition"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white transition appearance-none"
              >
                <option value="Exam">Exam</option>
                <option value="Travel">Travel</option>
                <option value="Birthday">Birthday</option>
                <option value="Marriage">Marriage</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition duration-200 transform active:scale-[0.98]"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;