import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleAuth = (token, profileData) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    setProfile(profileData || {});
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setProfile({});
  };

  // Component to protect routes from unauthorized access
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
          AI-Powered Personalized Fitness System
        </h1>
        {isLoggedIn && (
          <button onClick={handleLogout} className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition">
            Logout
          </button>
        )}
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <AuthForm onAuthSuccess={handleAuth} />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard profile={profile} setProfile={setProfile} />
            </ProtectedRoute>
          } />

          <Route path="/recommendations" element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;