import React, { useState } from 'react';
import api from '../api/api';

const RiskForm = ({ profile, fetchProfile }) => {
    const [formData, setFormData] = useState({
        family_history: 0, // 0=No, 1=Yes (integer for ML model)
        sleep_time: 7.0,   // float
        junk_food_freq: 1  // 0=Rarely, 1=Weekly, 2=Daily (integer for ML model)
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : (type === 'number' ? parseFloat(value) : parseInt(value))
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // <-- This stops the form reload
        setLoading(true);
        setResult(null);
        setError('');

        // 1. Prepare payload by combining profile data and risk factors
        const payload = {
            bmi: profile.bmi, 
            age: profile.age,
            gender: profile.gender === 'male' ? 0 : 1, 
            activity_level: profile.activityLevel,
            
            family_history: formData.family_history,
            sleep_time: formData.sleep_time,
            junk_food_freq: formData.junk_food_freq
        };

        // 2. Call the backend API
        try {
            const response = await api.post('/risk/predict', payload);
            setResult(response.data.result);
            // fetchProfile(); // Triggers parent (Dashboard) to fetch updated profile with new risk score
        } catch (err) {
            console.error('Risk prediction failed:', err.response?.data);
            setError(err.response?.data?.message || 'Prediction service is unavailable (Port 5000 down?)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
                <label>Family History of Obesity/Diabetes:</label>
                <input type="checkbox" name="family_history" checked={formData.family_history === 1} onChange={handleChange} className="form-checkbox h-4 w-4 text-red-600" />
            </div>
            <input 
                type="number" 
                name="sleep_time" 
                placeholder="Sleep Time (hours)" 
                value={formData.sleep_time || ''} 
                onChange={handleChange} 
                step="0.5" 
                required 
                min="4" 
                max="12" 
                className="input" 
            />
            <select name="junk_food_freq" value={formData.junk_food_freq} onChange={handleChange} className="select">
                <option value={0}>Junk Food: Rarely</option>
                <option value={1}>Junk Food: Weekly</option>
                <option value={2}>Junk Food: Daily</option>
            </select>

            <button type="submit" disabled={loading} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-gray-400 shadow-sm">
                {loading ? 'Analyzing...' : 'Predict Health Risk'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {/* Display Results (Enhanced) */}
            {result && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
                    <h4 className="text-xl font-bold mb-3 text-center">Prediction Results</h4>
                    
                    {/* Status Indicator */}
                    <div className="text-center mb-4">
                        <p className="text-sm text-gray-600">Obesity Risk Level:</p>
                        <p className={`text-3xl font-extrabold 
                            ${result.obesity_risk === 'High' ? 'text-red-700' : 
                              result.obesity_risk === 'Medium' ? 'text-orange-500' : 
                              'text-green-600'}`}>
                            {result.obesity_risk}
                        </p>
                    </div>

                    {/* Probability Breakdown */}
                    <div className="space-y-2">
                        <p className="font-semibold text-gray-700 border-b pb-1">Probability Breakdown:</p>
                        {Object.entries(result.probabilities).map(([riskLevel, percentage]) => (
                            <div key={riskLevel}>
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{riskLevel} Risk</span>
                                    <span className="font-bold">{percentage}%</span>
                                </div>
                                
                                {/* Simple Progress Bar Mockup */}
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className={`h-2.5 rounded-full 
                                            ${riskLevel === 'High' ? 'bg-red-500' : 
                                              riskLevel === 'Medium' ? 'bg-orange-400' : 
                                              'bg-green-500'}`} 
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </form>
    );
};

export default RiskForm;