import React from 'react';
import NutrientWarning from './NutrientWarning';

// Systematically ordered menu for the sidebar
const DASHBOARD_MENU = [
    { id: 'profile', name: 'Profile & Goal', icon: '👤' },
    { id: 'risk', name: 'Health Risk Check', icon: '❤️' },
    { id: 'calorie', name: 'Calorie Estimation', icon: '🥗' },
    { id: 'recommendations', name: 'Personalized Plans', icon: '🧠' },
    { id: 'analytics', name: 'Daily Analytics', icon: '📊' },
];

const Sidebar = ({ activeModule, setActiveModule }) => {

    return (
        // Modern Sidebar with Glassmorphism
        <div className="w-72 backdrop-blur-xl bg-slate-900/40 border-r border-slate-800/50 shadow-2xl flex flex-col h-full relative">
            {/* Gradient Accent Line */}
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500"></div>
            
            {/* Header Section */}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="text-xl">⚡</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Control Panel
                        </h3>
                        <div className="h-0.5 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-1"></div>
                    </div>
                </div>
                
                {/* Nutrient Warning */}
                <div className="mb-6">
                    <NutrientWarning />
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 pb-6 space-y-2 overflow-y-auto">
                {DASHBOARD_MENU.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveModule(item.id)}
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
                            {/* Icon */}
                            <div className={`text-2xl transition-transform duration-300 ${
                                activeModule === item.id ? 'scale-110' : 'group-hover:scale-110'
                            }`}>
                                {item.icon}
                            </div>
                            
                            {/* Label */}
                            <span className={`text-sm font-semibold transition-colors ${
                                activeModule === item.id ? 
                                    'bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent' : 
                                    'text-slate-300 group-hover:text-white'
                            }`}>
                                {item.name}
                            </span>
                        </div>

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </button>
                ))}
            </nav>
            
            {/* Footer - System Status */}
            <div className="relative overflow-hidden mt-auto p-4 border-t border-slate-800/50">
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-emerald-400">AI System Status</p>
                        <p className="text-xs text-slate-400">Online & Operational</p>
                    </div>
                </div>
                
                {/* Subtle background glow */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
};

export default Sidebar;