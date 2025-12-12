import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { FaRunning, FaAppleAlt, FaBrain, FaSpinner } from 'react-icons/fa';

const Recommendations = ({ profile, user }) => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch personalized plans from the backend
    const fetchRecommendations = useCallback(async () => {
        setLoading(true);
        setError(null);
        setRecommendations(null);

        // Required data points for personalized plan generation
        const { goal, latestRiskScore, dailyCalorieTarget } = profile;

        if (!goal || !dailyCalorieTarget || latestRiskScore === 'N/A') {
            setError("Failed to fetch recommendations. Ensure profile and risk check are complete (Goal, Target Calories, and latest Risk Score).");
            setLoading(false);
            return;
        }

        try {
            // CRITICAL FIX: Change to POST method and use the explicit generate route
            const response = await api.post('/recommendations/generate', {
                goal,
                latestRiskScore,
                dailyCalorieTarget
            });
            
            setRecommendations(response.data.recommendations);
        } catch (err) {
            console.error('Error fetching recommendations:', err.response?.data || err);
            // The console log showed 404 for /api/recommendation; this new log confirms the issue
            setError(err.response?.data?.message || "Failed to fetch recommendations. Ensure profile and risk check are complete.");
        } finally {
            setLoading(false);
        }
    }, [profile]);

    useEffect(() => {
        // Only run fetch if profile data looks ready
        if (profile.goal && profile.dailyCalorieTarget > 0) {
            fetchRecommendations();
        }
    }, [fetchRecommendations, profile.dailyCalorieTarget, profile.goal]);

    if (loading) {
        return <div className="p-8 text-center text-ai-green"><FaSpinner className="animate-spin inline mr-2" /> Generating personalized plans...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-400 border border-red-700 rounded-lg">{error}</div>;
    }
    
    // Check if recommendations were fetched but are empty 
    if (!recommendations || Object.keys(recommendations).length === 0) {
        return <div className="p-8 text-gray-500">No specific recommendations available. Please ensure your profile is complete.</div>;
    }


    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-3 text-lg font-medium text-gray-300">
                <FaBrain className="text-ai-green text-xl" />
                <p>Generated plans tailored for **{profile.goal?.toUpperCase() || 'MAINTAIN'}** based on your **{profile.latestRiskScore || 'N/A'} Risk** level.</p>
            </div>
            
            {/* Diet Plan Card */}
            <div className="bg-[#161B22] p-6 rounded-xl border border-ai-green/50 shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center">
                    <FaAppleAlt className="mr-3" /> Diet Plan (Target: {profile.dailyCalorieTarget} kcal)
                </h3>
                <ul className="list-disc ml-6 space-y-2 text-gray-300">
                    {/* Assuming recommendations.dietPlan is an array of strings */}
                    {Array.isArray(recommendations.dietPlan) ? (
                        recommendations.dietPlan.map((item, index) => <li key={index}>{item}</li>)
                    ) : (
                        <li>Diet plan details not available in array format.</li>
                    )}
                </ul>
            </div>

            {/* Exercise Plan Card */}
            <div className="bg-[#161B22] p-6 rounded-xl border border-accent-blue/50 shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
                    <FaRunning className="mr-3" /> Weekly Exercise Plan
                </h3>
                <ul className="list-disc ml-6 space-y-2 text-gray-300">
                    {/* Assuming recommendations.exercisePlan is an array of strings */}
                    {Array.isArray(recommendations.exercisePlan) ? (
                        recommendations.exercisePlan.map((item, index) => <li key={index}>{item}</li>)
                    ) : (
                        <li>Exercise plan details not available in array format.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Recommendations;