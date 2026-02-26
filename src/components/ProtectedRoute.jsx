import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

/**
 * ProtectedRoute Wrapper
 * Listens to Firebase Auth state and redirects unauthorized users.
 */
const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // onAuthStateChanged returns an 'unsubscribe' function to clean up the listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop showing loader once Firebase responds
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (loading) {
    // Show a simple loading screen while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    // If no user is logged in, redirect to the Login page
    return <Navigate to="/" replace />;
  }

  // If user exists, render the protected component (children)
  return children;
};

export default ProtectedRoute;