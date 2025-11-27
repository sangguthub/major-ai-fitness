import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define chart colors for the dark theme (matching index.css)
const ACCENT_COLOR = '#00AEEF'; // AI Blue
const AI_GREEN = '#00FFC0';
const PRIMARY_TEXT = '#C9D1D9';
const DARK_GRID = 'rgba(45, 51, 59, 0.5)';

const ProgressChart = ({ dailyCalorieTarget }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Map risk score value to text for the y2 axis labels
    const riskTextMap = { 1: 'Low', 2: 'Medium', 3: 'High' };

    useEffect(() => {
        const fetchData = async () => {
            // Check if essential target data is available before fetching logs
            if (dailyCalorieTarget) {
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
                    ...data.calorieHistory.map(d => d.date)
                ])].sort();

                // 2. Map data to dates (fill missing dates with null for Chart.js)
                const weightMap = new Map(data.weightHistory.map(item => [item.date, item.weight]));
                const calorieMap = new Map(data.calorieHistory.map(item => [item.date, item.calories]));
                const riskMap = new Map(data.riskHistory.map(item => [item.date, item.score])); 
                
                setChartData({
                    labels: dates,
                    datasets: [
                        // Primary Line: Weight History (Electric Blue)
                        {
                            label: 'Weight (kg)',
                            data: dates.map(date => weightMap.get(date) || null),
                            borderColor: ACCENT_COLOR, 
                            yAxisID: 'y',
                            tension: 0.2,
                            pointBackgroundColor: ACCENT_COLOR,
                            spanGaps: true, 
                        },
                        // Secondary Line: Calorie Intake (High Contrast Red)
                        {
                            label: 'Calorie Intake (kcal)',
                            data: dates.map(date => calorieMap.get(date) || null),
                            borderColor: '#FF4C4C', 
                            backgroundColor: 'rgba(255, 76, 76, 0.2)',
                            yAxisID: 'y1',
                            spanGaps: true,
                        },
                        // Target Line (Horizontal - Neon Green/Cyan)
                        {
                            label: 'Calorie Target',
                            data: dates.map(() => data.target),
                            borderColor: AI_GREEN, 
                            borderDash: [8, 8], 
                            pointRadius: 0,
                            yAxisID: 'y1',
                            tension: 0,
                        },
                        // Overlay Dataset: Health Risk Score (Scatter Plot)
                        {
                            label: 'Risk Score Overlay (1=Low, 3=High)',
                            data: dates.map(date => riskMap.get(date) || null),
                            borderColor: 'transparent',
                            backgroundColor: 'rgba(255, 180, 0, 0.8)', // Orange/Gold
                            yAxisID: 'y2', 
                            showLine: false, // Show only points
                            pointStyle: dates.map(date => riskMap.get(date) === 3 ? 'triangle' : riskMap.get(date) === 2 ? 'rect' : 'circle'),
                            pointRadius: 8
                        }
                    ],
                });
                setLoading(false);

            } catch (err) {
                console.error("Analytics fetch failed:", err);
                if (err.response && err.response.status === 401) {
                    setError("Unauthorized. Please log in again.");
                } else {
                    setError("Failed to load historical data. Check backend logs.");
                }
                setLoading(false);
            }
        };

        fetchData();
    }, [dailyCalorieTarget]); 

    // Chart Options (Configuring multiple Y-axes for Dark Theme)
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        stacked: false,
        plugins: {
            legend: { 
                position: 'top',
                labels: {
                    color: PRIMARY_TEXT, 
                }
            },
            title: { 
                display: true, 
                text: 'Progress Tracker & Risk Correlation',
                color: AI_GREEN, 
                font: { size: 18 }
            },
            tooltip: {
                backgroundColor: 'rgba(22, 27, 34, 0.85)', 
                titleColor: '#FFFFFF',
                bodyColor: PRIMARY_TEXT,
                borderColor: ACCENT_COLOR,
                borderWidth: 1
            }
        },
        scales: {
            x: { // X-axis (Dates)
                ticks: { color: PRIMARY_TEXT },
                grid: { color: DARK_GRID } 
            },
            y: { // Y-axis for Weight (AUTO-SCALING: FIXED)
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Weight (kg)', color: PRIMARY_TEXT },
                ticks: { color: PRIMARY_TEXT },
                grid: { color: DARK_GRID },
                // min/max removed for auto-scaling based on data
            },
            y1: { // Y1-axis for Calorie Intake/Target (AUTO-SCALING: FIXED)
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Calorie Intake (kcal)', color: PRIMARY_TEXT },
                ticks: { color: PRIMARY_TEXT },
                // min/max removed for auto-scaling based on data
                grid: { drawOnChartArea: false },
            },
            y2: { // Y2-axis for Risk Score Overlay (FIXED SCALE)
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Risk Score', color: PRIMARY_TEXT },
                ticks: {
                    color: PRIMARY_TEXT,
                    stepSize: 1,
                    callback: function(value) {
                        return riskTextMap[value] || ''; 
                    }
                },
                grid: { drawOnChartArea: false },
                min: 0.5, max: 3.5, // Fixed scale for discrete categories (1, 2, 3)
            }
        }
    };


    if (loading) return <div className="text-center py-10 text-gray-500">Loading charts...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div style={{ height: '500px' }}> {/* Container for fixed chart height */}
            {chartData && chartData.labels.length > 0 ? (
                <Line options={options} data={chartData} />
            ) : (
                <div className="text-center py-10 text-gray-500 border border-dashed border-gray-700 p-8 mt-10 rounded-lg">
                    No Historical Data. Log a meal or complete a risk check to start tracking progress!
                </div>
            )}
        </div>
    );
};

export default ProgressChart;