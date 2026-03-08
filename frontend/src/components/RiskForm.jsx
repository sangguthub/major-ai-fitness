import React, { useState } from 'react';
import api from '../api/api';
import { FaHeartbeat, FaSpinner, FaChartLine, FaExclamationTriangle } from 'react-icons/fa'; 

const RiskForm = ({ profile, fetchProfile }) => { 
    const [formData, setFormData] = useState({
        family_history: 0,
        sleep_time: 7.0,
        junk_food_freq: 1
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
        e.preventDefault(); 
        setLoading(true);
        setResult(null);
        setError('');

        if (!profile.bmi || !profile.age || profile.age === 0) {
            setError("Missing BMI or Age data. Please complete the Profile & Goals section first.");
            setLoading(false);
            return;
        }

        const payload = {
            bmi: profile.bmi, 
            age: profile.age,
            gender: profile.gender === 'male' ? 0 : 1, 
            activity_level: profile.activityLevel,
            family_history: formData.family_history,
            sleep_time: formData.sleep_time,
            junk_food_freq: formData.junk_food_freq,
            daily_water_intake: profile.daily_water_intake || 2.0, 
            veg_fruit_servings: profile.veg_fruit_servings || 3,
            processed_meat_freq: profile.processed_meat_freq || 1,
            sugary_drinks_freq: profile.sugary_drinks_freq || 1,
        };

        try {
            const response = await api.post('/risk/predict', payload);
            setResult(response.data.result);
            
            if (fetchProfile) {
                await fetchProfile();
            }

        } catch (err) {
            console.error('Risk prediction failed:', err.response?.data);
            setError(err.response?.data?.message || 'Prediction service is unavailable (Check Python service status)');
        } finally {
            setLoading(false);
        }
    };

    const getRiskColorClass = (risk) => {
        if (risk === 'High') return 'text-red-400';
        if (risk === 'Medium') return 'text-orange-400';
        return 'text-emerald-400';
    };

    const getRiskGradient = (risk) => {
        if (risk === 'High') return 'from-red-600/20 to-rose-600/20';
        if (risk === 'Medium') return 'from-orange-600/20 to-amber-600/20';
        return 'from-emerald-600/20 to-teal-600/20';
    };

    const getRiskBorder = (risk) => {
        if (risk === 'High') return 'border-red-500/40';
        if (risk === 'Medium') return 'border-orange-500/40';
        return 'border-emerald-500/40';
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-6 shadow-xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-emerald-500"></div>
                
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-500/40 flex items-center justify-center">
                        <FaChartLine className="text-2xl text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                            Health Risk Assessment
                        </h3>
                        <div className="h-1 w-32 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mt-1"></div>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-6 shadow-xl space-y-6">
                
                {/* Profile Status Banner */}
                <div className={`relative overflow-hidden p-4 rounded-xl border ${
                    profile.bmi && profile.age 
                        ? 'bg-emerald-900/30 border-emerald-500/40' 
                        : 'bg-red-900/30 border-red-500/40'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            profile.bmi && profile.age 
                                ? 'bg-emerald-500/20 border border-emerald-500/40' 
                                : 'bg-red-500/20 border border-red-500/40'
                        }`}>
                            {profile.bmi && profile.age ? (
                                <span className="text-xl">✓</span>
                            ) : (
                                <FaExclamationTriangle className="text-red-400" />
                            )}
                        </div>
                        <div className="flex-grow">
                            {profile.bmi && profile.age ? (
                                <p className="text-emerald-400 font-semibold">
                                    Current BMI: {profile.bmi.toFixed(2)}. Ready for analysis.
                                </p>
                            ) : (
                                <p className="text-red-400 font-semibold">
                                    Profile Incomplete: Cannot run prediction without Age and BMI.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                    
                    {/* Family History */}
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex justify-between items-center">
                        <label htmlFor="family_history" className="font-semibold text-slate-300">
                            Family History of Lifestyle Disease
                        </label>
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                id="family_history"
                                name="family_history" 
                                checked={formData.family_history === 1} 
                                onChange={handleChange} 
                                className="w-6 h-6 rounded border-2 border-slate-600 bg-slate-700 checked:bg-gradient-to-br checked:from-emerald-500 checked:to-teal-600 checked:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
                            />
                        </div>
                    </div>
                    
                    {/* Sleep Time */}
                    <div>
                        <label htmlFor="sleep_time" className="block text-sm font-semibold text-slate-300 mb-2">
                            Average Sleep Time (Hours)
                        </label>
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
                            className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                        />
                    </div>
                    
                    {/* Junk Food Frequency */}
                    <div>
                        <label htmlFor="junk_food_freq" className="block text-sm font-semibold text-slate-300 mb-2">
                            Junk Food Consumption Frequency
                        </label>
                        <select 
                            id="junk_food_freq" 
                            name="junk_food_freq" 
                            value={formData.junk_food_freq} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
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
                    disabled={loading || !profile.bmi || !profile.age}
                    className="group relative overflow-hidden w-full px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-3"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    
                    {loading ? (
                        <>
                            <FaSpinner className="relative z-10 animate-spin text-xl" />
                            <span className="relative z-10">Analyzing Data...</span>
                        </>
                    ) : (
                        <>
                            <FaHeartbeat className="relative z-10 text-xl" />
                            <span className="relative z-10">Predict Health Risk Now</span>
                        </>
                    )}
                </button>
                
                {error && (
                    <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/40 text-red-400">
                        {error}
                    </div>
                )}
            </form>

            {/* Results Display */}
            {result && (
                <div className={`relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br ${getRiskGradient(result.obesity_risk)} border ${getRiskBorder(result.obesity_risk)} p-8 shadow-xl`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
                    
                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 mb-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                <span className="text-sm font-semibold text-slate-300"> Diagnosis Completed</span>
                            </div>
                            
                            <h4 className="text-3xl font-black mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                Risk Assessment Result
                            </h4>
                            
                            <div className="inline-block px-6 py-3 rounded-2xl bg-slate-900/50 border border-slate-700/50 mb-2">
                                <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                                    Predicted Obesity Risk Level
                                </p>
                                <p className={`text-5xl font-black ${getRiskColorClass(result.obesity_risk)}`}>
                                    {result.obesity_risk}
                                </p>
                            </div>
                        </div>

                        {/* Probability Breakdown */}
                        <div className="space-y-4">
                            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6"></div>
                            
                            {Object.entries(result.probabilities).map(([riskLevel, percentage]) => {
                                const barColorClass = riskLevel === 'High' ? 'from-red-500 to-rose-600' : 
                                                        riskLevel === 'Medium' ? 'from-orange-500 to-amber-600' : 
                                                        'from-emerald-500 to-teal-600'; 
                                
                                const barWidth = Math.max(5, percentage);
                                const isActive = result.obesity_risk === riskLevel;

                                return (
                                    <div key={riskLevel} className={`p-4 rounded-xl transition-all ${
                                        isActive ? 'bg-slate-800/80 border-2 border-white/20' : 'bg-slate-900/50'
                                    }`}>
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold ${
                                                    riskLevel === 'High' ? 'text-red-400' : 
                                                    riskLevel === 'Medium' ? 'text-orange-400' : 
                                                    'text-emerald-400'
                                                }`}>
                                                    {riskLevel} Risk
                                                </span>
                                                {isActive && (
                                                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-white">
                                                        PREDICTED
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xl font-black text-white">{percentage}%</span>
                                        </div>
                                        
                                        {/* Progress Bar */}
                                        <div className="relative w-full bg-slate-950/50 rounded-full h-3 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full bg-gradient-to-r ${barColorClass} transition-all duration-1000 shadow-lg`}
                                                style={{ width: `${barWidth}%` }}
                                            >
                                                {isActive && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiskForm;