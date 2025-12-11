import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define chart colors for the dark theme
const ACCENT_COLOR = '#00AEEF'; // AI Blue
const AI_GREEN = '#00FFC0';
const PRIMARY_TEXT = '#C9D1D1'; // Correctly defined as PRIMARY_TEXT
const DARK_GRID = 'rgba(45, 51, 59, 0.5)';
const RISK_COLOR = '#FFB400'; // Orange/Gold for Risk

const ProgressChart = ({ dailyCalorieTarget }) => {
    const [progressData, setProgressData] = useState(null);
    const [riskData, setRiskData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Map risk score value to text for the y-axis labels
    const riskTextMap = { 1: 'Low', 2: 'Medium', 3: 'High' };

    useEffect(() => {
        const fetchData = async () => {
            if (!Number.isFinite(dailyCalorieTarget) || dailyCalorieTarget <= 0) {
                 setError("Calorie Target not set. Please update your Profile & Goal.");
                 setLoading(false);
                 return;
            }
            try {
                const response = await api.get('/analytics/progress');
                const data = response.data;

                // 1. Prepare Labels (Dates)
                const dates = [...new Set([
                    ...data.weightHistory.map(d => d.date),
                    ...data.calorieHistory.map(d => d.date),
                    ...data.riskHistory.map(d => d.date)
                ])].sort();

                // 2. Map data to dates
                const weightMap = new Map(data.weightHistory.map(item => [item.date, item.weight]));
                const calorieMap = new Map(data.calorieHistory.map(item => [item.date, item.calories]));
                const riskMap = new Map(data.riskHistory.map(item => [item.date, item.score]));
                
                // --- CHART 1: PROGRESS TRACKER DATA ---
                setProgressData({
                    labels: dates,
                    datasets: [
                        {
                            label: 'Weight (kg)',
                            data: dates.map(date => weightMap.get(date) || null),
                            borderColor: ACCENT_COLOR, 
                            yAxisID: 'y-weight',
                            tension: 0.2,
                            pointBackgroundColor: ACCENT_COLOR,
                            spanGaps: true, 
                        },
                        {
                            label: 'Calorie Intake (kcal)',
                            data: dates.map(date => calorieMap.get(date) || null),
                            borderColor: '#FF4C4C', // Red
                            backgroundColor: 'rgba(255, 76, 76, 0.2)',
                            yAxisID: 'y-calorie',
                            spanGaps: true,
                        },
                        {
                            label: 'Calorie Target',
                            data: dates.map(() => dailyCalorieTarget),
                            borderColor: AI_GREEN, 
                            borderDash: [8, 8], 
                            pointRadius: 0,
                            yAxisID: 'y-calorie',
                            tension: 0,
                        },
                    ],
                });
                
                // --- CHART 2: RISK CORRELATION DATA ---
                setRiskData({
                    labels: dates,
                    datasets: [
                        {
                            label: 'Health Risk Score (1=Low, 3=High)',
                            data: dates.map(date => riskMap.get(date) || null),
                            borderColor: RISK_COLOR,
                            backgroundColor: 'transparent', 
                            yAxisID: 'y-risk',
                            showLine: true, // Connect the risk points now
                            pointStyle: dates.map(date => riskMap.get(date) === 3 ? 'triangle' : riskMap.get(date) === 2 ? 'rect' : 'circle'),
                            pointRadius: 6,
                            tension: 0.4
                        }
                    ],
                });

                setLoading(false);

            } catch (err) {
                console.error("Analytics fetch failed:", err);
                setError("Failed to load historical data. Check backend logs.");
                setLoading(false);
            }
        };

        fetchData();
    }, [dailyCalorieTarget]);

    // ------------------------------------------------------------------
    // Chart 1: PROGRESS TRACKER OPTIONS (Weight, Calorie Intake, Target)
    // ------------------------------------------------------------------
    const progressOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { labels: { color: PRIMARY_TEXT } },
            title: { display: true, text: 'Progress Tracker: Weight & Calorie Consistency', color: ACCENT_COLOR, font: { size: 18 } },
            tooltip: { backgroundColor: 'rgba(22, 27, 34, 0.85)', titleColor: '#FFFFFF', bodyColor: PRIMARY_TEXT, borderColor: ACCENT_COLOR, borderWidth: 1 }
        },
        scales: {
            x: { ticks: { color: PRIMARY_TEXT }, grid: { color: DARK_GRID } },
            'y-weight': { // Y-axis for Weight
                type: 'linear', display: true, position: 'left',
                // FIX APPLIED HERE: Changed PRIMARY_COLOR to PRIMARY_TEXT
                title: { display: true, text: 'Weight (kg)', color: PRIMARY_TEXT }, 
                ticks: { color: PRIMARY_TEXT },
                grid: { color: DARK_GRID },
            },
            'y-calorie': { // Y1-axis for Calorie Intake/Target
                type: 'linear', display: true, position: 'right',
                title: { display: true, text: 'Calorie Intake (kcal)', color: PRIMARY_TEXT },
                ticks: { color: PRIMARY_TEXT },
                grid: { drawOnChartArea: false },
            },
        }
    };
    
    // ------------------------------------------------------------------
    // Chart 2: RISK CORRELATION OPTIONS (Risk Score)
    // ------------------------------------------------------------------
    const riskOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { labels: { color: PRIMARY_TEXT } },
            title: { display: true, text: 'Health Risk Trend Over Time', color: RISK_COLOR, font: { size: 18 } },
            tooltip: { backgroundColor: 'rgba(22, 27, 34, 0.85)', titleColor: '#FFFFFF', bodyColor: PRIMARY_TEXT, borderColor: RISK_COLOR, borderWidth: 1 }
        },
        scales: {
            x: { ticks: { color: PRIMARY_TEXT }, grid: { color: DARK_GRID } },
            'y-risk': { // Y-axis for Risk Score
                type: 'linear', display: true, position: 'left',
                title: { display: true, text: 'Risk Score', color: PRIMARY_TEXT },
                ticks: {
                    color: PRIMARY_TEXT,
                    stepSize: 1,
                    callback: function(value) {
                        return riskTextMap[value] || ''; 
                    }
                },
                grid: { color: DARK_GRID },
                min: 0.5, max: 3.5, // Fixed scale for discrete categories (1, 2, 3)
            },
        }
    };


    if (loading) return <div className="text-center py-10 text-gray-500">Loading historical data...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    const hasData = progressData && progressData.labels.length > 0;
    const hasRiskData = riskData && riskData.datasets[0].data.some(d => d !== null);

    if (!hasData) {
        return (
            <div className="text-center py-10 text-gray-500 border border-dashed border-gray-700 p-8 mt-10 rounded-lg">
                No Historical Data. Log a meal or complete a risk check to start tracking progress!
            </div>
        );
    }
    
    return (
        <div className="space-y-12">
            
            {/* --- CHART 1: PROGRESS TRACKER (Weight & Calories) --- */}
            <div style={{ height: '500px' }} className="bg-[#161B22] p-4 rounded-xl shadow-lg border border-[#2D333B]"> 
                <Line options={progressOptions} data={progressData} />
            </div>

            {/* --- CHART 2: HEALTH RISK TREND --- */}
            {hasRiskData ? (
                <div style={{ height: '350px' }} className="bg-[#161B22] p-4 rounded-xl shadow-lg border border-[#2D333B]">
                    <Line options={riskOptions} data={riskData} />
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500 border border-dashed border-gray-700 p-8 rounded-lg bg-[#161B22]">
                    No historical risk assessment data to display. Complete a Health Risk Check to begin tracking this trend.
                </div>
            )}
        </div>
    );
};

export default ProgressChart;