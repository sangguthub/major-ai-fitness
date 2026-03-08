import React, { useState, useRef } from 'react';
import {
    FaUpload,
    FaCamera,
    FaSpinner,
    FaCheckCircle,
    FaTimesCircle,
    FaChartPie,
    FaChartBar
} from 'react-icons/fa';

const CalorieUpload = ({ profile }) => {

    const fileInputRef = useRef(null);

    const [mealType, setMealType] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadMessage, setUploadMessage] = useState('');

    /* ===============================
       DAILY TARGET CALCULATION
    =============================== */
    const calculateDailyTargets = (dailyCalorieTarget, goal) => {
        const target = Number(dailyCalorieTarget);
        if (!target) return { protein: 0, fat: 0, carbs: 0 };

        let proteinPct, fatPct, carbPct;

        switch (goal) {
            case 'lose':
                proteinPct = 0.45;
                fatPct = 0.30;
                carbPct = 0.25;
                break;
            case 'gain':
                proteinPct = 0.35;
                fatPct = 0.30;
                carbPct = 0.35;
                break;
            default:
                proteinPct = 0.40;
                fatPct = 0.30;
                carbPct = 0.30;
        }

        return {
            protein: Math.round((target * proteinPct) / 4),
            fat: Math.round((target * fatPct) / 9),
            carbs: Math.round((target * carbPct) / 4)
        };
    };

    const dailyTargets = calculateDailyTargets(
        profile?.dailyCalorieTarget,
        profile?.goal
    );

    /* ===============================
       FILE HANDLING
    =============================== */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file);
            setPrediction(null);
            setUploadError('');
            setUploadMessage('');
        }
    };

    const handleSelectImage = () => {
        if (!mealType) {
            setUploadError("Please select a meal type first.");
            return;
        }
        fileInputRef.current.click();
    };

    /* ===============================
       SUBMIT TO CNN SERVICE
    =============================== */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!uploadedFile) return;

        setLoading(true);
        setUploadError('');
        setPrediction(null);

        try {
            const formData = new FormData();
            formData.append("file", uploadedFile);

            const response = await fetch(
                "http://localhost:5001/predict-calories-image",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error("CNN prediction failed");
            }

            const data = await response.json();

            // 🔥 MAP BACKEND RESPONSE → FRONTEND FORMAT
            const calories = data.estimated_calories;

            setPrediction({
                foodName: data.food,
                caloriesEstimated: calories,
                confidence: data.confidence,
                macroBreakdown: {
                    protein: Math.round((calories * 0.30) / 4),
                    fat: Math.round((calories * 0.30) / 9),
                    carbohydrates: Math.round((calories * 0.40) / 4)
                }
            });

            setUploadMessage("Meal analyzed successfully!");

        } catch (err) {
            console.error(err);
            setUploadError("CNN service error. Ensure FastAPI is running.");
        } finally {
            setLoading(false);
        }
    };

    /* ===============================
       MACRO VISUALIZATION
    =============================== */
    const macro = prediction?.macroBreakdown || {
        protein: 0,
        fat: 0,
        carbohydrates: 0
    };

    const getMacroConicStyle = () => {
        const total = macro.protein + macro.fat + macro.carbohydrates;
        if (!total) return { background: 'conic-gradient(#333 0deg)' };

        const p = (macro.protein / total) * 360;
        const f = p + (macro.fat / total) * 360;

        return {
            background: `conic-gradient(
                #ef4444 0deg ${p}deg,
                #f59e0b ${p}deg ${f}deg,
                #3b82f6 ${f}deg 360deg
            )`
        };
    };

    /* ===============================
       RENDER
    =============================== */
    return (
        <div className="space-y-6">

            {/* Upload Card */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Meal Type */}
                    <select
                        value={mealType}
                        onChange={(e) => {
                            setMealType(e.target.value);
                            setUploadedFile(null);
                        }}
                        className="w-full p-3 rounded-xl bg-slate-800 text-white"
                    >
                        <option value="">-- Select Meal Type --</option>
                        <option>Breakfast</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Snack</option>
                    </select>

                    {/* Hidden Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        hidden
                    />

                    {/* Upload Box */}
                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center">
                        {uploadedFile ? (
                            <>
                                <FaCheckCircle className="mx-auto text-4xl text-emerald-400" />
                                <p className="text-emerald-400 mt-2">{uploadedFile.name}</p>
                                <button
                                    type="button"
                                    onClick={() => setUploadedFile(null)}
                                    className="text-red-400 mt-2 text-sm"
                                >
                                    <FaTimesCircle /> Remove
                                </button>
                            </>
                        ) : (
                            <>
                                <FaCamera className="mx-auto text-4xl text-gray-500" />
                                <button
                                    type="button"
                                    onClick={handleSelectImage}
                                    className="mt-4 px-6 py-2 bg-yellow-500 rounded-xl font-bold text-black"
                                >
                                    Select Image
                                </button>
                            </>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!uploadedFile || loading}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold"
                    >
                        {loading ? (
                            <FaSpinner className="animate-spin mx-auto" />
                        ) : (
                            <span>Estimate Calories</span>
                        )}
                    </button>

                    {uploadError && (
                        <p className="text-red-400">{uploadError}</p>
                    )}
                </form>
            </div>

            {uploadMessage && (
                <div className="text-emerald-400 flex items-center gap-2">
                    <FaCheckCircle /> {uploadMessage}
                </div>
            )}

            {/* RESULT */}
            {prediction && (
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">

                    <div className="flex justify-between">
                        <h3 className="text-xl font-bold text-yellow-400">
                            🍽 {prediction.foodName}
                        </h3>
                        <span className="text-emerald-400 font-bold">
                            {prediction.caloriesEstimated} kcal
                        </span>
                    </div>

                    <p className="text-gray-400">
                        Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </p>

                    {/* Macro Pie */}
                    <div className="flex items-center gap-6">
                        <div
                            className="w-24 h-24 rounded-full border-4 border-slate-900"
                            style={getMacroConicStyle()}
                        ></div>

                        <div className="text-sm text-gray-300 space-y-1">
                            <p>Protein: {macro.protein} g</p>
                            <p>Fat: {macro.fat} g</p>
                            <p>Carbs: {macro.carbohydrates} g</p>
                        </div>
                    </div>

                    {/* Daily Progress */}
                    <div className="space-y-3">
                        {['protein', 'fat', 'carbohydrates'].map(key => {
                            const intake = macro[key] || 0;
                            const target =
                                key === 'carbohydrates'
                                    ? dailyTargets.carbs
                                    : dailyTargets[key];

                            const pct = target
                                ? Math.min(100, Math.round((intake / target) * 100))
                                : 0;

                            return (
                                <div key={key}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="capitalize">{key}</span>
                                        <span>{intake}g / {target || 'N/A'}g</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full">
                                        <div
                                            className="h-2 bg-blue-500 rounded-full"
                                            style={{ width: `${pct}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalorieUpload;
