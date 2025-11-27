import React, { useState, useEffect } from 'react';
import api from '../api/api';

const NutrientWarning = () => {
    const [warnings, setWarnings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchWarnings = async () => {
            // Check for token before fetching (essential for authenticated calls)
            if (!localStorage.getItem('token')) {
                setLoading(false);
                return; 
            }
            try {
                // Calls the backend API on port 8081 -> /api/nutrients/check
                const response = await api.get('/nutrients/check'); 
                setWarnings(response.data.warnings);
                setLoading(false);
                setError(null); 
            } catch (err) {
                console.error("Nutrient check failed:", err);
                // Check if the API endpoint or the server is down (503/404)
                const errorMessage = err.response?.data?.message || "Server error accessing nutrient API.";
                setError(errorMessage);
                setLoading(false);
            }
        };
        fetchWarnings();
    }, []); 

    // --- Rendering Logic ---

    if (loading) {
        return <p className="text-sm text-gray-500 p-2 bg-[#121212] rounded">Checking daily nutrient intake...</p>;
    }
    if (error) {
        return <p className="text-sm text-red-400 p-2 bg-red-900/20 rounded">Error: {error}</p>;
    }

    // Display the result card
    return (
        <div className="mt-4 p-3 bg-yellow-900/10 border border-yellow-800 rounded-lg">
            <h4 className="text-md font-bold mb-2 text-yellow-500">⚠️ Nutrient Status (Today)</h4>
            
            {warnings.length === 0 ? (
                <p className="text-sm text-ai-green">All primary nutrient targets met today!</p>
            ) : (
                <ul className="space-y-1">
                    {warnings.map((warn, index) => (
                        <li key={index} className="text-sm text-yellow-300 font-medium">
                            <span className="text-red-400 font-bold">LOW:</span> {warn.nutrient}. {warn.message}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NutrientWarning;