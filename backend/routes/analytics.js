const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); 
const { loadLogs } = require('../utils/dbUtils'); // Using MongoDB loadLogs

// Helper to aggregate logs over the last 30 days
const aggregateAnalytics = (logs) => { 
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLogs = logs.filter(log => new Date(log.date) >= thirtyDaysAgo);

    const dailyData = recentLogs.reduce((acc, log) => {
        // Use consistent date format for grouping (MM/DD)
        const dateKey = new Date(log.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });

        if (!acc[dateKey]) {
            // Initialize entry for the day
            acc[dateKey] = { date: dateKey, calories: 0, weight: null, risk: null };
        }
        
        if (log.type === 'meal_intake') {
            // Ensure caloriesEstimated is a number
            acc[dateKey].calories += log.caloriesEstimated || 0;
        } 
        
        // Assuming there is a separate process or log type for explicit weight updates
        // If your profile update POST route saves a log, it might be called 'profile_update'
        if (log.type === 'weight_update' && log.weight !== undefined && log.weight !== null) { 
             acc[dateKey].weight = log.weight;
        } else if (log.type === 'risk_assessment' && log.risk) {
            // Take the risk assessment result (e.g., 'Low', 'Medium')
            acc[dateKey].risk = log.risk;
        }
        return acc;
    }, {});

    const sortedDates = Object.keys(dailyData).sort();

    const analytics = {
        weightHistory: [],
        calorieHistory: [],
        riskHistory: [],
    };
    
    console.log("DEBUG: Daily Aggregated Data (for last 30 days):", dailyData);

    sortedDates.forEach(date => {
        const day = dailyData[date];

        // Only push if data is meaningful (not null or 0)
        if (day.weight !== null && day.weight > 0) {
            analytics.weightHistory.push({ date: day.date, weight: day.weight });
        }
        if (day.calories > 0) {
            analytics.calorieHistory.push({ date: day.date, calories: day.calories });
        }
        if (day.risk !== null) {
            analytics.riskHistory.push({ date: day.date, risk: day.risk }); 
        }
    });

    return analytics;
};

// @route GET /api/analytics/progress
router.get('/progress', protect, async (req, res) => { 
    const userId = req.user.id;
    
    try {
        // 1. Load all relevant logs from MongoDB
        const allLogs = await loadLogs(userId); 
        
        // 2. Aggregate and format for charts
        const analyticsData = aggregateAnalytics(allLogs);
        
        console.log(`DEBUG: Analytics loaded. Weight points: ${analyticsData.weightHistory.length}, Calorie points: ${analyticsData.calorieHistory.length}, Risk points: ${analyticsData.riskHistory.length}`);

        return res.json(analyticsData);
    } catch (error) {
        console.error("CRITICAL ERROR: Failed to aggregate analytics data:", error);
        // Return structured empty data on failure to prevent frontend chart crash
        return res.status(500).json({ 
            message: "Failed to load historical analytics data.",
            weightHistory: [],
            calorieHistory: [],
            riskHistory: [],
        });
    }
});

module.exports = router;