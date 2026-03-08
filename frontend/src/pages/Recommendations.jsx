import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaDumbbell, FaAppleAlt, FaSpa, FaSyncAlt, FaSpinner } from 'react-icons/fa';

const Recommendations = ({ profile }) => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timestamp, setTimestamp] = useState(null);
    const [initialLoadAttempted, setInitialLoadAttempted] = useState(false); 

    const fetchPlan = async () => {
        setLoading(true);
        setError('');
        
        if (!initialLoadAttempted) setInitialLoadAttempted(true);

        if (!profile.age || !profile.bmi || !profile.goal) {
            setPlan(null);
            setError("Please complete your Age, BMI, and Fitness Goal in the Profile module before generating a plan.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/recommendations/plan'); 
            setPlan(response.data);
            setTimestamp(new Date().toLocaleTimeString());
        } catch (err) {
            console.error('Failed to fetch personalized plan:', err.response?.data);
            setError(err.response?.data?.message || 'AI Planning service is unavailable. Check backend/Gemini key.');
        } finally {
            setLoading(false);
        }
    };

    const planSections = plan ? [
        { 
            title: 'Workout Focus', 
            data: plan.Workout, 
            icon: <FaDumbbell />,
            color: 'purple',
            gradient: 'from-purple-600/20 to-indigo-600/20',
            border: 'border-purple-500/40',
            textColor: 'text-purple-400',
            glow: 'hover:shadow-purple-500/20'
        },
        { 
            title: 'Meal Plan Focus', 
            data: plan.MealPlanFocus, 
            icon: <FaAppleAlt />,
            color: 'emerald',
            gradient: 'from-emerald-600/20 to-teal-600/20',
            border: 'border-emerald-500/40',
            textColor: 'text-emerald-400',
            glow: 'hover:shadow-emerald-500/20'
        },
        { 
            title: 'Mind & Recovery', 
            data: plan.MindRecovery, 
            icon: <FaSpa />,
            color: 'amber',
            gradient: 'from-amber-600/20 to-orange-600/20',
            border: 'border-amber-500/40',
            textColor: 'text-amber-400',
            glow: 'hover:shadow-amber-500/20'
        },
    ] : [];

    return (
        <div className="space-y-8">
            {/* Modern Header Section */}
            <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-6 shadow-xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-emerald-500 to-amber-500"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-grow">
                        <p className="text-slate-300 leading-relaxed">
                            Your <span className="font-semibold text-emerald-400">Daily Action Plan</span> is synthesized by Gemini based on your current stats, goals, and risk profile.
                        </p>
                        {timestamp && (
                            <p className="text-xs text-slate-500 mt-2">
                                Last generated: {timestamp}
                            </p>
                        )}
                    </div>
                    
                    <button
                        onClick={fetchPlan}
                        disabled={loading || error.includes('Please complete')}
                        className="group relative overflow-hidden px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/50 flex items-center gap-2 flex-shrink-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                        
                        <FaSyncAlt className={`relative z-10 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        <span className="relative z-10 hidden sm:inline">
                            {loading ? 'Generating...' : 'Regenerate Plan'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-12 shadow-xl">
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-purple-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 animate-pulse"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FaSpinner className="text-2xl text-white" />
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                Analyzing profile and structuring your personalized plan...
                            </p>
                            <div className="flex items-center justify-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{animationDelay: '0s'}}></div>
                                <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-red-900/30 border border-red-500/40 p-8 shadow-xl text-center">
                    <div className="relative z-10">
                        <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">⚠️</span>
                        </div>
                        <h3 className="font-bold text-2xl mb-3 text-red-300">Plan Generation Error</h3>
                        <p className="text-red-400 max-w-md mx-auto">{error}</p>
                    </div>
                </div>
            )}
            
            {/* Initial Empty State */}
            {!loading && planSections.length === 0 && !error && !initialLoadAttempted && (
                <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border-2 border-dashed border-slate-700/50 p-12 shadow-xl text-center">
                    <div className="relative z-10">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-2 border-purple-500/30 flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🎯</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-3">Ready to Build Your Plan?</h3>
                        <p className="text-slate-400 max-w-md mx-auto">
                            Click the <span className="font-semibold text-purple-400">Regenerate Plan</span> button to analyze your profile and generate your first personalized plan.
                        </p>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                </div>
            )}
            
            {/* Plan Sections Grid */}
            {planSections.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {planSections.map((section, index) => (
                        <div
                            key={index}
                            className={`group relative overflow-hidden p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${section.gradient} border ${section.border} shadow-xl transition-all duration-300 hover:scale-105 ${section.glow}`}
                        >
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="relative z-10">
                                {/* Icon and Title */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-slate-800/50 border ${section.border} flex items-center justify-center ${section.textColor} text-2xl group-hover:scale-110 transition-transform`}>
                                        {section.icon}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className={`text-xl font-bold ${section.textColor}`}>
                                            {section.title}
                                        </h3>
                                        <div className={`h-1 w-16 bg-gradient-to-r ${section.border.replace('border-', 'from-')} to-transparent rounded-full mt-1`}></div>
                                    </div>
                                </div>
                                
                                {/* Content */}
                                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
                                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                                        {section.data}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Recommendations;