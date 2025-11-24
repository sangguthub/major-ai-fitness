import React, { useState } from 'react';
import api from '../api/api';

const ProfileForm = ({ profile, fetchProfile }) => {
    const [formData, setFormData] = useState({
        age: profile.age || '',
        gender: profile.gender || 'male',
        height: profile.height || '', 
        weight: profile.weight || '', 
        activityLevel: profile.activityLevel || 0, 
        dietPreference: profile.dietPreference || 'veg',
        existingConditions: profile.existingConditions || [],
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
            const payload = Object.fromEntries(
                Object.entries(formData).filter(([_, v]) => v !== '' && v !== null)
            );

            await api.post('/profile', payload);
            setMessage('Profile updated successfully! BMI/BMR calculated.');
            fetchProfile(); // Re-fetch to get new calculated BMI/BMR
        } catch (err) {
            setMessage('Failed to update profile.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <input type="number" name="age" placeholder="Age" value={formData.age || ''} onChange={handleChange} required min="18" className="input" />
            <div className="flex space-x-2">
                <input type="number" name="height" placeholder="Height (cm)" value={formData.height || ''} onChange={handleChange} required min="100" className="input w-1/2" />
                <input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight || ''} onChange={handleChange} required min="30" className="input w-1/2" />
            </div>
            <select name="gender" value={formData.gender} onChange={handleChange} className="select">
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="select">
                <option value={0}>Sedentary (Little/no exercise)</option>
                <option value={1}>Active (Moderate exercise)</option>
                <option value={2}>Very Active (Intense daily exercise)</option>
            </select>
            <select name="dietPreference" value={formData.dietPreference} onChange={handleChange} className="select">
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
            </select>
            
            <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 shadow-sm">
                {loading ? 'Saving...' : 'Update Profile'}
            </button>
            {message && <p className={`mt-2 text-center text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        </form>
    );
};

export default ProfileForm;