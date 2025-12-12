import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../api/api';

// Register Chart.js components including BarElement for the new chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// --- Define Chart Colors ---
const ACCENT_COLOR = '#00AEEF'; // AI Blue (Weight)
const AI_GREEN = '#00FFC0';    // Target Line
const RISK_COLOR = '#FFB400';  // Orange/Gold (Risk)
const CALORIE_INTAKE_COLOR = '#FF4C4C'; // Red (Calorie Intake)
const PRIMARY_TEXT = '#C9D1D1';
const DARK_GRID = 'rgba(45, 51, 59, 0.5)';
// ---

const ProgressChart = ({ dailyCalorieTarget }) => {
    const [progressData, setProgressData] = useState(null);
    const [riskData, setRiskData] = useState(null);
    const [calorieData, setCalorieData] = useState(null); // New state for Bar Chart
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                
                // Prepare data arrays
                const calorieIntake = dates.map(date => calorieMap.get(date) || null);
                const calorieTarget = dates.map(() => dailyCalorieTarget);
                const weightHistory = dates.map(date => weightMap.get(date) || null);
                const riskHistory = dates.map(date => riskMap.get(date) || null);


                // --- FIX 1: PROGRESS TRACKER DATA MUST CONTAIN ALL LINES (Weight, Intake, Target) ---
                setProgressData({
                    labels: dates,
                    datasets: [
                        {
                            label: 'Weight (kg)',
                            data: weightHistory,
                            borderColor: ACCENT_COLOR, 
                            yAxisID: 'y-weight',
                            tension: 0.2,
                            pointBackgroundColor: ACCENT_COLOR,
                            spanGaps: true, 
                            type: 'line', // Ensure weight is drawn as a line
                        },
                        {
                            label: 'Calorie Intake (kcal)',
                            data: calorieIntake,
                            borderColor: CALORIE_INTAKE_COLOR, // Red
                            yAxisID: 'y-calorie',
                            spanGaps: true,
                            tension: 0.2,
                            type: 'line', 
                        },
                        {
                            label: 'Calorie Target',
                            data: calorieTarget,
                            borderColor: AI_GREEN, 
                            borderDash: [8, 8], 
                            pointRadius: 0,
                            yAxisID: 'y-calorie',
                            tension: 0, // Straight line for target
                            type: 'line',
                        },
                    ],
                });

                // --- CHART 2: CALORIE CONSISTENCY (STACKED BAR) DATA ---
                // Note: The structure for the bar chart is different, so it must remain separate.
                setCalorieData({
                    labels: dates,
                    datasets: [
                        {
                            label: 'Target (kcal)',
                            data: calorieTarget,
                            backgroundColor: 'rgba(0, 255, 192, 0.2)', // Light AI Green
                            borderColor: AI_GREEN,
                            borderWidth: 1,
                        },
                        {
                            label: 'Intake (kcal)',
                            data: calorieIntake,
                            backgroundColor: 'rgba(255, 76, 76, 0.7)', // Red
                            borderColor: CALORIE_INTAKE_COLOR,
                            borderWidth: 1,
                        },
                    ],
                });
                
                // --- CHART 3 & 4: RISK CORRELATION DATA ---
                setRiskData({
                    labels: dates,
                    datasets: [
                        {
                            label: 'Health Risk Score (1=Low, 3=High)',
                            data: riskHistory,
                            borderColor: RISK_COLOR,
                            backgroundColor: 'transparent', 
                            yAxisID: 'y-risk',
                            showLine: true,
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

    // --- CHART OPTIONS CONFIGURATION ---

    // 1. Weight Trend Options (Shows only Weight, hence why it uses progressData, which now contains weight)
    const weightOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            title: { display: true, text: 'Weight Trend Over Time', color: ACCENT_COLOR, font: { size: 16 } },
            legend: { labels: { color: PRIMARY_TEXT, filter: (item) => item.text === 'Weight (kg)' } }, // Hide calorie lines
            tooltip: { 
                callbacks: { label: (context) => `${context.parsed.y.toFixed(2)} kg` }
            }
        },
        scales: {
            x: { ticks: { color: PRIMARY_TEXT }, grid: { color: DARK_GRID } },
            'y-weight': { 
                type: 'linear', position: 'left',
                title: { display: true, text: 'Weight (kg)', color: ACCENT_COLOR }, 
                ticks: { color: PRIMARY_TEXT, callback: (value) => `${value} kg` },
                grid: { color: DARK_GRID },
                beginAtZero: false,
            },
            // Hide other Y-axes
            'y-calorie': { display: false },
        }
    };

    // 2. Calorie Consistency (Stacked Bar) Options
    const calorieOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            title: { display: true, text: 'Daily Calorie Consistency (Intake vs Target)', color: CALORIE_INTAKE_COLOR, font: { size: 16 } },
            legend: { labels: { color: PRIMARY_TEXT } },
            tooltip: { 
                callbacks: { label: (context) => `${context.dataset.label}: ${context.parsed.y} kcal` }
            }
        },
        scales: {
            x: { ticks: { color: PRIMARY_TEXT }, stacked: false, grid: { color: DARK_GRID } },
            y: { 
                type: 'linear', position: 'left',
                title: { display: true, text: 'Calories (kcal)', color: PRIMARY_TEXT }, 
                ticks: { color: PRIMARY_TEXT },
                grid: { color: DARK_GRID },
                beginAtZero: true,
            },
        }
    };

    // 3. Health Risk Trend Options (No changes needed)
    const riskOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: PRIMARY_TEXT } },
            title: { display: true, text: 'Health Risk Trend', color: RISK_COLOR, font: { size: 16 } },
        },
        scales: {
            x: { ticks: { color: PRIMARY_TEXT }, grid: { color: DARK_GRID } },
            'y-risk': { 
                type: 'linear', position: 'left',
                title: { display: true, text: 'Risk Score', color: PRIMARY_TEXT },
                ticks: {
                    color: PRIMARY_TEXT,
                    stepSize: 1,
                    callback: (value) => riskTextMap[value] || '',
                },
                grid: { color: DARK_GRID },
                min: 0.5, max: 3.5,
            },
        }
    };
    
    // 4. All-in-One Options (Uses all data points for comparison)
    const combinedOptions = {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { labels: { color: PRIMARY_TEXT } },
            title: { display: true, text: 'All-in-One Progress Summary', color: AI_GREEN, font: { size: 20 } },
            tooltip: { backgroundColor: 'rgba(22, 27, 34, 0.85)', titleColor: '#FFFFFF', bodyColor: PRIMARY_TEXT, borderColor: AI_GREEN, borderWidth: 1 }
        },
        scales: {
            x: { ticks: { color: PRIMARY_TEXT }, grid: { color: DARK_GRID } },
            'y-weight': { // Y-axis for Weight (Left)
                type: 'linear', display: true, position: 'left',
                title: { display: true, text: 'Weight (kg)', color: ACCENT_COLOR }, 
                ticks: { color: PRIMARY_TEXT, callback: (value) => `${value} kg` },
                grid: { color: DARK_GRID },
            },
            'y-calorie': { // Y-axis for Calorie Intake/Target (Right)
                type: 'linear', display: true, position: 'right',
                title: { display: true, text: 'Calorie (kcal)', color: CALORIE_INTAKE_COLOR },
                ticks: { color: PRIMARY_TEXT },
                grid: { drawOnChartArea: false },
            },
             'y-risk': { // Y-axis for Risk (Far Right, hidden grid)
                type: 'linear', display: false, position: 'right',
                min: 0.5, max: 3.5,
            },
        }
    };
    
    // --- FIX 2: COMBINED DATASET (For the All-in-One Chart) ---
    // Combine all 4 lines/points (Weight, Intake, Target, Risk)
    const combinedData = progressData && riskData ? {
        labels: progressData.labels,
        datasets: [
            // Only include Weight, Intake, and Target from progressData
            ...progressData.datasets.filter(ds => ds.label !== 'Risk Score (1=Low, 3=High)'), 
            // Include Risk Score
            {
                ...riskData.datasets[0], 
                yAxisID: 'y-risk', // Ensure risk points use the hidden risk axis
                type: 'line',
                label: 'Health Risk Score',
                borderColor: RISK_COLOR,
                backgroundColor: 'transparent',
            }
        ]
    } : null;


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
            <h2 className="text-2xl font-bold text-ai-green border-b border-gray-700 pb-2">Individualized Analytics</h2>

            {/* --- GRID OF INDIVIDUAL CHARTS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. WEIGHT TREND (Line Chart) */}
                <div style={{ height: '300px' }} className="bg-[#161B22] p-4 rounded-xl shadow-lg border border-accent-blue/50"> 
                    {/* Filter datasets to only show Weight for this specific chart */}
                    <Line 
                        options={weightOptions} 
                        data={{
                            labels: progressData.labels,
                            datasets: progressData.datasets.filter(ds => ds.label === 'Weight (kg)')
                        }}
                    />
                </div>

                {/* 2. CALORIE CONSISTENCY (STACKED BAR MIMIC) */}
                <div style={{ height: '300px' }} className="md:col-span-2 bg-[#161B22] p-4 rounded-xl shadow-lg border border-red-500/50">
                    {calorieData && <Bar options={calorieOptions} data={calorieData} />}
                </div>

                {/* 3. HEALTH RISK TREND (Line Chart) */}
                <div style={{ height: '300px' }} className="bg-[#161B22] p-4 rounded-xl shadow-lg border border-risk-color/50">
                    {hasRiskData ? (
                        <Line options={riskOptions} data={riskData} />
                    ) : (
                        <div className="text-center py-20 text-gray-500">No Risk Trend Data</div>
                    )}
                </div>
            </div>

            <h2 className="text-2xl font-bold text-ai-green border-b border-gray-700 pb-2 pt-6">Comprehensive Summary</h2>
            
            {/* --- ALL-IN-ONE CHART (Combined Line Chart) --- */}
            <div style={{ height: '500px' }} className="bg-[#161B22] p-4 rounded-xl shadow-xl border border-ai-green/50"> 
                {combinedData && <Line options={combinedOptions} data={combinedData} />}
            </div>
        </div>
    );
};

export default ProgressChart;