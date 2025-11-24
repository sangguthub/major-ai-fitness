import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await api.get('/recommendation');
                setRecommendations(response.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to fetch recommendations. Ensure profile and risk check are complete.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) return <div className="text-center text-lg mt-10">Generating Personalized Plans...</div>;
    if (error) return <div className="max-w-4xl mx-auto p-6 text-red-500 border border-red-300 bg-red-50 rounded-lg mt-10">{error}</div>;
    if (!recommendations) return <div className="text-center text-lg mt-10">No recommendations available.</div>;

    const { profileSnapshot, recommendations: plan } = recommendations;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">Your Personalized Plan</h2>
            
            <button onClick={() => navigate('/dashboard')} className="mb-6 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 shadow-sm">
                ← Back to Dashboard
            </button>

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 mb-6">
                <p><strong>Goal Calorie Target:</strong> <span className="font-extrabold text-2xl text-blue-800">{plan.dailyCalorieTarget}</span> kcal/day</p>
                <p>BMI: {profileSnapshot.bmi} | Latest Risk: {profileSnapshot.risk || 'N/A'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Diet Plan */}
                <div className="bg-green-50 p-5 rounded-lg border border-green-300">
                    <h3 className="text-xl font-bold mb-4 text-green-600">🍎 Diet Plan</h3>
                    <div className="space-y-3">
                        <p><strong>Macro Goal (g):</strong> Protein: {plan.macroGoal.protein} | Carb: {plan.macroGoal.carbohydrate} | Fat: {plan.macroGoal.fat}</p>
                        <hr className="border-green-200"/>
                        {Object.entries(plan.dietPlan).map(([meal, suggestion]) => (
                            <div key={meal}>
                                <p className="font-semibold text-gray-700">{meal}:</p>
                                <p className="text-sm italic ml-2">{suggestion}</p>
                            </div>
                        ))}
                    </div>
                    <ul className="list-disc ml-6 mt-4 text-sm text-green-800">
                        {plan.dietNotes.map((note, index) => <li key={index}>{note}</li>)}
                    </ul>
                </div>

                {/* Workout Plan */}
                <div className="bg-purple-50 p-5 rounded-lg border border-purple-300">
                    <h3 className="text-xl font-bold mb-4 text-purple-600">🏋️ Workout Plan</h3>
                    <p><strong>Level:</strong> <span className="font-semibold text-lg">{plan.workoutPlan.level}</span></p>
                    <p><strong>Duration:</strong> {plan.workoutPlan.duration}</p>
                    <p><strong>Focus:</strong> {plan.workoutPlan.focus}</p>
                    <ul className="list-disc ml-5 mt-4 space-y-1">
                        {plan.workoutPlan.plan.map((step, index) => <li key={index}>{step}</li>)}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default Recommendations;