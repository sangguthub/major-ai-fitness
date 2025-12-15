import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useLocation and useNavigate
import api from '../api/api';
import ProfileForm from '../components/ProfileForm';
import RiskForm from '../components/RiskForm';
import Recommendations from './Recommendations';
import CalorieUpload from '../components/CalorieUpload';
import ProgressChart from '../components/ProgressChart';
import NutrientWarning from '../components/NutrientWarning';
import MaintenanceCoach from '../components/MaintenanceCoach';

// --- Define the Module Menu and Path Mapping ---
const DASHBOARD_MENU = [
    // Removed 'summary' since DashboardHubPage now handles the summary view
    { id: 'profile', name: 'Profile & Goal', icon: '👤', component: ProfileForm, path: '/app/profile' },
    { id: 'risk', name: 'Health Risk Check', icon: '❤️', component: RiskForm, path: '/app/risk' },
    { id: 'calorie', name: 'Calorie Estimation', icon: '🥗', component: CalorieUpload, path: '/app/calorie' },
    { id: 'analytics', name: 'Daily Analytics', icon: '📊', component: ProgressChart, path: '/app/analytics' },
    { id: 'coach', name: 'AI Maintenance Coach', icon: '🤖', component: MaintenanceCoach, path: '/app/coach' },
    { id: 'recommendations', name: 'Personalized Plans', icon: '🧠', component: Recommendations, path: '/app/recommendations' },
];

const PATH_TO_MODULE_MAP = DASHBOARD_MENU.reduce((map, item) => {
    map[item.path] = item.id;
    return map;
}, {});

// Function to find the initial module based on the current URL
const getInitialModule = (pathname) => {
    return PATH_TO_MODULE_MAP[pathname] || 'profile'; // Default to 'profile' if no specific path is matched
};


const DashboardModuleContainer = ({ profile, setProfile, fetchProfile, user }) => { 
    
    const location = useLocation();
    const navigate = useNavigate();
    const [nutrientWarnings, setNutrientWarnings] = useState([]);
    
    // Set initial active module based on the current URL path
    const [activeModule, setActiveModule] = useState(getInitialModule(location.pathname));

    // --- EFFECT 1: Sync activeModule state with URL path ---
    useEffect(() => {
        const currentModuleId = PATH_TO_MODULE_MAP[location.pathname];
        if (currentModuleId && currentModuleId !== activeModule) {
            setActiveModule(currentModuleId);
        }
    }, [location.pathname]);

    // --- EFFECT 2: If the component loads on the base /app/ route, redirect to the first module ---
    useEffect(() => {
        if (location.pathname === '/app' || location.pathname === '/app/') {
            // Redirect to the default starting module (e.g., /app/profile)
            navigate('/app/profile', { replace: true });
        }
    }, [location.pathname, navigate]);


    const ActiveComponent = DASHBOARD_MENU.find(item => item.id === activeModule)?.component;
    const isProfileIncomplete = !profile.age || !profile.height || !profile.weight;

    const fetchNutrientWarnings = useCallback(async () => {
        try {
            const response = await api.get('/nutrients/check');
            setNutrientWarnings(response.data.warnings);
        } catch (err) {
            console.error("Nutrient check failed:", err.response?.status === 401 ? "Unauthorized or missing profile data" : err);
            setNutrientWarnings([]);
        }
    }, []); 

    useEffect(() => {
        fetchNutrientWarnings();
    }, [fetchNutrientWarnings]);

    const currentStreak = profile.login_streak || 0;

    const componentProps = {
        profile,
        user, 
        setProfile,
        fetchProfile,
        dailyCalorieTarget: profile.dailyCalorieTarget,
        fetchNutrientWarnings, 
        nutrientWarnings // Pass warnings to components that need them (like ProfileSummary, if it were here)
    };
    
    const activeTitle = DASHBOARD_MENU.find(item => item.id === activeModule)?.name;
    const activeIcon = DASHBOARD_MENU.find(item => item.id === activeModule)?.icon;

    // --- Navigation Handler for Sidebar Buttons ---
    const handleSidebarClick = (item) => {
        setActiveModule(item.id);
        navigate(item.path); // Update URL on click
    };

    return (
        <div className="flex min-h-[calc(100vh-68px)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            
            {/* Modern Sidebar with Glassmorphism */}
            <div className="w-72 backdrop-blur-xl bg-slate-900/40 border-r border-slate-800/50 shadow-2xl flex flex-col relative">
                {/* Gradient Accent Line */}
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500"></div>
                
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <span className="text-xl">⚡</span>
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Module Access
                        </h3>
                    </div>
                    
                    {/* Nutrient Warning Card */}
                    <div className="mb-6">
                        <NutrientWarning warnings={nutrientWarnings} /> 
                    </div>

                    {/* Daily Streak Badge */}
                    {currentStreak > 0 && (
                        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-sm shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg animate-pulse">
                                    <span className="text-2xl">🔥</span>
                                </div>
                                <div>
                                    <div className="text-xs text-amber-300/80 font-medium">Current Streak</div>
                                    <div className="text-2xl font-bold text-amber-400">{currentStreak} Day{currentStreak !== 1 && 's'}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 px-4 pb-6 space-y-2 overflow-y-auto">
                    {DASHBOARD_MENU.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleSidebarClick(item)} // Use the new handler
                            className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                                activeModule === item.id ? 
                                    'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 shadow-lg shadow-emerald-500/10' : 
                                    'hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50'
                            }`}
                        >
                            {/* Active indicator line */}
                            {activeModule === item.id && (
                                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500"></div>
                            )}
                            
                            <div className="flex items-center gap-4 p-4 pl-5">
                                <div className={`text-2xl transition-transform duration-300 ${
                                    activeModule === item.id ? 'scale-110' : 'group-hover:scale-110'
                                }`}>
                                    {item.icon}
                                </div>
                                <span className={`text-sm font-semibold transition-colors ${
                                    activeModule === item.id ? 
                                        'bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent' : 
                                        'text-slate-300 group-hover:text-white'
                                }`}>
                                    {item.name}
                                </span>
                            </div>

                            {/* Hover glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area with Modern Card Design */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="text-4xl">{activeIcon}</div>
                            <div>
                                <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                    {activeTitle}
                                </h2>
                                <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-2"></div>
                            </div>
                        </div>
                    </div>

                    {/* Content Card with Glassmorphism */}
                    <div className="backdrop-blur-xl bg-slate-900/40 rounded-3xl border border-slate-800/50 shadow-2xl overflow-hidden">
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none"></div>
                        
                        <div className="relative p-8">
                            <div className="min-h-[600px]">
                                {ActiveComponent && (
                                    (activeModule === 'risk' && isProfileIncomplete) ? (
                                        <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center mb-6 border border-red-500/30">
                                                <span className="text-5xl">🛑</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-red-400 mb-3">Data Insufficient</h3>
                                            <p className="text-slate-400 max-w-md">
                                                Please complete your Age, Height, and Weight in the <span className="text-emerald-400 font-semibold">Profile & Goal</span> module to run this diagnosis.
                                            </p>
                                        </div>
                                    ) : (
                                        <ActiveComponent {...componentProps} /> 
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardModuleContainer;