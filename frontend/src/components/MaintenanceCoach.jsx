import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaRobot, FaSyncAlt, FaSpinner } from 'react-icons/fa'; 

const MaintenanceCoach = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timestamp, setTimestamp] = useState(null);
    // State to track if the initial load has been attempted (to show the initial prompt)
    const [initialLoadAttempted, setInitialLoadAttempted] = useState(false); 

    const fetchAdvice = async () => {
        setLoading(true);
        setError('');
        
        // Mark that the initial load has been attempted
        if (!initialLoadAttempted) setInitialLoadAttempted(true);

        try {
            const response = await api.post('/ai/maintenance-coach', {});
            setSuggestions(response.data || []); 
            setTimestamp(new Date().toLocaleTimeString());
        } catch (err) {
            console.error('Failed to fetch AI advice:', err.response?.data || err);
            setError(err.response?.data?.message || 'Could not connect to the AI Coach. Check the Gemini API Key and backend server.');
        } finally {
            setLoading(false);
        }
    };

    // REMOVED: useEffect(() => { fetchAdvice(); }, []); 
    // The component will now load empty, waiting for the user to click the button.

    const getCategoryClasses = (category) => {
        if (category.includes('Daily')) return {
            border: 'border-accent-purple/50', 
            text: 'text-accent-purple' 
        };
        if (category.includes('Dietary')) return {
            border: 'border-green-500/50', 
            text: 'text-green-400' 
        };
        return {
            border: 'border-yellow-500/50', 
            text: 'text-yellow-400' 
        };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                <h2 className="text-2xl font-bold text-ai-purple flex items-center space-x-2">
                    <FaRobot />
                    <span>AI Maintenance Coach</span>
                </h2>
                <div className="flex items-center space-x-3">
                    {timestamp && <span className="text-xs text-gray-500 hidden sm:block">Last update: {timestamp}</span>}
                    <button
                        onClick={fetchAdvice}
                        disabled={loading}
                        className="p-3 bg-accent-purple/20 text-accent-purple rounded-lg hover:bg-accent-purple/40 transition-colors disabled:opacity-50 flex items-center space-x-2"
                        title="Generate New Advice"
                    >
                        <FaSyncAlt className={loading ? 'animate-spin' : ''} />
                        <span className="hidden sm:inline">{loading ? 'Generating...' : 'Regenerate Tips'}</span>
                    </button>
                </div>
            </div>

            {loading && (
                <div className="text-center py-8 text-accent-purple flex items-center justify-center space-x-2">
                    <FaSpinner className="animate-spin" />
                    <span>Generating hyper-personalized suggestions...</span>
                </div>
            )}

            {error && <p className="text-center text-red-400 py-4">{error}</p>}

            {/* Initial empty state or instructions */}
            {!loading && suggestions.length === 0 && !error && !initialLoadAttempted && (
                 <div className="text-center py-8 text-gray-500 border border-dashed border-gray-700 p-8 rounded-lg">
                    Click the **Regenerate Tips** button to start the AI Coach and receive your first set of personalized tips.
                </div>
            )}
            
            {!loading && suggestions.length === 0 && !error && initialLoadAttempted && (
                 <div className="text-center py-8 text-gray-500 border border-dashed border-gray-700 p-8 rounded-lg">
                    No personalized tips were returned. Try again or check the backend logs.
                </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suggestions.map((tip, index) => {
                    const classes = getCategoryClasses(tip.category);
                    
                    return (
                        <div
                            key={index}
                            className={`p-5 bg-card rounded-xl shadow-lg border ${classes.border} transition-transform hover:scale-[1.02]`}
                        >
                            <div className={`text-4xl mb-3 ${classes.text}`}>
                                {tip.icon}
                            </div>
                            <h4 className="font-semibold text-lg mb-2 text-white">{tip.category}</h4>
                            <p className="text-sm text-gray-400">{tip.tip}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MaintenanceCoach;