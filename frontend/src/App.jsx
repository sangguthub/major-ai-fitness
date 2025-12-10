import React, { useState, useEffect, useCallback } from 'react'; // ADDED useCallback
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations'; 
import LandingPage from './pages/LandingPage'; 
import AboutPage from './pages/AboutPage'; 
import api from './api/api'; 

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [appLoading, setAppLoading] = useState(true);

  // 1. Stabilized handleLogout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setProfile({});
    // Dependencies: State setters
  }, [setProfile]); 

  const handleAuth = (token, profileData) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    setProfile(profileData || {});
  };
  
  // 2. Stabilized function for fetching profile data
  const fetchProfileData = useCallback(async () => {
    if (!localStorage.getItem('token')) {
        setAppLoading(false);
        return;
    }
    try {
        const response = await api.get('/profile');
        setProfile(response.data.profile);
    } catch (err) {
        // If profile fetch fails (e.g., token expired/invalid), log out the user
        handleLogout(); 
    } finally {
        setAppLoading(false);
    }
    // Dependencies: handleLogout and state setters
  }, [handleLogout, setProfile, setAppLoading]); 

  // --- Initial Data Load and Login Check ---
  
  // 3. Final useEffect logic remains the same, now relying on stable dependencies
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
      fetchProfileData(); 
    } else {
      setAppLoading(false);
    }
    // Dependencies: Checks login status and relies on the stable fetchProfileData
  }, [isLoggedIn, fetchProfileData]); 

  // --- Routing and Layout ---

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/" replace />;
    }
    return children;
  };
  
  if (appLoading) {
      return (
        <div className="min-h-screen bg-[#0D1117] text-ai-green text-center text-2xl font-bold pt-40">
            Loading System Data...
            <div className="mt-8 text-xl text-gray-500">Initializing AI modules...</div>
        </div>
      );
  }

  return (
    <Router>
        {/* Top Header/Navigation Bar (Dark Theme) */}
        <header className="bg-[#1a0f2e] shadow-ai text-white p-4 flex justify-between items-center border-b border-[#00AEEF]">
            <div className="flex items-center">
                <h1 className="text-xl font-bold text-ai-WHITE tracking-wider">
                    AI Fitness & Prediction System
                </h1>
            </div>
            <nav className="flex space-x-6 text-sm">
                {isLoggedIn && <a href="/dashboard" className="text-gray-300 hover:text-ai-green transition">Dashboard</a>}
                <a href="/about" className="text-gray-300 hover:text-ai-green transition">About</a>
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition font-medium">Logout</button>
                ) : (
                    <a href="/" className="text-white hover:text-ai-green transition font-medium">Login</a>
                )}
            </nav>
        </header>

        <Routes>
          {/* Default Route: Landing Page or Dashboard Redirect */}
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LandingPage onAuthSuccess={handleAuth} />} />
          
          {/* Main Application Interface */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {/* Dashboard implements the 20/80 sidebar layout */}
              <Dashboard 
                profile={profile} 
                setProfile={setProfile} 
                fetchProfile={fetchProfileData} // Passed down as the refresh trigger
              /> 
            </ProtectedRoute>
          } />
          
          {/* Dedicated About Page */}
          <Route path="/about" element={<AboutPage />} />
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    </Router>
  );
};

export default App;