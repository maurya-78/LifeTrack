import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const Login = () => {
  const [name, setName] = useState(''); // New state for Name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        // 1. Sign Up Logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // 2. Add Name to Firebase Profile
        await updateProfile(userCredential.user, {
          displayName: name
        });
        
        console.log("User registered as:", name);
      } else {
        // Login Logic
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      // Error handling logic
      switch (err.code) {
        case 'auth/email-already-in-use': setError('This email is already registered.'); break;
        case 'auth/invalid-credential': setError('Incorrect email or password.'); break;
        default: setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleAuth} className="space-y-6">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm border border-red-200">{error}</div>}

          {/* Sirf Signup ke waqt Name field dikhayein */}
          {isRegistering && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
            {isRegistering ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-4 text-sm text-blue-600 hover:underline"
        >
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default Login;