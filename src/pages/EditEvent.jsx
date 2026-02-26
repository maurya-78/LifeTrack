import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditEvent = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: '',
    description: ''
  });

  // 1. Fetch the existing event data from Firestore
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        // Create a reference to the specific document
        const docRef = doc(db, "users", userId, "events", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          console.log("No such document!");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Update the document in Firestore
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = auth.currentUser?.uid;
      const docRef = doc(db, "users", userId, "events", id);

      // updateDoc only changes the fields you provide
      await updateDoc(docRef, {
        title: formData.title,
        date: formData.date,
        category: formData.category,
        description: formData.description
      });

      console.log("Document successfully updated!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Error updating event. Please try again.");
    }
  };

  if (loading) return <div className="p-8 text-center dark:text-white">Loading event...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Edit Your Event</h2>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="Work">Work</option>
              <option value="Sports">Sports</option>
              <option value="Education">Education</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-200 dark:bg-gray-700 py-2 rounded font-semibold dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;