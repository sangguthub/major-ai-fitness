// src/pages/Dashboard.jsx
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

  // Find the active menu item & component
  const activeItem = DASHBOARD_MENU.find((item) => item.id === activeModule);
  const ActiveComponent = activeItem?.component;

  // Guard against null/undefined profile
  const safeProfile = profile || {};

  // Check for essential data needed for BMI/BMR/Risk Calculation
  const isProfileIncomplete =
    !safeProfile.age || !safeProfile.height || !safeProfile.weight;

  // Props passed to the active component
  const componentProps = {
    profile: safeProfile,
    setProfile,
    fetchProfile,
    dailyCalorieTarget: safeProfile.dailyCalorieTarget,
  };

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
                ${
                  activeModule === item.id
                    ? 'bg-[#2D333B] text-ai-green shadow-md active-accent-border'
                    : 'hover:bg-[#1E1E1E] text-gray-300'
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
            {activeItem?.name}
          </h2>

          {/* Conditional Rendering of the Active Module */}
          <div className="min-h-[600px]">
            {ActiveComponent && (
              activeModule === 'risk' && isProfileIncomplete ? (
                <p className="text-red-400 p-8">
                  🛑 Data Insufficient. Please complete Age, Height, and Weight in the{' '}
                  <span className="font-semibold text-ai-green">
                    Profile &amp; Goal
                  </span>{' '}
                  module to run this diagnosis.
                </p>
              ) : (
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
