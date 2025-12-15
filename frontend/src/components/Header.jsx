import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
        <header className="backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50 sticky top-0 z-50 shadow-2xl">
            {/* Subtle gradient line at top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                
                {/* Logo / Brand with modern styling */}
                <Link 
                    to={user ? "/dashboard" : "/"} 
                    className="group flex items-center space-x-3 transition-all duration-300"
                >
                    {/* Logo Icon */}
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow duration-300">
                            <span className="text-xl font-bold text-white">⚡</span>
                        </div>
                        {/* Animated ring on hover */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Brand Text */}
                    <span className="text-2xl font-black tracking-tight">
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-teal-300 transition-all duration-300">
                            AI Fitness
                        </span>
                        <span className="text-slate-300 ml-1">System</span>
                    </span>
                </Link>
                
                {/* Navigation and Auth Buttons */}
                <nav className="flex items-center space-x-2">
                    {/* About Link */}
                    <Link 
                        to="/about" 
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                    >
                        About
                    </Link>

                    {user ? (
                        // Logged-in view
                        <>
                            {/* Dashboard Link */}
                            <Link 
                                to="/dashboard" 
                                className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                            >
                                <FaUserCircle className="text-lg group-hover:text-emerald-400 transition-colors duration-300" />
                                <span>Dashboard</span>
                            </Link>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 border border-transparent hover:border-red-500/30"
                            >
                                <FaSignOutAlt className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        // Logged-out view - Modern gradient button
                        <Link 
                            to="/auth/login" 
                            className="relative group overflow-hidden px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105"
                        >
                            {/* Gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 group-hover:from-emerald-400 group-hover:to-teal-500 transition-all duration-300"></div>
                            
                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                            
                            {/* Button text */}
                            <span className="relative z-10">Login</span>
                            
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300"></div>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;