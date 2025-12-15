import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { FaHeartbeat, FaWeight, FaBullseye, FaChartLine, FaExclamationTriangle, FaRobot, FaSitemap, FaEnvelope, FaUser } from 'react-icons/fa';

const DashboardHubPage = ({ user }) => {
    
    const navigate = useNavigate(); 

    const [profile, setProfile] = useState({});
    const [nutrientWarnings, setNutrientWarnings] = useState([]); 
    const [loading, setLoading] = useState(true); // Corrected: useState(true)
    const [error, setError] = useState('');

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const profileResponse = await api.get('/profile');
            const profileData = profileResponse.data.profile || {};
            setProfile(profileData);
            
            const warningsResponse = await api.get('/nutrients/check');
            setNutrientWarnings(warningsResponse.data.warnings || []); 

        } catch (err) {
            console.error("Failed to fetch dashboard hub data:", err.response?.data || err);
            setError("Failed to load user data or connect to analytics services.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const { 
        name, 
        email, 
        latestRiskScore = 'N/A', 
        bmi = 0, 
        goal = 'Maintain', 
        dailyCalorieTarget = 'N/A',
        login_streak = 0,
        age, 
        height, 
        weight
    } = profile;

    const userEmail = user?.email || email || 'N/A';
    const userName = name || user?.name || 'User';

    const isProfileIncomplete = !age || !height || !weight || age === 0 || height === 0 || weight === 0;

    // BMI Status Logic
    const getBmiStatus = (bmiValue) => {
        if (bmiValue <= 0 || isNaN(bmiValue)) return { status: 'Unknown', color: 'text-slate-400' };
        if (bmiValue < 18.5) return { status: 'Underweight', color: 'text-orange-400' };
        if (bmiValue >= 18.5 && bmiValue < 25) return { status: 'Normal', color: 'text-emerald-400' };
        if (bmiValue >= 25 && bmiValue < 30) return { status: 'Overweight', color: 'text-amber-400' };
        return { status: 'Obese', color: 'text-red-400' };
    };

    const bmiStatus = getBmiStatus(bmi);

    const getRiskColor = (score) => {
        if (score === 'High') return 'from-red-600/20 to-rose-700/20 text-red-400 border-red-500/40';
        if (score === 'Medium') return 'from-orange-600/20 to-amber-700/20 text-orange-400 border-orange-500/40';
        return 'from-emerald-600/20 to-teal-700/20 text-emerald-400 border-emerald-500/40';
    };

    const handleMetricClick = () => {
        navigate('/app/analytics'); 
    };

    const accessModules = [
        { path: '/app/profile', label: 'Update Profile & Goals', color: 'emerald', icon: '👤' },
        { path: '/app/risk', label: 'Run Health Risk Check', color: 'red', icon: '❤️' },
        { path: '/app/coach', label: 'Get AI Coach Tips', color: 'cyan', icon: '🤖' },
        { path: '/app/analytics', label: 'View Historical Analytics', color: 'teal', icon: '📊' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
                <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 animate-pulse"></div>
                    </div>
                </div>
                <p className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Loading Dashboard Data...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center mx-auto mb-4">
                        <FaExclamationTriangle className="text-4xl text-red-400" />
                    </div>
                    <p className="text-xl text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        // REMOVED OPAQUE BACKGROUND HERE to show the main app background image
        <div className="min-h-screen p-8"> 
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Modern Header with Gradient and User Info */}
                <header className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-8 shadow-2xl">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <span className="text-3xl">👋</span>
                            </div>
                            <div>
                                <h1 className="text-5xl font-black">
                                    <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        {userName}
                                    </span>
                                </h1>
                                <div className="h-1 w-32 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full mt-2"></div>
                            </div>
                        </div>
                        
                        {/* USER NAME AND EMAIL SECTION */}
                        <div className="flex flex-wrap gap-6 text-slate-300 text-sm">
                            <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                <FaUser className="text-emerald-400" /> {userName}
                            </span>
                            <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                <FaEnvelope className="text-teal-400" /> {userEmail}
                            </span>
                        </div>

                        <p className="text-slate-400 text-lg mt-4 leading-relaxed">
                            Consolidated summary of your health status, recent activity, and AI service operational status.
                        </p>
                    </div>
                    
                    {/* Background gradient orbs */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
                </header>
                
                {/* Profile Incompleteness Warning Banner */}
                {isProfileIncomplete && (
                    <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-red-900/30 border-2 border-red-500/50 shadow-2xl shadow-red-500/20 p-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-transparent"></div>
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                                    <FaExclamationTriangle className="text-3xl text-red-400 animate-pulse" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-red-300 mb-2">ACTION REQUIRED: Complete Your Profile!</h3>
                                <p className="text-slate-200">
                                    Key metrics (Age, Height, Weight) are missing. Please visit the <span className="font-semibold text-red-300">Profile & Goals</span> module to unlock BMI calculation, Risk Diagnosis, and personalized AI plans.
                                </p>
                            </div>
                            <button 
                                onClick={() => navigate('/app/profile')}
                                className="flex-shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold hover:from-red-500 hover:to-rose-500 transition-all shadow-lg hover:shadow-red-500/50 hover:scale-105"
                            >
                                Go to Profile
                            </button>
                        </div>
                    </div>
                )}

                {/* Key Health Metrics - Enhanced Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                    {/* Streak Card */}
                    <button 
                        onClick={handleMetricClick} 
                        className="group relative overflow-hidden p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-amber-600/20 to-orange-700/20 border border-amber-500/40 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-amber-500/30"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FaChartLine className="text-2xl text-amber-400" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider text-amber-400/80">Current Streak</p>
                            <h2 className="text-5xl font-black mt-2 text-amber-400">{login_streak}</h2>
                            <p className="text-sm font-semibold text-amber-400/60 mt-1">Days</p>
                        </div>
                    </button>

                    {/* BMI Card */}
                    <button 
                        onClick={handleMetricClick}
                        className={`group relative overflow-hidden p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br border shadow-xl transition-all duration-300 hover:scale-105 ${getRiskColor(latestRiskScore)}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FaWeight className="text-2xl" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Current BMI</p>
                            <h2 className="text-5xl font-black mt-2">{typeof bmi === 'number' && !isNaN(bmi) && bmi > 0 ? bmi.toFixed(2) : 'N/A'}</h2>
                            {/* BMI STATUS INFORMATION */}
                            <p className={`text-sm font-bold mt-2 ${bmiStatus.color}`}>
                                {bmiStatus.status}
                            </p>
                        </div>
                    </button>

                    {/* Risk Score Card */}
                    <button 
                        onClick={handleMetricClick}
                        className={`group relative overflow-hidden p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br border shadow-xl transition-all duration-300 hover:scale-105 ${getRiskColor(latestRiskScore)}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FaHeartbeat className="text-2xl" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-80">AI Health Risk</p>
                            <h2 className="text-5xl font-black mt-2">{latestRiskScore}</h2>
                        </div>
                    </button>

                    {/* Calorie Target Card */}
                    <button 
                        onClick={handleMetricClick}
                        className="group relative overflow-hidden p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-teal-600/20 to-cyan-700/20 border border-teal-500/40 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-teal-500/30"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FaBullseye className="text-2xl text-teal-400" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider text-teal-400/80">Calorie Target</p>
                            <h2 className="text-4xl font-black mt-2 text-teal-400">{dailyCalorieTarget}</h2>
                            <p className="text-sm font-semibold text-teal-400/60 mt-1">kcal</p>
                        </div>
                    </button>
                </div>

                {/* Actionable Insights & Warnings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Nutrient Warnings */}
                    <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-6 shadow-xl">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                                <FaExclamationTriangle className="text-red-400" />
                            </div>
                            Critical Insights
                        </h3>
                        <div className="space-y-3">
                            {nutrientWarnings.length > 0 ? (
                                nutrientWarnings.map((warning, index) => (
                                    <div key={index} className="p-4 rounded-xl bg-red-900/30 border border-red-500/30 text-sm">
                                        <p className="font-bold text-red-300 mb-2">
                                            {warning.nutrient} Warning ({warning.status})
                                        </p>
                                        <p className="text-red-400/90">
                                            {warning.message}
                                        </p>
                                        <p className="text-xs text-red-400/70 mt-2">
                                            Intake: {warning.intake} / Target: {warning.target}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-500/30 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                        <FaChartLine className="text-emerald-400" />
                                    </div>
                                    <p className="text-sm text-emerald-400">
                                        No immediate nutrient warnings detected. Data looks balanced!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Intelligence Status */}
                    <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-6 shadow-xl">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                                <FaRobot className="text-cyan-400" />
                            </div>
                            Intelligence Status
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: "AI Coach (Gemini)", status: "Active", color: "text-cyan-400", bg: "bg-cyan-500/20" },
                                { name: "Risk Prediction ML", status: "Operational", color: "text-emerald-400", bg: "bg-emerald-500/20" },
                                { name: "Image Vision Service", status: "Simulated/Ready", color: "text-amber-400", bg: "bg-amber-500/20" },
                                { name: "Data Microservice", status: "Online", color: "text-teal-400", bg: "bg-teal-500/20" },
                            ].map((service, index) => (
                                <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                    <span className="text-slate-300 flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${service.bg} ${service.color}`}></div>
                                        {service.name}
                                    </span>
                                    <span className={`text-sm font-bold px-3 py-1 rounded-lg ${service.bg} ${service.color}`}>
                                        {service.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                
                {/* Access Modules */}
                <div className="pt-4">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                            <FaSitemap className="text-white" />
                        </div>
                        Access Modules
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {accessModules.map((module) => (
                            <button
                                key={module.path}
                                onClick={() => navigate(module.path)}
                                className="group relative overflow-hidden p-6 rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 hover:border-emerald-500/50 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{module.icon}</span>
                                    <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors leading-snug">
                                        {module.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardHubPage;