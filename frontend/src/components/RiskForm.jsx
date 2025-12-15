import React, { useState } from 'react';
import api from '../api/api';
import { FaHeartbeat, FaSpinner, FaChartLine, FaExclamationTriangle } from 'react-icons/fa'; 

// RiskForm now receives fetchProfile as a prop from Dashboard.jsx
const RiskForm = ({ profile, fetchProfile }) => { 
    const [formData, setFormData] = useState({
        family_history: 0, // 0=No, 1=Yes 
        sleep_time: 7.0,   // float
        junk_food_freq: 1  // 0=Rarely, 1=Weekly, 2=Daily 
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            // Handle checkbox (0/1) vs. number (float/int) conversion
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : (type === 'number' ? parseFloat(value) : parseInt(value))
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        setResult(null);
        setError('');

        // Ensure profile fields used in payload are available
        // NOTE: This checks if the user has completed their profile fields.
        if (!profile.bmi || !profile.age || profile.age === 0) {
            setError("Missing BMI or Age data. Please complete the Profile & Goals section first.");
            setLoading(false);
            return;
        }

        const payload = {
            // Core Biometrics
            bmi: profile.bmi, 
            age: profile.age,
            gender: profile.gender === 'male' ? 0 : 1, 
            activity_level: profile.activityLevel,
            
            // Existing Behavioral Inputs
            family_history: formData.family_history,
            sleep_time: formData.sleep_time,
            junk_food_freq: formData.junk_food_freq,

            // Advanced Risk Factor Inputs (using safe defaults if missing)
            // Ensure these fields are coming from your profile form and available in the profile object
            daily_water_intake: profile.daily_water_intake || 2.0, 
            veg_fruit_servings: profile.veg_fruit_servings || 3,
            processed_meat_freq: profile.processed_meat_freq || 1,
            sugary_drinks_freq: profile.sugary_drinks_freq || 1,
        };

        try {
            const response = await api.post('/risk/predict', payload);
            setResult(response.data.result);
            
            // CRITICAL FIX: Trigger the profile re-fetch to update the Dashboard's Risk Score metric
            if (fetchProfile) {
                await fetchProfile();
            }

        } catch (err) {
            console.error('Risk prediction failed:', err.response?.data);
            // Updated error message to hint at the backend dependency (Python service)
            setError(err.response?.data?.message || 'Prediction service is unavailable (Check Python service status)');
        } finally {
            setLoading(false);
        }
    };

    // Helper function to dynamically map risk level to colors (using new purple accent)
    const getRiskColorClass = (risk) => {
        if (risk === 'High') return 'text-red-500';
        if (risk === 'Medium') return 'text-orange-400';
        return 'text-ai-purple'; // Use new AI Purple for Low Risk/Healthy
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-card rounded-xl shadow-ai border border-[#2D333B]">
            <h3 className="text-xl font-bold text-accent-purple border-b border-[#2D333B] pb-3 flex items-center space-x-2">
                <FaChartLine />
                <span>AI Health Risk Assessment</span>
            </h3>

            {/* Current Profile Status Check */}
            <div className={`p-3 rounded-lg text-sm font-medium ${profile.bmi && profile.age ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                {profile.bmi && profile.age ? (
                    `Current BMI: ${profile.bmi.toFixed(2)}. Ready for analysis.`
                ) : (
                    <span className="flex items-center space-x-1">
                        <FaExclamationTriangle />
                        <span>Profile Incomplete: Cannot run prediction without Age and BMI.</span>
                    </span>
                )}
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
                
                {/* 1. Family History */}
                <div className="flex justify-between items-center bg-[#1E1E1E] p-3 rounded-lg border border-[#2D333B]">
                    <label htmlFor="family_history" className="font-medium text-gray-300">Family History of Lifestyle Disease:</label>
                    <input 
                        type="checkbox" 
                        id="family_history"
                        name="family_history" 
                        checked={formData.family_history === 1} 
                        onChange={handleChange} 
                        // Updated Tailwind classes for purple theme checkbox
                        className="form-checkbox h-5 w-5 text-accent-purple bg-gray-700 border-gray-500 rounded focus:ring-accent-purple" 
                    />
                </div>
                
                {/* 2. Sleep Time */}
                <div>
                    <label htmlFor="sleep_time" className="block text-xs font-medium text-gray-400 mb-1">Average Sleep Time (Hours)</label>
                    <input 
                        type="number" 
                        id="sleep_time"
                        name="sleep_time" 
                        placeholder="7.5" 
                        value={formData.sleep_time || ''} 
                        onChange={handleChange} 
                        step="0.5" 
                        required 
                        min="4" 
                        max="12" 
                        className="input text-base" // Using global input class
                    />
                </div>
                
                {/* 3. Junk Food Frequency */}
                <div>
                    <label htmlFor="junk_food_freq" className="block text-xs font-medium text-gray-400 mb-1">Junk Food Consumption Frequency</label>
                    <select 
                        id="junk_food_freq" 
                        name="junk_food_freq" 
                        value={formData.junk_food_freq} 
                        onChange={handleChange} 
                        className="select text-base" // Using global select class
                    >
                        <option value={0}>Rarely / Never</option>
                        <option value={1}>Weekly (1-2 times)</option>
                        <option value={2}>Daily</option>
                    </select>
                </div>
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                disabled={loading || !profile.bmi || !profile.age} // Disable if loading OR profile is incomplete
                className={`w-full p-3 rounded font-semibold shadow-md btn-primary flex items-center justify-center space-x-2 
                    ${loading || !profile.bmi || !profile.age ? 'opacity-50 cursor-not-allowed bg-gray-600' : 'btn-primary'}`} // Use global btn-primary
            >
                {loading ? (
                    <>
                        <FaSpinner className="animate-spin" />
                        <span>Analyzing Data...</span>
                    </>
                ) : (
                    <>
                        <FaHeartbeat />
                        <span>Predict Health Risk Now</span>
                    </>
                )}
            </button>
            
            {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}

            {/* Display Results (Enhanced UI) */}
            {result && (
                <div className="mt-6 p-5 border border-accent-purple/50 rounded-lg shadow-ai bg-card/70 backdrop-blur-sm">
                    <h4 className="text-xl font-bold mb-4 text-center text-ai-purple">AI Diagnosis Result</h4>
                    
                    {/* Status Indicator */}
                    <div className="text-center mb-4">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Predicted Obesity Risk Level:</p>
                        <p className={`text-4xl font-extrabold mt-1 
                            ${getRiskColorClass(result.obesity_risk)}`}>
                            {result.obesity_risk}
                        </p>
                    </div>

                    {/* Probability Breakdown (Enhanced Progress Bars) */}
                    <div className="space-y-3 pt-3 border-t border-[#2D333B]">
                        {Object.entries(result.probabilities).map(([riskLevel, percentage]) => {
                            
                            // Determine bar color dynamically
                            const barColorClass = riskLevel === 'High' ? 'bg-red-500' : 
                                                    riskLevel === 'Medium' ? 'bg-orange-400' : 
                                                    'bg-green-500'; 
                            
                            const barWidth = Math.max(5, percentage); 

                            return (
                                <div key={riskLevel}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-400">{riskLevel} Risk</span>
                                        <span className="font-bold text-white">{percentage}%</span>
                                    </div>
                                    
                                    {/* Futuristic Progress Bar */}
                                    <div className="w-full bg-gray-800 rounded-full h-2.5 relative">
                                        <div 
                                            className={`h-2.5 rounded-full transition-all duration-700 ${barColorClass}`} 
                                            style={{ width: `${barWidth}%` }}
                                        ></div>
                                        {/* Highlight on the predicted risk level */}
                                        {result.obesity_risk === riskLevel && (
                                            <div className="absolute inset-0 border-2 border-ai-purple rounded-full animate-pulse-slow"></div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </form>
    );
};

export default RiskForm;