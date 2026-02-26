import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import Calendar from './pages/Calendar';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      {/* Login page without Navbar/Footer */}
      <Route path="/" element={<Login />} />

      {/* App pages wrapped in Layout */}
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/add-event" element={<Layout><AddEvent /></Layout>} />
      <Route path="/edit-event/:id" element={<Layout><EditEvent /></Layout>} />
      <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout> </ProtectedRoute>} />
      <Route  path="/calendar" element={<ProtectedRoute><Layout><Calendar /></Layout> </ProtectedRoute> } />
      </Routes>
  );
};

export default App;