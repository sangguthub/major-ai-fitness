import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/api';
import Chart from 'chart.js/auto'; // Ensure Chart.js is installed
import { FaFire, FaWeight, FaHeartbeat, FaSpinner, FaChartLine } from 'react-icons/fa';

// Helper function to destroy old charts and create new ones
const createChart = (ctx, type, data, options) => {
    if (ctx.chart) {
        ctx.chart.destroy();
    }
    ctx.chart = new Chart(ctx, { type, data, options });
};

const ProgressChart = ({ profile }) => {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Refs for chart canvases
    const calorieChartRef = useRef(null);
    const bodyChartRef = useRef(null);
    const riskChartRef = useRef(null);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/analytics/history');
            setHistory(response.data.data);
        } catch (err) {
            console.error('Analytics fetch error:', err);
            setError("Could not load historical data. Ensure backend service is running.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);


    // --- CHART RENDERING LOGIC ---
    useEffect(() => {
        if (!history) return;

        const timeline = history.timeline.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        const themeColors = {
            target: 'rgba(255, 255, 255, 0.4)',
            intake: 'rgba(52, 211, 153, 0.8)', // Emerald
            protein: 'rgba(56, 189, 248, 0.8)', // Light Blue/Cyan
            carbs: 'rgba(251, 191, 36, 0.8)',   // Amber
            fats: 'rgba(248, 113, 133, 0.8)',   // Rose/Red
            weight: 'rgba(20, 184, 166, 0.8)',  // Teal
            risk: 'rgba(255, 99, 132, 0.8)'
        };
        const textDefault = '#CBD5E1'; // Slate-300
        
        // --- 1. Calorie & Goal Adherence Chart ---
        if (calorieChartRef.current) {
            createChart(calorieChartRef.current, 'line', {
                labels: timeline,
                datasets: [
                    {
                        label: 'Calorie Target',
                        data: history.calorieData.target,
                        borderColor: themeColors.target,
                        borderDash: [5, 5],
                        borderWidth: 1,
                        pointRadius: 0,
                        spanGaps: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Actual Intake (kcal)',
                        data: history.calorieData.intake,
                        backgroundColor: themeColors.intake,
                        borderColor: themeColors.intake,
                        fill: false,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Protein (g)',
                        data: history.calorieData.protein,
                        backgroundColor: themeColors.protein,
                        stack: 'macros',
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Carbs (g)',
                        data: history.calorieData.carbs,
                        backgroundColor: themeColors.carbs,
                        stack: 'macros',
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Fats (g)',
                        data: history.calorieData.fats,
                        backgroundColor: themeColors.fats,
                        stack: 'macros',
                        yAxisID: 'y1'
                    }
                ],
            }, {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: textDefault }, grid: { color: 'rgba(100, 100, 100, 0.2)' } },
                    y: { 
                        type: 'linear', 
                        position: 'left',
                        title: { display: true, text: 'Calories (kcal)', color: themeColors.intake },
                        ticks: { color: themeColors.intake },
                        grid: { color: 'rgba(100, 100, 100, 0.2)' }
                    },
                    y1: { 
                        type: 'linear', 
                        position: 'right',
                        title: { display: true, text: 'Macros (g)', color: themeColors.protein },
                        ticks: { color: themeColors.protein },
                        grid: { drawOnChartArea: false } // Only draw grid lines for the left axis
                    }
                },
                plugins: { legend: { labels: { color: textDefault } } }
            });
        }

        // --- 2. Body Composition Trend Chart ---
        if (bodyChartRef.current) {
            createChart(bodyChartRef.current, 'line', {
                labels: timeline,
                datasets: [
                    {
                        label: 'Weight (kg)',
                        data: history.bodyData.weight,
                        borderColor: themeColors.weight,
                        tension: 0.3,
                        yAxisID: 'y'
                    },
                    {
                        label: `BMI (${profile.height || 'N/A'} cm)`,
                        data: history.bodyData.bmi,
                        borderColor: themeColors.risk,
                        tension: 0.3,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Goal Weight',
                        data: Array(timeline.length).fill(history.bodyData.goalWeight),
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderDash: [3, 3],
                        pointRadius: 0,
                        borderWidth: 1,
                        yAxisID: 'y'
                    }
                ],
            }, {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: textDefault }, grid: { color: 'rgba(100, 100, 100, 0.2)' } },
                    y: { 
                        type: 'linear', position: 'left',
                        title: { display: true, text: 'Weight (kg)', color: themeColors.weight },
                        ticks: { color: themeColors.weight },
                        grid: { color: 'rgba(100, 100, 100, 0.2)' }
                    },
                    y1: { 
                        type: 'linear', position: 'right',
                        title: { display: true, text: 'BMI', color: themeColors.risk },
                        ticks: { color: themeColors.risk },
                        grid: { drawOnChartArea: false }
                    }
                },
                plugins: { legend: { labels: { color: textDefault } } }
            });
        }

        // --- 3. AI Risk Score Trend Chart ---
        if (riskChartRef.current) {
            createChart(riskChartRef.current, 'line', {
                labels: timeline,
                datasets: [
                    {
                        label: 'AI Risk Score (0 - 1)',
                        data: history.riskData.riskScore,
                        backgroundColor: 'rgba(129, 140, 248, 0.3)', // Indigo
                        borderColor: 'rgb(129, 140, 248)', 
                        tension: 0.4,
                        fill: 'origin',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }
                ],
            }, {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: textDefault }, grid: { color: 'rgba(100, 100, 100, 0.2)' } },
                    y: { 
                        min: 0, max: 1,
                        title: { display: true, text: 'Predicted Risk Level' },
                        ticks: { color: textDefault, stepSize: 0.2 },
                        grid: { color: 'rgba(100, 100, 100, 0.2)' }
                    }
                },
                plugins: { 
                    legend: { labels: { color: textDefault } },
                    tooltip: {
                        callbacks: {
                            afterBody: function(context) {
                                // Add lifestyle actions to the tooltip for the date
                                const date = context[0].label;
                                const action = history.riskData.lifestyleActions.find(a => new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === date);
                                return action ? `\nAction: ${action.description}` : '';
                            }
                        }
                    }
                }
            });
        }
    }, [history, profile]);


    if (loading) {
        return <div className="text-center py-12 text-emerald-400"><FaSpinner className="animate-spin inline-block mr-2" /> Loading detailed analytics...</div>;
    }

    if (error || !history) {
        return <div className="text-center py-12 text-red-400">{error || "No sufficient historical data available."}</div>;
    }

    return (
        <div className="space-y-12 text-white">
            
            {/* 1. Calorie & Goal Adherence */}
            <div className="rounded-xl p-6 bg-slate-900/40 border border-slate-700/50 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-emerald-400">
                    <FaFire /> Calorie & Macro Adherence
                </h3>
                <div className="h-96">
                    <canvas ref={calorieChartRef}></canvas>
                </div>
            </div>

            {/* 2. Body Composition Trend */}
            <div className="rounded-xl p-6 bg-slate-900/40 border border-slate-700/50 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-teal-400">
                    <FaWeight /> Weight & BMI Progression
                </h3>
                <div className="h-96">
                    <canvas ref={bodyChartRef}></canvas>
                </div>
            </div>

            {/* 3. AI Health Risk Score Trend */}
            <div className="rounded-xl p-6 bg-slate-900/40 border border-slate-700/50 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-indigo-400">
                    <FaHeartbeat /> Predictive AI Risk Score Trend
                </h3>
                <p className="text-slate-400 mb-4 text-sm">
                    This chart tracks your predicted metabolic risk based on logged data and lifestyle factors. Lower scores are better.
                </p>
                <div className="h-96">
                    <canvas ref={riskChartRef}></canvas>
                </div>
            </div>
        </div>
    );
};

export default ProgressChart;