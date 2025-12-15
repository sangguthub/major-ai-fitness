// import React from 'react';
// import { FaHeartbeat, FaWeight, FaBullseye, FaChartLine, FaExclamationTriangle, FaRobot, FaUtensils } from 'react-icons/fa';

// // FIX: Provide default empty objects/arrays for props that might be undefined 
// // during initial render or before data fetching is complete.
// const DashboardSummary = ({ profile = {}, nutrientWarnings = [] }) => {
    
//     // Safely destructure properties from the profile object
//     const { 
//         name, 
//         latestRiskScore = 'N/A', 
//         bmi = 0, 
//         goal = 'Maintain', 
//         dailyCalorieTarget = 'N/A',
//         weight = 'N/A',
//         login_streak = 0
//     } = profile;

//     // Helper to determine risk card color
//     const getRiskColor = (score) => {
//         if (score === 'High') return 'from-red-600/20 to-rose-700/20 text-red-400 border-red-500/30';
//         if (score === 'Medium') return 'from-orange-600/20 to-amber-700/20 text-orange-400 border-orange-500/30';
//         // Default (Low Risk/N/A) uses the main theme color
//         return 'from-emerald-600/20 to-teal-700/20 text-emerald-400 border-emerald-500/30';
//     };

//     return (
//         <div className="space-y-8">
//             {/* --- 1. WELCOME & KEY HEALTH METRICS (3-Column Grid) --- */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//                 {/* A. Welcome Card (High-Impact Header) */}
//                 <div className="md:col-span-2 p-6 rounded-2xl backdrop-blur-md bg-slate-800/60 border border-slate-700/50 shadow-2xl">
//                     <h1 className="text-3xl font-extrabold text-white mb-2">
//                         Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{name || 'User'}!</span>
//                     </h1>
//                     <p className="text-slate-400 text-lg mb-4">
//                         Your health snapshot provides an overview of your current progress and actionable intelligence.
//                     </p>
//                     <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 text-sm font-semibold">
//                         <FaChartLine />
//                         Current Streak: {login_streak} Days
//                     </div>
//                 </div>

//                 {/* B. BMI Card */}
//                 <div className={`p-6 rounded-2xl backdrop-blur-md border shadow-lg ${getRiskColor(latestRiskScore)}`}>
//                     <FaWeight className="text-3xl mb-2 opacity-70" />
//                     <p className="text-xs font-semibold uppercase tracking-wider">Current BMI</p>
//                     {/* Ensure toFixed() is only called if bmi is a number */}
//                     <h2 className="text-4xl font-black mt-1">{typeof bmi === 'number' && !isNaN(bmi) ? bmi.toFixed(2) : 'N/A'}</h2> 
//                 </div>

//                 {/* C. Risk Score Card */}
//                 <div className={`p-6 rounded-2xl backdrop-blur-md border shadow-lg ${getRiskColor(latestRiskScore)}`}>
//                     <FaHeartbeat className="text-3xl mb-2 opacity-70" />
//                     <p className="text-xs font-semibold uppercase tracking-wider">AI Health Risk</p>
//                     <h2 className="text-4xl font-black mt-1">{latestRiskScore}</h2>
//                 </div>
//             </div>

//             {/* --- 2. ACTIONABLE INSIGHTS & WARNINGS (2-Column) --- */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
//                 {/* A. Nutrient Warnings */}
//                 <div className="lg:col-span-2">
//                     <h3 className="text-xl font-bold text-slate-300 mb-3 flex items-center gap-2">
//                         <FaExclamationTriangle className="text-red-400" /> Action Required
//                     </h3>
//                     <div className="rounded-2xl backdrop-blur-md bg-slate-800/60 border border-slate-700/50 shadow-lg p-4">
//                         <div className="flex flex-col space-y-3">
//                             {/* The error was fixed by ensuring nutrientWarnings defaults to [] */}
//                             {nutrientWarnings.length > 0 ? (
//                                 nutrientWarnings.map((warning, index) => (
//                                     <div key={index} className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-sm text-red-400">
//                                         {warning}
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-lg text-sm text-emerald-400 flex items-center gap-2">
//                                     <FaChartLine />
//                                     No immediate nutrient warnings detected. Keep up the consistent logging!
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* B. Goal Status Card */}
//                 <div className={`p-6 rounded-2xl backdrop-blur-md bg-slate-800/60 border border-slate-700/50 shadow-lg`}>
//                     <FaBullseye className="text-4xl mb-3 text-teal-400" />
//                     <p className="text-md font-semibold uppercase tracking-wider text-teal-400">Primary Goal: {goal}</p>
//                     <div className="h-1 w-12 bg-teal-500 rounded-full my-2"></div>
//                     <p className="text-slate-300">
//                         Daily Calorie Target: <span className="font-bold text-white">{dailyCalorieTarget} kcal</span>
//                     </p>
//                     <p className="text-slate-300 text-sm mt-1">
//                         Use the Calorie Estimation module to stay on target.
//                     </p>
//                 </div>
//             </div>

//             {/* --- 3. INTELLIGENCE TIER OVERVIEW (Links/Status) --- */}
//             <h3 className="text-xl font-bold text-slate-300 pt-4 mb-3 flex items-center gap-2">
//                 <FaRobot className="text-cyan-400" /> Intelligence Status
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
//                 {/* AI Coach Status */}
//                 <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-700/50 flex items-center justify-between">
//                     <span className="text-slate-300">AI Maintenance Coach</span>
//                     <span className="text-sm font-semibold text-cyan-400">Active</span>
//                 </div>
                
//                 {/* Prediction Service Status */}
//                 <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-700/50 flex items-center justify-between">
//                     <span className="text-slate-300">Risk Prediction ML</span>
//                     <span className="text-sm font-semibold text-emerald-400">Operational</span>
//                 </div>

//                 {/* Latest Log Status */}
//                 <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-700/50 flex items-center justify-between">
//                     <span className="text-slate-300">Last Logged Meal</span>
//                     <span className="text-sm font-semibold text-amber-400">Today</span>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default DashboardSummary;