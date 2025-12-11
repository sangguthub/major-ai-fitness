import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/'); // Redirect to landing page after logout
    };

    return (
        <header className="bg-[#10151a] shadow-lg border-b border-[#1E1E1E] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                
                {/* Logo / Brand */}
                <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2 text-2xl font-extrabold text-ai-green tracking-wider transition-colors duration-300 hover:text-accent-blue">
                    <span>AI Fitness System</span>
                </Link>
                
                {/* Navigation and Auth Buttons */}
                <nav className="flex items-center space-x-6">
                    <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium">
                        About
                    </Link>

                    {user ? (
                        // Logged-in view
                        <>
                            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium flex items-center space-x-1">
                                <FaUserCircle />
                                <span>Dashboard</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-red-400 hover:text-red-500 transition-colors duration-300 flex items-center space-x-1"
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        // Logged-out view
                        <Link to="/auth/login" className="btn-primary text-sm font-medium py-2 px-4 rounded transition duration-300">
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;