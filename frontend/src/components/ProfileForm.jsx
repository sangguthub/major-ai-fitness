import React, { useState } from 'react';
import api from '../api/api';

const ProfileForm = ({ profile, fetchProfile }) => {
    // Initialize state with profile data, ensuring empty strings for number inputs when data is missing
    const [formData, setFormData] = useState({
        age: profile.age || '',
        gender: profile.gender || 'male',
        height: profile.height || '', // cm
        weight: profile.weight || '', // kg
        activityLevel: profile.activityLevel || 0, // 0=Sedentary, 1=Active, 2=Very Active
        dietPreference: profile.dietPreference || 'veg',
        existingConditions: profile.existingConditions || [],
        goal: profile.goal || 'maintain', // Goal setting

        // --- NEW RISK FACTOR FEATURES ---
        daily_water_intake: profile.daily_water_intake || 2.0,
        veg_fruit_servings: profile.veg_fruit_servings || 3,
        processed_meat_freq: profile.processed_meat_freq || 1,
        sugary_drinks_freq: profile.sugary_drinks_freq || 1,
        // --------------------------------
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Define fields that should be parsed as numbers (including the new ones)
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
            // Filter out empty/null values before sending the payload
            const payload = Object.fromEntries(
                Object.entries(formData).filter(([_, v]) => v !== '' && v !== null)
            );

            // Ensure integers are sent as integers for select fields
            payload.activityLevel = parseInt(payload.activityLevel);
            payload.processed_meat_freq = parseInt(payload.processed_meat_freq);
            payload.sugary_drinks_freq = parseInt(payload.sugary_drinks_freq);
            
            await api.post('/profile', payload);
            
            setMessage('Profile & Goal updated successfully! TDEE calculated.');
            
            // Wait 1.5 seconds to show the success message before triggering the parent refresh
            setTimeout(async () => {
                if (fetchProfile) { 
                    await fetchProfile(); // Calls App.jsx function to refresh profile globally
                }
                setMessage(''); 
                setLoading(false); // Clear loading state after successful refresh
            }, 1500); 

        } catch (err) {
            setMessage('Failed to update profile. Check backend status.');
            console.error(err);
            setLoading(false); 
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            
            {/* EXISTING BIOMETRIC INPUTS (Age, Height, Weight, Gender, Activity) ... */}
            
            <div>
                <label htmlFor="age" className="block text-xs font-medium text-gray-400 mb-1">Age</label>
                <input type="number" id="age" name="age" placeholder="25" value={formData.age || ''} onChange={handleChange} required min="18" className="input" />
            </div>

            <div className="flex space-x-2">
                <div className="w-1/2">
                    <label htmlFor="height" className="block text-xs font-medium text-gray-400 mb-1">Height (cm)</label>
                    <input type="number" id="height" name="height" placeholder="175" value={formData.height || ''} onChange={handleChange} required min="100" max="250" className="input" />
                </div>
                <div className="w-1/2">
                    <label htmlFor="weight" className="block text-xs font-medium text-gray-400 mb-1">Weight (kg)</label>
                    <input type="number" id="weight" name="weight" placeholder="75" value={formData.weight || ''} onChange={handleChange} required min="30" max="200" className="input" />
                </div>
            </div>

            <div>
                <label htmlFor="gender" className="block text-xs font-medium text-gray-400 mb-1">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="select">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            
            <div>
                <label htmlFor="activityLevel" className="block text-xs font-medium text-gray-400 mb-1">Activity Level</label>
                <select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="select">
                    <option value={0}>Sedentary (Little/no exercise)</option>
                    <option value={1}>Active (Moderate exercise)</option>
                    <option value={2}>Very Active (Intense daily exercise)</option>
                </select>
            </div>
            
            {/* Goal Selection */}
            <div>
                <label htmlFor="goal" className="block text-xs font-medium text-gray-400 mb-1">Health Goal</label>
                <select id="goal" name="goal" value={formData.goal} onChange={handleChange} className="select font-bold border-accent-blue">
                    <option value="maintain">Maintain Weight</option>
                    <option value="lose">Lose Weight (-500 kcal)</option>
                    <option value="gain">Gain Weight (+500 kcal)</option>
                </select>
            </div>

            {/* Diet Preference */}
            <div>
                <label htmlFor="dietPreference" className="block text-xs font-medium text-gray-400 mb-1">Diet Preference</label>
                <select id="dietPreference" name="dietPreference" value={formData.dietPreference} onChange={handleChange} className="select">
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                </select>
            </div>


            <h4 className="text-lg font-semibold pt-4 border-t border-[#2D333B] text-ai-green">Lifestyle Risk Factors</h4>

            {/* NEW: daily_water_intake */}
            <div>
                <label htmlFor="daily_water_intake" className="block text-xs font-medium text-gray-400 mb-1">Daily Water Intake (Liters)</label>
                <input type="number" id="daily_water_intake" name="daily_water_intake" placeholder="2.0" value={formData.daily_water_intake || ''} onChange={handleChange} min="0.5" max="5.0" step="0.5" required className="input" />
            </div>

            {/* NEW: veg_fruit_servings */}
            <div>
                <label htmlFor="veg_fruit_servings" className="block text-xs font-medium text-gray-400 mb-1">Vegetable/Fruit Servings per Day</label>
                <input type="number" id="veg_fruit_servings" name="veg_fruit_servings" placeholder="3" value={formData.veg_fruit_servings || ''} onChange={handleChange} min="0" max="10" step="1" required className="input" />
            </div>

            {/* NEW: processed_meat_freq */}
            <div>
                <label htmlFor="processed_meat_freq" className="block text-xs font-medium text-gray-400 mb-1">Processed Meat Consumption Frequency</label>
                <select id="processed_meat_freq" name="processed_meat_freq" value={formData.processed_meat_freq} onChange={handleChange} className="select">
                    <option value={0}>Rarely / Never</option>
                    <option value={1}>Weekly (1-2 times)</option>
                    <option value={2}>Daily</option>
                </select>
            </div>

            {/* NEW: sugary_drinks_freq */}
            <div>
                <label htmlFor="sugary_drinks_freq" className="block text-xs font-medium text-gray-400 mb-1">Sugary Drink Consumption Frequency</label>
                <select id="sugary_drinks_freq" name="sugary_drinks_freq" value={formData.sugary_drinks_freq} onChange={handleChange} className="select">
                    <option value={0}>Rarely / Never</option>
                    <option value={1}>Weekly (1-2 times)</option>
                    <option value={2}>Daily</option>
                </select>
            </div>
            
            <button 
                type="submit" 
                disabled={loading} 
                className={`w-full p-3 rounded font-semibold shadow-md ${loading ? 'bg-gray-600' : 'btn-primary'}`}
            >
                {loading ? 'Saving Profile...' : 'Update Profile & Goal'}
            </button>
            {message && (
                <p className={`mt-2 text-center text-sm ${message.includes('successfully') ? 'text-ai-green' : 'text-red-400'}`}>
                    {message}
                </p>
            )}
        </form>
    );
};

export default ProfileForm;