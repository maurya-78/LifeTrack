import React, { useState } from 'react';
import { auth } from '../firebase';
import { updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      setMessage("Profile updated successfully!");
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setMessage("Error updating profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-sm border border-slate-100 p-10">
        <header className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-black mx-auto mb-4 shadow-lg shadow-blue-100">
            {user?.displayName?.charAt(0).toUpperCase() || "U"}
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Your Profile</h2>
          <p className="text-slate-500 font-medium">Manage your personal information</p>
        </header>

        {message && (
          <div className={`p-4 rounded-2xl mb-6 text-center font-bold text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address (Read-only)</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full p-4 bg-slate-100 border-none rounded-2xl text-slate-400 font-medium cursor-not-allowed"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;