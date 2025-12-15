// import React from 'react';
// import { FaUserCircle, FaEnvelope, FaWeight, FaRulerVertical, FaCalendarAlt, FaFireAlt, FaChartLine } from 'react-icons/fa'; 

// // Helper component for clean metric display
// const SummaryItem = ({ title, value, color }) => (
//     <div className="bg-[#161B22] p-4 rounded-lg border border-[#2D333B]">
//         <p className="text-xs text-gray-500">{title}</p>
//         <p className={`text-lg font-semibold ${color}`}>{value}</p>
//     </div>
// );

// const ProfileSummary = ({ profile, user }) => {
    
//     // Destructure core data from profile and user props
//     const { name, email } = user || {};
//     const { 
//         age, gender, height, weight, bmi, tdee, dailyCalorieTarget,
//         activityLevel, goal, dietPreference, login_streak,
//         latestRiskScore // <<< NEW FIELD DESTRUCTURED HERE
//     } = profile;

//     // Map numerical values to user-friendly strings
//     const activityMap = { 0: 'Sedentary', 1: 'Active', 2: 'Very Active' };
//     const goalMap = { 'maintain': 'Maintain Weight', 'lose': 'Lose Weight', 'gain': 'Gain Weight' };
    
//     // Helper function to color the risk score
//     const getRiskColor = (score) => {
//         if (score === 'High') return 'text-red-500';
//         if (score === 'Medium') return 'text-yellow-500';
//         if (score === 'Low') return 'text-ai-green';
//         return 'text-gray-400';
//     };

//     return (
//         <div className="space-y-6">
            
//             {/* --- User Identity Card --- */}
//             <div className="bg-[#161B22] p-6 rounded-xl border border-[#2D333B] shadow-lg flex items-center space-x-6">
//                 <FaUserCircle className="text-6xl text-ai-green" />
//                 <div>
//                     <h3 className="text-3xl font-extrabold text-white">{name || "User"}</h3>
//                     <p className="text-lg text-gray-400 flex items-center space-x-2">
//                         <FaEnvelope className="text-accent-blue" />
//                         <span>{email || "N/A"}</span>
//                     </p>
//                     {login_streak > 0 && (
//                          <p className="mt-2 text-lg font-bold text-yellow-400 flex items-center">
//                             <FaFireAlt className="mr-2" />
//                             Current Streak: {login_streak} Day{login_streak !== 1 && 's'}
//                         </p>
//                     )}
//                 </div>
//             </div>

//             {/* --- Core Biometrics & Goals --- */}
//             <h4 className="text-2xl font-bold text-accent-blue border-b border-[#2D333B] pb-2 pt-4">Health Metrics Overview</h4>

//             <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                
//                 {/* Metric Card Component */}
//                 {([
//                     { label: 'BMI Score', value: bmi || 'N/A', icon: FaChartLine, color: 'text-red-400' }, 
//                     { label: 'TDEE (Maintenance)', value: `${tdee || 'N/A'} kcal`, icon: FaChartLine, color: 'text-ai-green' },
//                     { label: 'Daily Calorie Target', value: `${dailyCalorieTarget || 'N/A'} kcal`, icon: FaChartLine, color: 'text-blue-400' },
//                     { label: 'Weight', value: `${weight || 'N/A'} kg`, icon: FaWeight, color: 'text-gray-400' },
//                     { label: 'Height', value: `${height || 'N/A'} cm`, icon: FaRulerVertical, color: 'text-gray-400' },
//                     { label: 'Age / Gender', value: `${age || 'N/A'} / ${gender || 'N/A'}`, icon: FaCalendarAlt, color: 'text-gray-400' },
//                 ]).map((item, index) => (
//                     <div key={index} className="bg-[#161B22] p-4 rounded-lg border border-[#2D333B] flex items-center space-x-4">
//                         <item.icon className={`text-2xl ${item.color}`} />
//                         <div>
//                             <p className="text-xs text-gray-500">{item.label}</p>
//                             <p className="text-lg font-semibold text-white">{item.value}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* --- Lifestyle & Activity Summary --- */}
//             <h4 className="text-2xl font-bold text-accent-blue border-b border-[#2D333B] pb-2 pt-4">Lifestyle & Goals</h4>
            
//             <div className="grid grid-cols-2 gap-4">
//                 <SummaryItem title="Current Goal" value={goalMap[goal] || 'N/A'} color="text-indigo-400" />
//                 <SummaryItem title="Activity Level" value={activityMap[activityLevel] || 'N/A'} color="text-yellow-400" />
//                 <SummaryItem title="Diet Preference" value={dietPreference || 'N/A'} color="text-green-400" />
                
//                 {/* DISPLAY THE DYNAMIC RISK SCORE HERE */}
//                 <SummaryItem 
//                     title="Latest Risk Score" 
//                     value={latestRiskScore || "(Run Check)"} 
//                     color={getRiskColor(latestRiskScore)} 
//                 />
                
//             </div>
            
//             <p className="pt-6 text-sm text-gray-500">
//                 To update your prediction, please navigate to the 'Health Risk Check' module.
//             </p>
//         </div>
//     );
// };


// export default ProfileSummary;