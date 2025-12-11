import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';
import api from './api/api';

const App = () => {
    // Global State for Authentication, User Details, and Profile Data
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // --- 2. Authentication Handlers ---
    
    // Function to perform a clean logout, clearing all state and storage
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setProfile({});
    };
    
    // Dependency list for useCallback
    const handleLogoutCallback = useCallback(handleLogout, []);

    // Function to handle successful login and store data
    const handleLogin = (userData) => {
        // userData contains { token, id, name, email, profile }
        localStorage.setItem('token', userData.token);
        
        const { profile: userProfile, ...userDetails } = userData;

        setUser(userDetails);
        setProfile(userProfile || {});
    };

    // --- 1. Fetch User Profile Data (Includes the JWT malformed FIX) ---
    const fetchProfile = useCallback(async () => {
        const token = localStorage.getItem('token');
        
        // 1. If token is missing, stop loading and return.
        if (!token) {
            setIsLoading(false);
            return;
        }

        // 2. AGGRESSIVE CHECK: Check if the token is an obvious leftover malformed string 
        // (e.g., "null", "undefined", or too short to be valid JWT)
        if (token === 'null' || token === 'undefined' || token.length < 10) {
            console.warn("Detected malformed or placeholder token in storage. Clearing...");
            handleLogoutCallback(); // Clear the malformed token immediately
            setIsLoading(false);
            return;
        }

        try {
            // Note: The /api/profile endpoint returns the full user object including profile{}
            const response = await api.get('/profile'); 
            
            // The response.data contains { id, name, email, profile, token }
            const { profile: fetchedProfile, ...userDetails } = response.data;
            
            setUser(userDetails);
            setProfile(fetchedProfile || {});

        } catch (error) {
            console.error('Error fetching user profile (Server check):', error);
            
            // 3. SERVER RESPONSE CHECK: If the server specifically returns Unauthorized (401), 
            // the token is guaranteed to be expired or invalid. We MUST clear it.
            if (error.response && error.response.status === 401) {
                console.error("401 Unauthorized received. Invalid token detected. Forcing logout.");
                handleLogoutCallback(); 
            }
            
        } finally {
            setIsLoading(false);
        }
    }, [handleLogoutCallback]);

    // --- 3. Initial Load Effect ---
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);


    // --- 4. Loading State Rendering ---
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0D1117] text-ai-green">
                <p className="text-xl">Loading application data...</p>
            </div>
        );
    }

    // --- 5. Main Application Structure and Routing ---
    return (
        <Router>
            <div className="App min-h-screen bg-[#0D1117]">
                <Header user={user} onLogout={handleLogoutCallback} />
                <Routes>
                    {/* Landing Page Route (Acts as Auth Gate) */}
                    <Route 
                        path="/" 
                        element={user ? <Navigate to="/dashboard" /> : <LandingPage onAuthSuccess={handleLogin} />} 
                    />
                    
                    {/* Authentication Routes (Redirects to Dashboard if logged in) */}
                    <Route 
                        path="/auth/:type" 
                        element={user ? <Navigate to="/dashboard" /> : <LandingPage onAuthSuccess={handleLogin} />} 
                    />

                    {/* Dashboard/Protected Route */}
                    <Route 
                        path="/dashboard" 
                        element={
                            user ? (
                                <Dashboard 
                                    profile={profile} 
                                    setProfile={setProfile} 
                                    fetchProfile={fetchProfile} 
                                    user={user} // Pass user for Dashboard Summary
                                />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        } 
                    />

                    {/* About Page Route */}
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;