import React, { useState } from 'react';
import { auth, storage } from '../firebase'; 
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Photo select karne ka logic
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0])); 
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let photoURL = user.photoURL;

      // image upload
      if (image) {
        const imageRef = ref(storage, `profile_pics/${user.uid}`);
        await uploadBytes(imageRef, image);
        photoURL = await getDownloadURL(imageRef);
      }

      //  Profile update 
      await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: photoURL
      });

      setMessage("Profile updated successfully! 🎉");
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-sm border border-slate-100 p-10">
        
        <header className="text-center mb-8">
          <div className="relative w-28 h-28 mx-auto mb-4 group">
            {/* Profile Image  */}
            <div className="w-full h-full bg-blue-600 rounded-full overflow-hidden flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-blue-100 border-4 border-white">
              {preview ? (
                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{displayName?.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>
            {/* Hidden File Input */}
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer shadow-md hover:bg-blue-700 transition-all border-2 border-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Profile Settings</h2>
          <p className="text-slate-500 font-medium">Update your photo and name</p>
        </header>

        {message && (
          <div className={`p-4 rounded-2xl mb-6 text-center font-bold text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;