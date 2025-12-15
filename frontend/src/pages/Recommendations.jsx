import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaDumbbell, FaAppleAlt, FaSpa, FaSyncAlt, FaSpinner } from 'react-icons/fa';

const Recommendations = ({ profile }) => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timestamp, setTimestamp] = useState(null);
    // State to show initial instructions instead of attempting to load on mount
    const [initialLoadAttempted, setInitialLoadAttempted] = useState(false); 

    const fetchPlan = async () => {
        setLoading(true);
        setError('');
        
        // Mark that the initial load has been attempted
        if (!initialLoadAttempted) setInitialLoadAttempted(true);

        if (!profile.age || !profile.bmi || !profile.goal) {
            setPlan(null);
            setError("Please complete your Age, BMI, and Fitness Goal in the Profile module before generating a plan.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/recommendations/plan'); 
            setPlan(response.data);
            setTimestamp(new Date().toLocaleTimeString());
        } catch (err) {
            console.error('Failed to fetch personalized plan:', err.response?.data);
            setError(err.response?.data?.message || 'AI Planning service is unavailable. Check backend/Gemini key.');
        } finally {
            setLoading(false);
        }
    };

    // REMOVED: useEffect(() => { fetchPlan(); }, [profile.age, profile.bmi, profile.goal]); 
    // The component will now load empty, waiting for the user to click the button.

    const planSections = plan ? [
        { title: 'Workout Focus', data: plan.Workout, icon: <FaDumbbell className="text-4xl text-accent-purple" /> },
        { title: 'Meal Plan Focus', data: plan.MealPlanFocus, icon: <FaAppleAlt className="text-4xl text-green-400" /> },
        { title: 'Mind & Recovery', data: plan.MindRecovery, icon: <FaSpa className="text-4xl text-yellow-400" /> },
    ] : [];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                <p className="text-gray-400 text-md">
                    Your **Daily Action Plan** is synthesized by Gemini based on your current stats, goals, and risk profile.
                </p>
                <button
                    onClick={fetchPlan}
                    disabled={loading || error.includes('Please complete')}
                    className="p-3 bg-accent-purple/20 text-accent-purple rounded-lg hover:bg-accent-purple/40 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                    <FaSyncAlt className={loading ? 'animate-spin' : ''} />
                    <span className="hidden sm:inline">{loading ? 'Generating...' : 'Regenerate Plan'}</span>
                </button>
            </div>

            {loading && (
                <div className="text-center py-12 text-accent-purple flex items-center justify-center space-x-2">
                    <FaSpinner className="animate-spin" />
                    <span>Analyzing profile and structuring your personalized plan...</span>
                </div>
            )}

            {error && (
                <div className="text-center py-12 text-red-400 border border-red-500/30 bg-red-900/10 rounded-xl p-6">
                    <h3 className="font-semibold text-xl mb-2">Plan Generation Error</h3>
                    <p>{error}</p>
                </div>
            )}
            
            {/* Initial empty state or instructions */}
            {!loading && planSections.length === 0 && !error && !initialLoadAttempted && (
                <div className="text-center py-12 text-gray-500 border border-dashed border-gray-700 p-8 rounded-lg">
                    Click the **Regenerate Plan** button to analyze your profile and generate your first personalized plan.
                </div>
            )}
            
            {planSections.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {planSections.map((section, index) => (
                        <div
                            key={index}
                            className="p-6 bg-card rounded-2xl shadow-xl border border-slate-700/50 transition-transform hover:scale-[1.01]"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                {section.icon}
                                <h3 className="text-xl font-bold text-white">{section.title}</h3>
                            </div>
                            <div className="h-1 w-1/3 bg-accent-purple rounded-full mb-4"></div>
                            <p className="text-gray-300 whitespace-pre-wrap">{section.data}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Recommendations;