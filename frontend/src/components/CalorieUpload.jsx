import React, { useState, useRef } from 'react';
import api from '../api/api';
import { FaUpload, FaCamera, FaSpinner, FaCheckCircle, FaTimesCircle, FaChartPie, FaChartBar } from 'react-icons/fa';

// CalorieUpload receives fetchNutrientWarnings as a prop
const CalorieUpload = ({ profile, fetchNutrientWarnings }) => {
    
    const fileInputRef = useRef(null); 
    
    const [mealType, setMealType] = useState(''); 
    const [uploadedFile, setUploadedFile] = useState(null); 
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadMessage, setUploadMessage] = useState('');

    // --- Helper Function: Calculate Daily Macro Targets (in Grams) ---
    // Uses a goal-based macro split for accuracy.
    // 1g Protein = 4 kcal, 1g Carb = 4 kcal, 1g Fat = 9 kcal
    const calculateDailyTargets = (dailyCalorieTarget, goal) => {
        // CRITICAL FIX: Ensure dailyCalorieTarget is treated as a number
        const target = Number(dailyCalorieTarget); 

        // Fallback if target is invalid or 0
        if (!target || target === 0) return { protein: 0, fat: 0, carbs: 0 };

        let proteinPercent, fatPercent, carbPercent;

        // 1. Define Macro Splits based on User Goal
        switch (goal) {
            case 'lose': // High Protein, Low Carb for Fat Loss
                proteinPercent = 0.45; 
                fatPercent = 0.30;
                carbPercent = 0.25;
                break;
            case 'gain': // Higher Carb/Fat for Mass Gain
                proteinPercent = 0.35;
                fatPercent = 0.30;
                carbPercent = 0.35;
                break;
            case 'maintain': // Balanced
            default:
                proteinPercent = 0.40;
                fatPercent = 0.30;
                carbPercent = 0.30;
                break;
        }

        // 2. Calculate Grams from Caloric Percentages
        const proteinCal = target * proteinPercent;
        const fatCal = target * fatPercent;
        const carbsCal = target * carbPercent;
        
        return {
            protein: Math.round(proteinCal / 4), // 4 kcal/g
            fat: Math.round(fatCal / 9),         // 9 kcal/g
            carbs: Math.round(carbsCal / 4),     // 4 kcal/g
        };
    };
    
    // Call the helper with the profile's goal
    const dailyTargets = calculateDailyTargets(profile.dailyCalorieTarget, profile.goal); 


    // --- File Selection Logic ---
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            setUploadError('');
            setPrediction(null);
            setUploadMessage('');
        }
    };

    const handleSimulateUploadClick = () => {
        if (!mealType) {
            setUploadError("Please select a Meal Type before selecting an image.");
            return;
        }
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    // ----------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadError('');
        setUploadMessage('');
        setPrediction(null);
        
        if (!mealType) {
            setUploadError("Please select a Meal Type.");
            setLoading(false);
            return;
        }
        if (!uploadedFile) {
            setUploadError("Please select an image file first.");
            setLoading(false);
            return;
        }

        const payload = {
            mealType,
            imageUrl: uploadedFile.name, 
            filename: uploadedFile.name, 
        };

        try {
            const response = await api.post('/intake/upload-image', payload);
            
            setPrediction(response.data.prediction); 
            setUploadMessage("Meal logged successfully!");

            if (fetchNutrientWarnings) {
                await fetchNutrientWarnings(); 
            }

        } catch (err) {
            console.error('Meal upload failed:', err);
            setUploadError(err.response?.data?.message || 'Failed to log meal. Is the Python service running on Port 5001?');
        } finally {
            setLoading(false);
            setUploadedFile(null); // Clear the file state after logging
        }
    };

    const isReadyToEstimate = mealType && uploadedFile;
    
    // --- Helper for Visualization ---
    const getMacroConicStyle = () => {
        const macro = prediction?.macroBreakdown;
        if (!macro) return { background: 'conic-gradient(#333 0deg)' };

        const total = macro.protein + macro.fat + macro.carbohydrates;
        if (total === 0) return { background: 'conic-gradient(#333 0deg)' };

        const p_end = (macro.protein / total) * 360;
        const f_end = p_end + (macro.fat / total) * 360;
        
        // Using standard hex colors for reliability in inline style
        return {
            background: `conic-gradient(
                #ef4444 0deg ${p_end}deg,       /* Red for Protein */
                #f59e0b ${p_end}deg ${f_end}deg,       /* Amber for Fat */
                #3b82f6 ${f_end}deg 360deg        /* Blue for Carbs */
            )`,
        };
    };


    return (
        <div className="space-y-6">
            <p className="text-gray-400">
                Upload a meal image to estimate calorie and macro intake. This requires **two steps**: 1) Select a meal type and Upload, then 2) Click Estimate & Log.
            </p>

            <div className="bg-[#161B22] p-6 rounded-xl border border-[#2D333B] shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label htmlFor="mealType" className="block text-sm font-medium text-gray-400 mb-1">Meal Type</label>
                        <select 
                            id="mealType"
                            value={mealType} 
                            onChange={(e) => {
                                setMealType(e.target.value);
                                setUploadedFile(null); // Reset file state if meal type changes
                            }}
                            className="select"
                        >
                            <option value="">-- Select Meal Type --</option> 
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Snack">Snack</option>
                        </select>
                    </div>
                    
                    {/* --- HIDDEN FILE INPUT ELEMENT --- */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }} 
                        accept="image/*"
                    />

                    {/* --- VISUAL UPLOAD BUTTON / STATUS --- */}
                    <div className="text-center p-6 border-2 border-dashed border-gray-700 rounded-lg">
                        {uploadedFile ? (
                            <>
                                <FaCheckCircle className="mx-auto text-4xl text-ai-green mb-2" />
                                <p className="text-sm text-ai-green font-semibold">Image Selected: {uploadedFile.name}</p>
                                <p className="text-xs text-gray-500">Click 'Estimate & Log Meal' below.</p>
                                <button type="button" onClick={() => setUploadedFile(null)} className="text-red-400 text-xs mt-2 flex items-center mx-auto hover:underline">
                                    <FaTimesCircle className='mr-1' /> Remove File
                                </button>
                            </>
                        ) : (
                            <>
                                <FaCamera className="mx-auto text-4xl text-gray-500 mb-2" />
                                <p className="text-sm text-gray-400 mb-3">Select a file to begin estimation:</p>
                                <button 
                                    type="button" 
                                    onClick={handleSimulateUploadClick}
                                    disabled={!mealType}
                                    className={`py-2 px-4 rounded font-medium text-sm transition-all 
                                        ${!mealType ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-accent-blue hover:bg-ai-green hover:text-black text-white'}`}
                                >
                                    {mealType ? 'Select Image from Files' : 'Select Meal Type First'}
                                </button>
                            </>
                        )}
                    </div>
                    
                    {/* --- ESTIMATE & LOG MEAL BUTTON --- */}
                    <button 
                        type="submit" 
                        disabled={loading || !isReadyToEstimate} 
                        className={`w-full p-3 rounded font-semibold shadow-md btn-primary flex items-center justify-center space-x-2 
                                    ${loading || !isReadyToEstimate ? 'opacity-50 cursor-not-allowed' : 'btn-primary'}`}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                <span>Analyzing Meal...</span>
                            </>
                        ) : (
                            <>
                                <FaUpload />
                                <span>Estimate & Log Meal</span>
                            </>
                        )}
                    </button>
                    
                    {uploadError && <p className="text-red-400 mt-2">{uploadError}</p>}
                </form>
            </div>
            
            {uploadMessage && <p className="text-ai-green font-medium">{uploadMessage}</p>}

            {/* --- NEW: VISUAL RESULTS DISPLAY --- */}
            {prediction && (
                <div className="mt-4 p-4 border border-gray-700 rounded-xl bg-[#1E1E1E] space-y-4">
                    <h4 className="text-xl font-bold text-yellow-400 border-b border-gray-700 pb-2">Estimation Result & Daily Impact</h4>
                    
                    {/* Topline Summary */}
                    <div className="flex justify-between items-center pb-2">
                         <p className="text-lg">Food: <span className="font-semibold text-white">{prediction.foodName}</span></p>
                         <p className="text-lg">Calories: <span className="font-extrabold text-ai-green">{prediction.caloriesEstimated} kcal</span></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* 1. PIE CHART VISUALIZATION (Macro Ratio) */}
                        <div className="md:col-span-1 p-3 border border-gray-700 rounded-lg">
                            <h5 className="font-semibold text-gray-400 mb-3 flex items-center text-sm">
                                <FaChartPie className='mr-2 text-red-400' /> Meal Macro Ratio
                            </h5>
                            <div className="flex justify-center space-x-4">
                                {/* Pie Chart Mockup */}
                                <div className="h-24 w-24 rounded-full border-4 border-[#1E1E1E]" style={getMacroConicStyle()}></div>
                                
                                {/* Pie Chart Legend */}
                                <div className="text-xs space-y-1 pt-1">
                                    <p className="flex items-center"><span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>Protein</p>
                                    <p className="flex items-center"><span className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></span>Fat</p>
                                    <p className="flex items-center"><span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>Carbs</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. PROGRESS BARS (vs. Daily Target) */}
                        <div className="md:col-span-2 space-y-3">
                            <h5 className="font-semibold text-gray-400 flex items-center text-sm">
                                <FaChartBar className='mr-2 text-blue-400' /> Daily Target Progress (Grams)
                            </h5>
                            
                            {['protein', 'fat', 'carbohydrates'].map(macroKey => {
                                const target = dailyTargets[macroKey];
                                const intake = prediction.macroBreakdown?.[macroKey] || 0; // Use optional chaining for safety
                                
                                // Display logic handles zero target
                                const percentage = target > 0 ? Math.round((intake / target) * 100) : 0;
                                const barWidth = Math.min(100, percentage); // Cap at 100%
                                
                                const colorClass = macroKey === 'protein' ? 'bg-red-500' : macroKey === 'fat' ? 'bg-yellow-500' : 'bg-blue-500';
                                
                                // Clean fallback display for target and percentage
                                const targetDisplay = target > 0 ? `${target}g` : 'N/A (Update Profile)';
                                const percentageDisplay = target > 0 ? `${percentage}%` : '---';


                                return (
                                    <div key={macroKey}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="capitalize text-white">
                                                {macroKey}: {intake}g / {targetDisplay}
                                            </span>
                                            <span className="font-bold text-gray-300">{percentageDisplay}</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${colorClass}`} 
                                                style={{ width: `${barWidth}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalorieUpload;