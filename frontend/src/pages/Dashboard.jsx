import React, { useState } from 'react';
import ProfileForm from '../components/ProfileForm';
import RiskForm from '../components/RiskForm';
import CalorieUpload from '../components/CalorieUpload';
import ProgressChart from '../components/ProgressChart';
import NutrientWarning from '../components/NutrientWarning';
import Recommendations from '../pages/Recommendations';


// Systematically ordered menu for the sidebar
const DASHBOARD_MENU = [
    { id: 'profile', name: '👤 Profile & Goal', component: ProfileForm },
    { id: 'risk', name: '❤️ Health Risk Check', component: RiskForm },
    { id: 'calorie', name: '🥗 Calorie Estimation', component: CalorieUpload },
    { id: 'recommendations', name: '🧠 Personalized Plans', component: Recommendations },
    { id: 'analytics', name: '📊 Daily Analytics', component: ProgressChart },
];


const Dashboard = ({ profile, setProfile, fetchProfile }) => {
    // State to track which item in the sidebar is active (Defaulting to the Profile setup)
    const [activeModule, setActiveModule] = useState(DASHBOARD_MENU[0].id);
    
    // Find the component currently selected
    const ActiveComponent = DASHBOARD_MENU.find(item => item.id === activeModule)?.component;
    
    // Check for essential data needed for BMI/BMR/Risk Calculation
    const isProfileIncomplete = !profile.age || !profile.height || !profile.weight;

    // Props passed to the active component
    const componentProps = {
        profile,
        setProfile,
        fetchProfile,
        dailyCalorieTarget: profile.dailyCalorieTarget,
    };
    
    // Determine the title of the active content pane
    const activeTitle = DASHBOARD_MENU.find(item => item.id === activeModule)?.name;


    // --- RENDERING ---
    return (
        <div className="flex min-h-[calc(100vh-68px)] bg-[#0D1117] text-white">

            {/* Left Sidebar (20%) - The Control Panel */}
            <div className="w-1/5 bg-sidebar p-4 shadow-xl border-r border-[#333] min-w-[250px] flex flex-col">
                <h3 className="text-lg font-semibold mb-6 text-ai-green border-b border-[#2D333B] pb-3">
                    System Modules
                </h3>
                
                {/* Nutrient Warning fixed at the top of the sidebar */}
                <div className="mb-8">
                    <NutrientWarning /> 
                </div>

                {/* Navigation Links */}
                <div className="space-y-3 flex-grow">
                    {DASHBOARD_MENU.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveModule(item.id)}
                            className={`w-full text-left p-3 rounded-lg transition-all text-sm font-medium relative 
                                ${activeModule === item.id ? 
                                    // FIXED: Removed border-l-4 and border-accent-blue classes. 
                                    // The 'active-accent-border' class handles the visual stripe via index.css.
                                    'bg-[#2D333B] text-ai-green shadow-md active-accent-border' : 
                                    'hover:bg-[#1E1E1E] text-gray-300'
                                }`}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Content Area (80%) - The Focus Panel */}
            <div className="w-4/5 p-8 bg-[#0D1117] overflow-y-auto">
                <div className="bg-card p-6 rounded-xl shadow-ai border border-[#161B22]">
                    <h2 className="text-3xl font-bold mb-6 text-ai-green tracking-wide border-b border-[#2D333B] pb-3">
                        {activeTitle}
                    </h2>

                    {/* Conditional Rendering of the Active Module */}
                    <div className="min-h-[600px]">
                        {ActiveComponent && (
                            // Apply conditional rendering for modules that require data setup
                            (activeModule === 'risk' && isProfileIncomplete) ? (
                                <p className="text-red-400 p-8">
                                    🛑 Data Insufficient. Please complete Age, Height, and Weight in the **Profile & Goal** module to run this diagnosis.
                                </p>
                            ) : (
                                // Render the chosen module component
                                <ActiveComponent {...componentProps} />
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;