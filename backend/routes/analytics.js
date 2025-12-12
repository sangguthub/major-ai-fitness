const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Assuming protect middleware is needed

// --- MOCK ANALYTICS DATA ---
// This provides the historical arrays needed by ProgressChart.jsx
const MOCK_ANALYTICS_DATA = {
    // Dates must be consistent for weight and calorie tracking
    "weightHistory": [
        { "date": "07-Dec", "weight": 78.5 },
        { "date": "08-Dec", "weight": 78.1 },
        { "date": "09-Dec", "weight": 77.8 },
        { "date": "10-Dec", "weight": 77.5 },
        { "date": "11-Dec", "weight": 77.3 }
    ],
    "calorieHistory": [
        { "date": "07-Dec", "calories": 1950 },
        { "date": "08-Dec", "calories": 2100 },
        { "date": "09-Dec", "calories": 1800 },
        { "date": "10-Dec", "calories": 2200 },
        { "date": "11-Dec", "calories": 1750 }
    ],
    "riskHistory": [
        // Risk scores are discrete (1=Low, 2=Medium, 3=High)
        { "date": "07-Dec", "score": 3 }, // High
        { "date": "09-Dec", "score": 2 }, // Medium
        { "date": "11-Dec", "score": 1 }  // Low
    ]
};

// @route GET /api/analytics/progress
// Provides historical data for weight, calories, and risk score.
router.get('/progress', protect, (req, res) => {
    try {
        console.log("DEBUG: Serving mock analytics progress data.");
        // Returns the necessary data structure directly
        return res.json(MOCK_ANALYTICS_DATA);
    } catch (error) {
        console.error("ERROR: Failed to serve mock analytics data:", error);
        return res.status(500).json({ message: "Failed to load historical analytics data." });
    }
});

module.exports = router;