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
            filename: filename // Key parameter for the mock Python service
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
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <p className="text-xs text-gray-500 italic">
                *Mock: Enter a keyword (e.g., **rice**, **dosa**, **chapati**) to simulate image recognition.
            </p>
            <input 
                type="text" 
                placeholder="Simulated Filename (e.g., dosa.jpg)"
                value={filename} 
                onChange={(e) => setFilename(e.target.value)} 
                required
                className="input"
            />
            <select name="mealType" value={mealType} onChange={(e) => setMealType(e.target.value)} className="select">
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snack">Snack</option>
                <option value="Dinner">Dinner</option>
            </select>
            
            <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 disabled:bg-gray-400 shadow-sm">
                {loading ? 'Estimating...' : 'Upload & Log Meal 🍽️'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {/* Display Results */}
            {result && (
                <div className="mt-4 p-3 border border-gray-200 rounded bg-orange-50">
                    <p className="text-md font-bold">{result.foodName}</p>
                    <p>Estimated Calories: <span className="font-semibold text-orange-700">{result.caloriesEstimated} kcal</span></p>
                    <p className="text-xs">Macros: C:{result.macroBreakdown.Carbohydrates}g | P:{result.macroBreakdown.Protein}g | F:{result.macroBreakdown.Fat}g</p>
                </div>
            )}
        </form>
    );
};

export default CalorieUpload;