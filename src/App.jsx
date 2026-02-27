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
      {/* 1. Login page: No Protection, No Layout */}
      <Route path="/" element={<Login />} />

      {/* 2. Dashboard: Protected & with Layout */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />

      {/* 3. Add Event: Protected & with Layout */}
      <Route path="/add-event" element={
        <ProtectedRoute>
          <Layout><AddEvent /></Layout>
        </ProtectedRoute>
      } />

      {/* 4. Edit Event: Protected & with Layout */}
      <Route path="/edit-event/:id" element={
        <ProtectedRoute>
          <Layout><EditEvent /></Layout>
        </ProtectedRoute>
      } />

      {/* 5. Calendar: Protected & with Layout */}
      <Route path="/calendar" element={
        <ProtectedRoute>
          <Layout><Calendar /></Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;