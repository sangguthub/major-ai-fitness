import React, { useState } from 'react';
import api from '../api/api';

const CalorieUpload = () => {
    const [filename, setFilename] = useState('rice.jpg'); 
    const [mealType, setMealType] = useState('Lunch');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError('');

        const payload = {
            mealType,
            imageUrl: `/mock-images/${filename}`,
            filename: filename
        };

        try {
            const response = await api.post('/intake/upload-image', payload);
            setResult(response.data.prediction);
        } catch (err) {
            console.error('Calorie estimation failed:', err.response?.data);
            setError(err.response?.data?.message || 'Estimation service is unavailable (Port 5001 down?)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <p className="text-xs text-gray-500 italic p-3 bg-[#1E1E1E] rounded-lg border border-[#2D333B]">
                *Mock Module: Enter a keyword (e.g., **dosa**, **chapati**, **salad**) to simulate image recognition.
            </p>
            
            <div>
                <label htmlFor="filename" className="block text-xs font-medium text-gray-400 mb-1">Simulated Image Filename</label>
                <input 
                    type="text" 
                    id="filename"
                    placeholder="e.g., chicken_curry.jpg"
                    value={filename} 
                    onChange={(e) => setFilename(e.target.value)} 
                    required
                    className="input"
                />
            </div>

            <div>
                <label htmlFor="mealType" className="block text-xs font-medium text-gray-400 mb-1">Meal Type</label>
                <select id="mealType" name="mealType" value={mealType} onChange={(e) => setMealType(e.target.value)} className="select">
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Snack">Snack</option>
                    <option value="Dinner">Dinner</option>
                </select>
            </div>
            
            <button 
                type="submit" 
                disabled={loading} 
                className={`w-full p-3 rounded font-semibold shadow-md ${loading ? 'bg-gray-600' : 'btn-primary'}`}
            >
                {loading ? 'Estimating...' : 'Upload & Log Meal 🍽️'}
            </button>
            {error && <p className="text-red-400 mt-2">{error}</p>}

            {/* Display Results */}
            {result && (
                <div className="mt-4 p-4 border border-gray-700 rounded-lg bg-[#1E1E1E]">
                    <h4 className="text-lg font-bold mb-2 text-ai-green">{result.foodName}</h4>
                    <p>Estimated Calories: <span className="font-extrabold text-orange-400">{result.caloriesEstimated} kcal</span></p>
                    <p className="text-xs text-gray-500 mt-1">Macros: C:{result.macroBreakdown.Carbohydrates}g | P:{result.macroBreakdown.Protein}g | F:{result.macroBreakdown.Fat}g</p>
                </div>
            )}
        </form>
    );
};

export default CalorieUpload;