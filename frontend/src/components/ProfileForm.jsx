import React, { useState } from 'react';
import api from '../api/api';
import { FaUser, FaHeartbeat, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const ProfileForm = ({ profile, fetchProfile }) => {
    const [formData, setFormData] = useState({
        age: profile.age || '',
        gender: profile.gender || 'male',
        height: profile.height || '',
        weight: profile.weight || '',
        activityLevel: profile.activityLevel || 0,
        dietPreference: profile.dietPreference || 'veg',
        existingConditions: profile.existingConditions || [],
        goal: profile.goal || 'maintain',
        daily_water_intake: profile.daily_water_intake || 2.0,
        veg_fruit_servings: profile.veg_fruit_servings || 3,
        processed_meat_freq: profile.processed_meat_freq || 1,
        sugary_drinks_freq: profile.sugary_drinks_freq || 1,
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        const numericFields = ['activityLevel', 'age', 'height', 'weight', 'daily_water_intake', 'veg_fruit_servings', 'processed_meat_freq', 'sugary_drinks_freq'];

        setFormData(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? parseFloat(value) : value
        }));
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        setMessage('');

        try {
            const payload = Object.fromEntries(
                Object.entries(formData).filter(([_, v]) => v !== '' && v !== null)
            );

            payload.activityLevel = parseInt(payload.activityLevel);
            payload.processed_meat_freq = parseInt(payload.processed_meat_freq);
            payload.sugary_drinks_freq = parseInt(payload.sugary_drinks_freq);
            
            await api.post('/profile', payload);
            
            setMessage('Profile & Goal updated successfully! TDEE calculated.');
            
            setTimeout(async () => {
                if (fetchProfile) { 
                    await fetchProfile();
                }
                setMessage(''); 
                setLoading(false);
            }, 1500); 

        } catch (err) {
            setMessage('Failed to update profile. Check backend status.');
            console.error(err);
            setLoading(false); 
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Biometric Information Section */}
                <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-6 shadow-xl">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/40 flex items-center justify-center">
                            <FaUser className="text-xl text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                Biometric Information
                            </h3>
                            <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-1"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Age */}
                        <div>
                            <label htmlFor="age" className="block text-sm font-semibold text-slate-300 mb-2">Age</label>
                            <input 
                                type="number" 
                                id="age" 
                                name="age" 
                                placeholder="25" 
                                value={formData.age || ''} 
                                onChange={handleChange} 
                                required 
                                min="18" 
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                            />
                        </div>

                        {/* Height & Weight */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="height" className="block text-sm font-semibold text-slate-300 mb-2">Height (cm)</label>
                                <input 
                                    type="number" 
                                    id="height" 
                                    name="height" 
                                    placeholder="175" 
                                    value={formData.height || ''} 
                                    onChange={handleChange} 
                                    required 
                                    min="100" 
                                    max="250" 
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                            <div>
                                <label htmlFor="weight" className="block text-sm font-semibold text-slate-300 mb-2">Weight (kg)</label>
                                <input 
                                    type="number" 
                                    id="weight" 
                                    name="weight" 
                                    placeholder="75" 
                                    value={formData.weight || ''} 
                                    onChange={handleChange} 
                                    required 
                                    min="30" 
                                    max="200" 
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <label htmlFor="gender" className="block text-sm font-semibold text-slate-300 mb-2">Gender</label>
                            <select 
                                id="gender" 
                                name="gender" 
                                value={formData.gender} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                            >
                                <option value="male">👨 Male</option>
                                <option value="female">👩 Female</option>
                            </select>
                        </div>
                        
                        {/* Activity Level */}
                        <div>
                            <label htmlFor="activityLevel" className="block text-sm font-semibold text-slate-300 mb-2">Activity Level</label>
                            <select 
                                id="activityLevel" 
                                name="activityLevel" 
                                value={formData.activityLevel} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                            >
                                <option value={0}>🛋️ Sedentary (Little/no exercise)</option>
                                <option value={1}>🏃 Active (Moderate exercise)</option>
                                <option value={2}>💪 Very Active (Intense daily exercise)</option>
                            </select>
                        </div>
                        
                        {/* Goal Selection */}
                        <div>
                            <label htmlFor="goal" className="block text-sm font-semibold text-slate-300 mb-2">Health Goal</label>
                            <select 
                                id="goal" 
                                name="goal" 
                                value={formData.goal} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-emerald-500/50 text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                            >
                                <option value="maintain">⚖️ Maintain Weight</option>
                                <option value="lose">📉 Lose Weight (-500 kcal)</option>
                                <option value="gain">📈 Gain Weight (+500 kcal)</option>
                            </select>
                        </div>

                        {/* Diet Preference */}
                        <div>
                            <label htmlFor="dietPreference" className="block text-sm font-semibold text-slate-300 mb-2">Diet Preference</label>
                            <select 
                                id="dietPreference" 
                                name="dietPreference" 
                                value={formData.dietPreference} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                            >
                                <option value="veg">🥗 Vegetarian</option>
                                <option value="non-veg">🍖 Non-Vegetarian</option>
                                <option value="vegan">🌱 Vegan</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Lifestyle Risk Factors Section */}
                <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-6 shadow-xl">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-600/20 border border-red-500/40 flex items-center justify-center">
                            <FaHeartbeat className="text-xl text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                Lifestyle Risk Factors
                            </h3>
                            <div className="h-1 w-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mt-1"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Daily Water Intake */}
                        <div>
                            <label htmlFor="daily_water_intake" className="block text-sm font-semibold text-slate-300 mb-2">
                                💧 Daily Water Intake (Liters)
                            </label>
                            <input 
                                type="number" 
                                id="daily_water_intake" 
                                name="daily_water_intake" 
                                placeholder="2.0" 
                                value={formData.daily_water_intake || ''} 
                                onChange={handleChange} 
                                min="0.5" 
                                max="5.0" 
                                step="0.5" 
                                required 
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                            />
                        </div>

                        {/* Vegetable/Fruit Servings */}
                        <div>
                            <label htmlFor="veg_fruit_servings" className="block text-sm font-semibold text-slate-300 mb-2">
                                🥬 Vegetable/Fruit Servings per Day
                            </label>
                            <input 
                                type="number" 
                                id="veg_fruit_servings" 
                                name="veg_fruit_servings" 
                                placeholder="3" 
                                value={formData.veg_fruit_servings || ''} 
                                onChange={handleChange} 
                                min="0" 
                                max="10" 
                                step="1" 
                                required 
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                            />
                        </div>

                        {/* Processed Meat Frequency */}
                        <div>
                            <label htmlFor="processed_meat_freq" className="block text-sm font-semibold text-slate-300 mb-2">
                                🥓 Processed Meat Consumption Frequency
                            </label>
                            <select 
                                id="processed_meat_freq" 
                                name="processed_meat_freq" 
                                value={formData.processed_meat_freq} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                            >
                                <option value={0}>Rarely / Never</option>
                                <option value={1}>Weekly (1-2 times)</option>
                                <option value={2}>Daily</option>
                            </select>
                        </div>

                        {/* Sugary Drinks Frequency */}
                        <div>
                            <label htmlFor="sugary_drinks_freq" className="block text-sm font-semibold text-slate-300 mb-2">
                                🥤 Sugary Drink Consumption Frequency
                            </label>
                            <select 
                                id="sugary_drinks_freq" 
                                name="sugary_drinks_freq" 
                                value={formData.sugary_drinks_freq} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                            >
                                <option value={0}>Rarely / Never</option>
                                <option value={1}>Weekly (1-2 times)</option>
                                <option value={2}>Daily</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="group relative overflow-hidden w-full px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-3"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    
                    {loading ? (
                        <>
                            <FaSpinner className="relative z-10 animate-spin text-xl" />
                            <span className="relative z-10">Saving Profile...</span>
                        </>
                    ) : (
                        <>
                            <FaCheckCircle className="relative z-10 text-xl" />
                            <span className="relative z-10">Update Profile & Goal</span>
                        </>
                    )}
                </button>
            </form>

            {/* Success/Error Message */}
            {message && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                    message.includes('successfully') 
                        ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-400' 
                        : 'bg-red-900/30 border-red-500/40 text-red-400'
                }`}>
                    {message.includes('successfully') ? (
                        <FaCheckCircle className="text-xl flex-shrink-0" />
                    ) : (
                        <span className="text-xl flex-shrink-0">⚠️</span>
                    )}
                    <span className="font-semibold">{message}</span>
                </div>
            )}
        </div>
    );
};

export default ProfileForm;