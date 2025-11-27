const express = require('express');
const { protect } = require('../middleware/auth');
const { loadLogs } = require('../utils/mockDB');

const router = express.Router();

// @route GET /api/analytics/progress
// @desc Get weight, calorie, and risk history for charting
router.get('/progress', protect, (req, res) => {
    const userId = req.user.id;
    const allLogs = loadLogs().filter(log => log.userId === userId);

    const weightHistory = [];
    const calorieHistory = [];
    const riskHistory = [];

    // Filter and structure data for frontend charting
    allLogs.forEach(log => {
        const date = new Date(log.date).toISOString().split('T')[0]; // Use date only

        if (log.type === 'meal_intake') {
            // Aggregate calories per day (simple aggregation)
            let dailyEntry = calorieHistory.find(e => e.date === date);
            if (!dailyEntry) {
                dailyEntry = { date, calories: 0 };
                calorieHistory.push(dailyEntry);
            }
            dailyEntry.calories += log.caloriesEstimated;

        } else if (log.type === 'risk_assessment' && log.inputParams.weight) {
            // Use weight input from risk assessment as a historical weight point
            // This is a mock since we don't have a separate weight log
            if (!weightHistory.some(e => e.date === date)) {
                weightHistory.push({ date, weight: log.inputParams.weight });
            }
            
            // Map risk levels to a numerical score for charting (e.g., Low=1, Medium=2, High=3)
            const riskMap = { 'Low': 1, 'Medium': 2, 'High': 3 };
            riskHistory.push({ 
                date, 
                score: riskMap[log.risk],
                risk: log.risk 
            });
        }
    });

    res.json({
        weightHistory: weightHistory.sort((a, b) => new Date(a.date) - new Date(b.date)),
        calorieHistory: calorieHistory.sort((a, b) => new Date(a.date) - new Date(b.date)),
        riskHistory: riskHistory.sort((a, b) => new Date(a.date) - new Date(b.date)),
        target: req.user.profile.dailyCalorieTarget || 2000 // Send target for the chart
    });
});

module.exports = router;