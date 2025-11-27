import React from 'react';
import NutrientWarning from './NutrientWarning';

// Systematically ordered menu for the sidebar
const DASHBOARD_MENU = [
    { id: 'profile', name: '👤 Profile & Goal' },
    { id: 'risk', name: '❤️ Health Risk Check' },
    { id: 'calorie', name: '🥗 Calorie Estimation' },
    { id: 'recommendations', name: '🧠 Personalized Plans' },
    { id: 'analytics', name: '📊 Daily Analytics' },
];

const Sidebar = ({ activeModule, setActiveModule }) => {

    return (
        // Sidebar Container (Approx 20% width)
        <div className="w-1/5 bg-sidebar p-5 shadow-xl border-r border-[#333] min-w-[250px] flex flex-col h-full">
            
            <h3 className="text-lg font-semibold mb-6 text-ai-green border-b border-[#2D333B] pb-3 tracking-wider">
                Control Panel
            </h3>
            
            {/* Nutrient Warning fixed at the top of the sidebar */}
            <div className="mb-8">
                <NutrientWarning />
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow space-y-3">
                {DASHBOARD_MENU.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveModule(item.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all text-sm font-medium relative 
                            ${activeModule === item.id ? 
                                'bg-accent-blue text-white shadow-md border-l-4 border-accent-blue' : // Active state
                                'hover:bg-[#1E1E1E] text-gray-300'
                            }`}
                    >
                        {item.name}
                    </button>
                ))}
            </nav>
            
            {/* Footer or System Status */}
            <div className="mt-auto pt-4 border-t border-[#333] text-xs text-gray-500">
                <p>AI System Status: Online</p>
            </div>
        </div>
    );
};

export default Sidebar;