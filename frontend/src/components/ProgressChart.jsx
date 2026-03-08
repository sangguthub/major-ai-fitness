import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/api';
import Chart from 'chart.js/auto';
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

    // Chart Rendering Logic
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
        
        // 1. Calorie & Goal Adherence Chart
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
                        grid: { drawOnChartArea: false }
                    }
                },
                plugins: { legend: { labels: { color: textDefault } } }
            });
        }

        // 2. Body Composition Trend Chart
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

        // 3. AI Risk Score Trend Chart
        if (riskChartRef.current) {
            createChart(riskChartRef.current, 'line', {
                labels: timeline,
                datasets: [
                    {
                        label: 'AI Risk Score (0 - 1)',
                        data: history.riskData.riskScore,
                        backgroundColor: 'rgba(129, 140, 248, 0.3)',
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
        return (
            <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-12 shadow-xl">
                <div className="flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 animate-pulse"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <FaChartLine className="text-2xl text-white" />
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <p className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                            Loading detailed analytics...
                        </p>
                        <div className="flex items-center justify-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{animationDelay: '0s'}}></div>
                            <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>
        );
    }

    if (error || !history) {
        return (
            <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-red-900/30 border border-red-500/40 p-8 shadow-xl text-center">
                <div className="relative z-10">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <p className="text-red-400 max-w-md mx-auto">{error || "No sufficient historical data available."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            
            {/* 1. Calorie & Goal Adherence */}
            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-6 shadow-xl transition-all duration-300 hover:shadow-emerald-500/10">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaFire className="text-2xl text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Calorie & Macro Adherence
                        </h3>
                        <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-1"></div>
                    </div>
                </div>
                
                <div className="h-96 p-4 rounded-xl bg-slate-950/50 border border-slate-800/30">
                    <canvas ref={calorieChartRef}></canvas>
                </div>
            </div>

            {/* 2. Body Composition Trend */}
            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-6 shadow-xl transition-all duration-300 hover:shadow-teal-500/10">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500"></div>
                
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-600/20 border border-teal-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaWeight className="text-2xl text-teal-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Weight & BMI Progression
                        </h3>
                        <div className="h-1 w-32 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mt-1"></div>
                    </div>
                </div>
                
                <div className="h-96 p-4 rounded-xl bg-slate-950/50 border border-slate-800/30">
                    <canvas ref={bodyChartRef}></canvas>
                </div>
            </div>

            {/* 3. AI Health Risk Score Trend */}
            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 p-6 shadow-xl transition-all duration-300 hover:shadow-indigo-500/10">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaHeartbeat className="text-2xl text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Predictive AI Risk Score Trend
                        </h3>
                        <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-1"></div>
                    </div>
                </div>
                
                <p className="text-slate-400 mb-4 text-sm px-4">
                    This chart tracks your predicted metabolic risk based on logged data and lifestyle factors. Lower scores are better.
                </p>
                
                <div className="h-96 p-4 rounded-xl bg-slate-950/50 border border-slate-800/30">
                    <canvas ref={riskChartRef}></canvas>
                </div>
            </div>
        </div>
    );
};

export default ProgressChart;