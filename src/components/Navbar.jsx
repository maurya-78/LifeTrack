import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = (e) => {
    e.stopPropagation(); // Profile click 
    signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link to="/dashboard" className="text-2xl font-black text-blue-600 tracking-tighter">
        LifeTrack
      </Link>
      
      <div className="flex items-center gap-4 md:gap-8">
        {/* Navigation Link */}
        <Link 
          to="/calendar" 
          className="text-slate-500 font-bold hover:text-blue-600 transition text-sm md:text-base"
        >
          Calendar
        </Link>
        
        {/* Clickable User Profile Section */}
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 pl-4 md:pl-8 border-l border-slate-100 cursor-pointer group transition-all"
        >
          {/* Avatar Icon */}
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">
            {user?.displayName?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* User Name & Logout Container */}
          <div className="flex flex-col">
            <span className="hidden md:block text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">
              {user?.displayName || "User"}
            </span>
            <button 
              onClick={handleLogout} 
              className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:text-red-700 text-left transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;