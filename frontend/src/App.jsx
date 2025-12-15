import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import DashboardModuleContainer from './pages/DashboardModuleContainer';
import DashboardHubPage from './pages/DashboardHubPage';
import AboutPage from './pages/AboutPage';
import api from './api/api';
import PasswordRecovery from './pages/PasswordRecovery';
import ResetPassword from './pages/ResetPassword'; 

const App = () => {
    // Global State for Authentication, User Details, and Profile Data
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Function to perform a clean logout, clearing all state and storage
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setProfile({});
    };
    
    const handleLogoutCallback = useCallback(handleLogout, []);

    // Function to handle successful login and store data
    const handleLogin = (userData) => {
        // userData contains { token, id, name, email, profile }
        localStorage.setItem('token', userData.token);
        
        const { profile: userProfile, ...userDetails } = userData;

        setUser(userDetails);
        setProfile(userProfile || {});
    };

    // Fetch User Profile Data
    const fetchProfile = useCallback(async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setIsLoading(false);
            return;
        }

        if (token === 'null' || token === 'undefined' || token.length < 10) {
            console.warn("Detected malformed or placeholder token in storage. Clearing...");
            handleLogoutCallback(); 
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.get('/profile'); 
            const { profile: fetchedProfile, ...userDetails } = response.data;
            
            setUser(userDetails);
            setProfile(fetchedProfile || {});

        } catch (error) {
            console.error('Error fetching user profile (Server check):', error);
            
            if (error.response && error.response.status === 401) {
                console.error("401 Unauthorized received. Invalid token detected. Forcing logout.");
                handleLogoutCallback(); 
            }
            
        } finally {
            setIsLoading(false);
        }
    }, [handleLogoutCallback]);

    // Initial Load Effect
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Modern Loading State with Animation
    if (isLoading) {
        return (
            // Loading screen retains the gradient for a consistent dark pre-load feel
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                {/* Animated Loading Icon */}
                <div className="relative mb-8">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 animate-pulse"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">⚡</span>
                    </div>
                </div>
                
                {/* Loading Text */}
                <div className="text-center">
                    <p className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                        Loading AI Fitness System
                    </p>
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{animationDelay: '0s'}}></div>
                        <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>
        );
    }

    // Main Application Structure and Routing
    return (
        <Router>
            {/* RESTORED: app-background-image class for static image background */}
            <div className="App min-h-screen app-background-image"> 
                <Header user={user} onLogout={handleLogoutCallback} />
                
                <Routes>
                    {/* Password Reset Routes */}
                    <Route path="/password-recovery" element={<PasswordRecovery />} />
                    <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />
                    
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

                    {/* 1. STANDALONE DASHBOARD HUB PAGE */}
                    <Route 
                        path="/dashboard" 
                        element={
                            user ? (
                                <DashboardHubPage 
                                    profile={profile} 
                                    user={user}
                                />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        } 
                    />

                    {/* 2. DASHBOARD MODULES (SIDEBAR LAYOUT - /app/* routes) */}
                    <Route 
                        path="/app/*" 
                        element={
                            user ? (
                                <DashboardModuleContainer 
                                    profile={profile} 
                                    setProfile={setProfile} 
                                    fetchProfile={fetchProfile} 
                                    user={user}
                                />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        } 
                    />

                    {/* About Page Route */}
                    <Route path="/about" element={<AboutPage />} />
                    
                    {/* Fallback for unhandled paths (optional) */}
                    <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;