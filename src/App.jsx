import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import Calendar from './pages/Calendar';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';

const App = () => {
  return (
    <Routes>
      {/*  Login page: */}
      <Route path="/" element={<Login />} />

      {/*  Dashboard: */}
      <Route path="/dashboard" element={ <ProtectedRoute> <Layout><Dashboard /></Layout> </ProtectedRoute>} />

      {/*  Add Event: */}
      <Route path="/add-event" element={<ProtectedRoute><Layout><AddEvent /></Layout></ProtectedRoute>} />

      {/*  Edit Event: */}
      <Route path="/edit-event/:id" element={<ProtectedRoute><Layout><EditEvent /></Layout></ProtectedRoute>} />

      {/*  Calendar:  */}
      <Route path="/calendar" element={<ProtectedRoute><Layout><Calendar /></Layout></ProtectedRoute>} />

      {/*  profile:  */}
      <Route path="/profile" element={<Profile />} />

    </Routes>
  );
};

export default App;