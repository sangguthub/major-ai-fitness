import React, { useState } from 'react';
import api from '../api/api';
import { FaHeartbeat, FaSpinner } from 'react-icons/fa'; // Added FaSpinner for loading

// RiskForm now receives fetchProfile as a prop from Dashboard.jsx
const RiskForm = ({ profile, fetchProfile }) => { 
    const [formData, setFormData] = useState({
        family_history: 0, // 0=No, 1=Yes 
        sleep_time: 7.0,   // float
        junk_food_freq: 1  // 0=Rarely, 1=Weekly, 2=Daily 
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
        if (!profile.bmi || !profile.age) {
            setError("Missing BMI or Age. Please complete Profile & Goal first.");
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

            // NEW Advanced Risk Factor Inputs from Profile (using safe defaults if missing)
            daily_water_intake: profile.daily_water_intake || 2.0, 
            veg_fruit_servings: profile.veg_fruit_servings || 3,
            processed_meat_freq: profile.processed_meat_freq || 1,
            sugary_drinks_freq: profile.sugary_drinks_freq || 1,
        };

        try {
            const response = await api.post('/risk/predict', payload);
            setResult(response.data.result);
            
            // CRITICAL FIX: Trigger the profile re-fetch immediately after the backend logs the new score.
            if (fetchProfile) {
                await fetchProfile();
            }

        } catch (err) {
            console.error('Risk prediction failed:', err.response?.data);
            setError(err.response?.data?.message || 'Prediction service is unavailable (Port 5000 down?)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {/* User Input Fields */}
            <div className="flex justify-between items-center bg-[#1E1E1E] p-3 rounded-lg border border-[#2D333B]">
                <label htmlFor="family_history" className="font-medium text-gray-300">Family History of Lifestyle Disease:</label>
                <input 
                    type="checkbox" 
                    id="family_history"
                    name="family_history" 
                    checked={formData.family_history === 1} 
                    onChange={handleChange} 
                    className="form-checkbox h-4 w-4 text-red-600 bg-gray-700 border-gray-500 rounded" 
                />
            </div>
            
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
                    className="input" 
                />
            </div>
            
            <div>
                <label htmlFor="junk_food_freq" className="block text-xs font-medium text-gray-400 mb-1">Junk Food Consumption Frequency</label>
                <select id="junk_food_freq" name="junk_food_freq" value={formData.junk_food_freq} onChange={handleChange} className="select">
                    <option value={0}>Rarely / Never</option>
                    <option value={1}>Weekly (1-2 times)</option>
                    <option value={2}>Daily</option>
                </select>
            </div>

            <button 
                type="submit" 
                disabled={loading} 
                className={`w-full p-3 rounded font-semibold shadow-md btn-risk flex items-center justify-center space-x-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'btn-risk'}`}
            >
                {loading ? (
                    <>
                        <FaSpinner className="animate-spin" />
                        <span>Analyzing...</span>
                    </>
                ) : (
                    <>
                        <FaHeartbeat />
                        <span>Predict Health Risk</span>
                    </>
                )}
            </button>
            {error && <p className="text-red-400 mt-2">{error}</p>}

            {/* Display Results */}
            {result && (
                <div className="mt-4 p-4 border border-gray-700 rounded-lg shadow-md bg-[#1E1E1E]">
                    <h4 className="text-xl font-bold mb-3 text-center text-ai-green">Diagnosis Result</h4>
                    
                    {/* Status Indicator */}
                    <div className="text-center mb-4">
                        <p className="text-sm text-gray-500">Predicted Obesity Risk Level:</p>
                        <p className={`text-3xl font-extrabold 
                            ${result.obesity_risk === 'High' ? 'text-red-400' : 
                              result.obesity_risk === 'Medium' ? 'text-orange-400' : 
                              'text-ai-green'}`}>
                            {result.obesity_risk}
                        </p>
                    </div>

                    {/* Probability Breakdown */}
                    <div className="space-y-2">
                        <p className="font-semibold text-gray-500 border-b border-gray-700 pb-1">Probability Breakdown:</p>
                        {Object.entries(result.probabilities).map(([riskLevel, percentage]) => {
                            
                            // Determine bar color (Using standard green-500 for reliable rendering)
                            const barColorClass = riskLevel === 'High' ? 'bg-red-500' : 
                                                  riskLevel === 'Medium' ? 'bg-orange-400' : 
                                                  'bg-green-500'; // FIX: Using a reliable Tailwind class
                            
                            // FIX: Ensure minimum width for visibility (5% or 10px, whichever is larger)
                            // We use Math.max to prevent the bar from being invisible when percentage is low (e.g., 5%)
                            const barWidth = Math.max(5, percentage); 

                            return (
                                <div key={riskLevel}>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{riskLevel} Risk</span>
                                        <span className="font-bold">{percentage}%</span>
                                    </div>
                                    
                                    {/* Simple Progress Bar Mockup */}
                                    <div className="w-full bg-gray-800 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${barColorClass}`} 
                                            style={{ width: `${barWidth}%` }} // Using fixed barWidth
                                        ></div>
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