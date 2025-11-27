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
        goal: profile.goal || 'maintain', // New: Goal setting
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['activityLevel', 'age', 'height', 'weight'].includes(name) ? parseFloat(value) : value
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

            await api.post('/profile', payload);
            
            // --- FIX FOR FLASHING MESSAGE USING setTimeout ---
            setMessage('Profile & Goal updated successfully! TDEE calculated.');
            
            // Wait 1.5 seconds to show the success message before triggering the parent refresh
            setTimeout(async () => {
                if (fetchProfile) { 
                    await fetchProfile(); // Calls App.jsx function to refresh profile globally
                }
                setMessage(''); // Clear message after successful refresh
            }, 1500); 
            // ------------------------------------------------

        } catch (err) {
            setMessage('Failed to update profile. Check backend status.');
            console.error(err);
            setLoading(false); // Clear loading state on error
        } finally {
            // Loading state is managed by the setTimeout completion
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            
            <div>
                <label htmlFor="age" className="block text-xs font-medium text-gray-400 mb-1">Age</label>
                <input 
                    type="number" 
                    id="age"
                    name="age" 
                    placeholder="25" 
                    value={formData.age || ''} 
                    onChange={handleChange} 
                    required min="18" 
                    className="input" 
                />
            </div>

            <div className="flex space-x-2">
                <div className="w-1/2">
                    <label htmlFor="height" className="block text-xs font-medium text-gray-400 mb-1">Height (cm)</label>
                    <input 
                        type="number" 
                        id="height"
                        name="height" 
                        placeholder="175" 
                        value={formData.height || ''} 
                        onChange={handleChange} 
                        required min="100" 
                        max="250" 
                        className="input" 
                    />
                </div>
                <div className="w-1/2">
                    <label htmlFor="weight" className="block text-xs font-medium text-gray-400 mb-1">Weight (kg)</label>
                    <input 
                        type="number" 
                        id="weight"
                        name="weight" 
                        placeholder="75" 
                        value={formData.weight || ''} 
                        onChange={handleChange} 
                        required min="30" 
                        max="200" 
                        className="input" 
                    />
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

            <div>
                <label htmlFor="dietPreference" className="block text-xs font-medium text-gray-400 mb-1">Diet Preference</label>
                <select id="dietPreference" name="dietPreference" value={formData.dietPreference} onChange={handleChange} className="select">
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
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