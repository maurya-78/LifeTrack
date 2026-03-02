import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); 
  const [filteredEvents, setFilteredEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // States for Search, Filter and Popup Alert
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [activeAlert, setActiveAlert] = useState(null);

  const categoryStyles = {
    Exam: 'bg-red-500 text-red-600',
    Sports: 'bg-green-500 text-green-600',
    Birthday: 'bg-yellow-500 text-yellow-600',
    Travel: 'bg-blue-500 text-blue-600',
    Marriage: 'bg-purple-500 text-purple-600'
  };

  // Fetch Data from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const eventsRef = collection(db, "users", user.uid, "events");
          const q = query(eventsRef, orderBy("date", "asc"));
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setEvents(data);
          setFilteredEvents(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // SEARCH & FILTER LOGIC
  useEffect(() => {
    const result = events.filter(event => {
      const titleStr = event.title ? event.title.toLowerCase() : "";
      const matchesSearch = titleStr.includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "All" || event.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredEvents(result);
  }, [searchTerm, filterCategory, events]); 

  // 3. TIMER POPUP LOGIC
  useEffect(() => {
    const checkTimer = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0]; // Current Date YYYY-MM-DD
      
    
      const alertFound = events.find(event => event.date === todayStr);
      
      if (alertFound && !activeAlert) {
        setActiveAlert(alertFound);
      }
    };

    const intervalId = setInterval(checkTimer, 30000); 
    checkTimer();
    return () => clearInterval(intervalId);
  }, [events, activeAlert]);

  // Countdown 
  const getCountdown = (eventDate) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(eventDate);
    const diff = target - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return { text: "Today! ✨", style: "bg-orange-50 text-orange-600 border-orange-100" };
    if (days < 0) return { text: "Passed", style: "bg-slate-50 text-slate-400 border-slate-100" };
    if (days <= 3) return { text: `${days}d left! 🔥`, style: "bg-red-50 text-red-600 border-red-100 animate-pulse" };
    return { text: `${days} days to go`, style: "bg-blue-50 text-blue-600 border-blue-100" };
  };

  const handleDelete = async (id) => {
    if (window.confirm("Sure you want to delete?")) {
      try {
        await deleteDoc(doc(db, "users", auth.currentUser.uid, "events", id));
        setEvents(events.filter(e => e.id !== id));
      } catch (err) { console.error(err); }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 relative">
      
      {/* TIMER POPUP ALERT MODAL */}
      {activeAlert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl text-center border border-slate-100 transition-all">
            <div className="text-6xl mb-6">🔔</div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">It's Time!</h2>
            <p className="text-slate-500 font-bold mb-8">
              Vishal, don't miss out on: <br/>
              <span className="text-blue-600 text-2xl font-black italic">"{activeAlert.title}"</span>
            </p>
            <button 
              onClick={() => setActiveAlert(null)}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
            >
              Okay, I'm Ready!
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">LifeTrack</h1>
            <p className="text-slate-500 font-bold mt-1">Hello, {auth.currentUser?.displayName || "User"}!</p>
          </div>
          <button onClick={() => navigate('/add-event')} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all">
            + New Event
          </button>
        </header>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <input 
            type="text" 
            placeholder="Search by name ..." 
            className="flex-[3] p-5 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="flex-1 p-5 rounded-2xl border-none bg-white shadow-sm font-black text-slate-600 outline-none cursor-pointer"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Exam">Exams</option>
            <option value="Sports">Sports</option>
            <option value="Birthday">Birthday</option>
            <option value="Travel">Travel</option>
          </select>
        </div>

        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const countdown = getCountdown(event.date);
            return (
              <div key={event.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all">
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${categoryStyles[event.category]?.split(' ')[0] || 'bg-slate-200'}`}></div>
                <div className="pl-2">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${categoryStyles[event.category]?.split(' ')[1] || 'text-slate-400'}`}>
                      {event.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${countdown.style}`}>
                      {countdown.text}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2 leading-tight">{event.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2">{event.description || "Plan details..."}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-slate-400 text-xs font-black">{new Date(event.date).toLocaleDateString()}</span>
                    <div className="flex gap-4">
                      <button onClick={() => navigate(`/edit-event/${event.id}`)} className="text-blue-600 font-bold text-sm hover:underline">Edit</button>
                      <button onClick={() => handleDelete(event.id)} className="text-red-400 font-bold text-sm hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State UI */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
            <p className="text-slate-400 font-black italic">No results found for "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;