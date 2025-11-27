import React, { useState, useEffect } from 'react';
import api from '../api/api';

const Recommendations = ({ profile }) => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
    }, [profile.dailyCalorieTarget, profile.bmi, profile.latestRisk]); // Depend on key profile changes

    if (loading) return <div className="text-center text-lg mt-10">Generating Personalized Plans...</div>;
    if (error) return <div className="max-w-4xl mx-auto p-6 text-red-400 border border-red-700 bg-[#1E1E1E] rounded-lg mt-10">{error}</div>;
    if (!recommendations) return <div className="text-center text-lg mt-10">No recommendations available. Update your profile.</div>;

    const { profileSnapshot, recommendations: plan } = recommendations;

    return (
        <div className="mx-auto">
            <div className="bg-accent-blue/10 p-4 rounded-lg border-l-4 border-accent-blue mb-6">
                <p className="text-sm text-accent-blue">Your Goal: <span className="font-bold text-lg capitalize">{plan.goal} Weight</span></p>
                <p><strong>Daily Calorie Target:</strong> <span className="font-extrabold text-2xl text-ai-green">{plan.dailyCalorieTarget}</span> kcal/day</p>
                <p className="text-gray-400 text-sm">BMI: {profileSnapshot.bmi} | TDEE: {profileSnapshot.tdee} kcal | Risk: {profileSnapshot.risk || 'N/A'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Diet Plan */}
                <div className="bg-[#1E1E1E] p-5 rounded-lg border border-[#2D333B]">
                    <h3 className="text-xl font-bold mb-4 text-ai-green">🍎 Diet Plan</h3>
                    <div className="space-y-3">
                        <p className="text-gray-400 border-b border-gray-700 pb-2"><strong>Macro Goal (g):</strong> Protein: {plan.macroGoal.protein} | Carb: {plan.macroGoal.carbohydrate} | Fat: {plan.macroGoal.fat}</p>
                        
                        {Object.entries(plan.dietPlan).map(([meal, suggestion]) => (
                            <div key={meal}>
                                <p className="font-semibold text-white">{meal}:</p>
                                <p className="text-sm italic ml-2 text-gray-400">{suggestion}</p>
                            </div>
                        ))}
                    </div>
                    <ul className="list-disc ml-6 mt-4 text-sm text-ai-green space-y-1">
                        {plan.dietNotes.map((note, index) => <li key={index}>{note}</li>)}
                    </ul>
                </div>

                {/* Workout Plan */}
                <div className="bg-[#1E1E1E] p-5 rounded-lg border border-[#2D333B]">
                    <h3 className="text-xl font-bold mb-4 text-accent-blue">🏋️ Workout Plan</h3>
                    <p><strong>Level:</strong> <span className="font-semibold text-lg text-ai-green">{plan.workoutPlan.level}</span></p>
                    <p><strong>Duration:</strong> {plan.workoutPlan.duration}</p>
                    <p><strong>Focus:</strong> {plan.workoutPlan.focus}</p>
                    <ul className="list-disc ml-5 mt-4 space-y-1 text-gray-400">
                        {plan.workoutPlan.plan.map((step, index) => <li key={index}>{step}</li>)}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default Recommendations;