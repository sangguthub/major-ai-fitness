import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaRobot, FaSyncAlt, FaSpinner } from 'react-icons/fa'; 

const MaintenanceCoach = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timestamp, setTimestamp] = useState(null);
    const [initialLoadAttempted, setInitialLoadAttempted] = useState(false); 

    const fetchAdvice = async () => {
        setLoading(true);
        setError('');
        
        if (!initialLoadAttempted) setInitialLoadAttempted(true);

        try {
            const response = await api.post('/ai/maintenance-coach', {});
            setSuggestions(response.data || []); 
            setTimestamp(new Date().toLocaleTimeString());
        } catch (err) {
            console.error('Failed to fetch AI advice:', err.response?.data || err);
            setError(err.response?.data?.message || 'Could not connect to the AI Coach. Check the Gemini API Key and backend server.');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryClasses = (category) => {
        if (category.includes('Daily')) return {
            border: 'border-purple-500/40', 
            text: 'text-purple-400',
            bg: 'from-purple-600/20 to-indigo-600/20',
            glow: 'hover:shadow-purple-500/20'
        };
        if (category.includes('Dietary')) return {
            border: 'border-emerald-500/40', 
            text: 'text-emerald-400',
            bg: 'from-emerald-600/20 to-teal-600/20',
            glow: 'hover:shadow-emerald-500/20'
        };
        return {
            border: 'border-amber-500/40', 
            text: 'text-amber-400',
            bg: 'from-amber-600/20 to-orange-600/20',
            glow: 'hover:shadow-amber-500/20'
        };
    };

    return (
        <div className="space-y-8">
            {/* Modern Header */}
            <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-6 shadow-xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Title Section */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <FaRobot className="text-2xl text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                AI Maintenance Coach
                            </h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-1"></div>
                        </div>
                    </div>
                    
                    {/* Action Section */}
                    <div className="flex items-center gap-3">
                        {timestamp && (
                            <span className="text-xs text-slate-400 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 hidden sm:block">
                                Last update: {timestamp}
                            </span>
                        )}
                        <button
                            onClick={fetchAdvice}
                            
                            disabled={loading}
                            className="group relative overflow-hidden px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/50 flex items-center gap-2"
                        >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                            
                            <FaSyncAlt className={`relative z-10 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                            <span className="relative z-10 hidden sm:inline">
                                {loading ? 'Generating...' : 'Regenerate Tips'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-12 shadow-xl">
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div className="relative">
                            {/* Outer spinning ring */}
                            <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-purple-500 animate-spin"></div>
                            {/* Inner pulsing circle */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 animate-pulse"></div>
                            </div>
                            {/* Center icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FaRobot className="text-2xl text-white" />
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                Generating hyper-personalized suggestions...
                            </p>
                            <div className="flex items-center justify-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{animationDelay: '0s'}}></div>
                                <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-red-900/30 border border-red-500/40 p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <p className="text-red-400">{error}</p>
                    </div>
                </div>
            )}

            {/* Initial Empty State - Before First Load */}
            {!loading && suggestions.length === 0 && !error && !initialLoadAttempted && (
                <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border-2 border-dashed border-slate-700/50 p-12 shadow-xl text-center">
                    <div className="relative z-10">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-2 border-purple-500/30 flex items-center justify-center mx-auto mb-6">
                            <FaRobot className="text-4xl text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-3">Ready to Get Started?</h3>
                        <p className="text-slate-400 max-w-md mx-auto">
                            Click the <span className="font-semibold text-purple-400">Regenerate Tips</span> button to start the AI Coach and receive your first set of personalized tips.
                        </p>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                </div>
            )}
            
            {/* Empty State - After Load Attempt */}
            {!loading && suggestions.length === 0 && !error && initialLoadAttempted && (
                <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border-2 border-dashed border-slate-700/50 p-12 shadow-xl text-center">
                    <div className="relative z-10">
                        <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🤔</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-3">No Tips Available</h3>
                        <p className="text-slate-400 max-w-md mx-auto">
                            No personalized tips were returned. Try again or check the backend logs.
                        </p>
                    </div>
                </div>
            )}

            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suggestions.map((tip, index) => {
                    const classes = getCategoryClasses(tip.category);
                    
                    return (
                        <div
                            key={index}
                            className={`group relative overflow-hidden p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${classes.bg} border ${classes.border} shadow-xl transition-all duration-300 hover:scale-105 ${classes.glow}`}
                        >
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="relative z-10">
                                {/* Icon Badge */}
                                <div className={`w-16 h-16 rounded-2xl bg-slate-800/50 border ${classes.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <div className={`text-4xl ${classes.text}`}>
                                        {tip.icon}
                                    </div>
                                </div>
                                
                                {/* Category */}
                                <h4 className={`font-bold text-lg mb-3 ${classes.text}`}>
                                    {tip.category}
                                </h4>
                                
                                {/* Tip Content */}
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {tip.tip}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MaintenanceCoach;