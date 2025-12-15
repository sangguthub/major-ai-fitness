const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const moment = require('moment'); // Requires: npm install moment

// --- Assumed Model Imports ---
const User = require('../models/User'); 
const DailyLog = require('../models/DailyLog'); 
// -----------------------------

// Helper: Generates a 30-day timeline array (YYYY-MM-DD)
const generateTimeline = (days) => {
    const timeline = [];
    for (let i = days - 1; i >= 0; i--) {
        timeline.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
    }
    return timeline;
};

// Helper: Maps a risk string ('Low', 'Medium', 'High') to a numerical score (0 to 1)
const mapRiskToScore = (riskString) => {
    if (!riskString) return null;
    const lowerRisk = riskString.toLowerCase();
    switch (lowerRisk) {
        case 'low': return 0.2;
        case 'medium': return 0.5;
        case 'high': return 0.8;
        default: return null;
    }
};

// =========================================================================
// @route GET /api/analytics/history
// @desc Fetches aggregated time-series data for all analytics charts
// @access Private
// =========================================================================
router.get('/history', protect, async (req, res) => {
    const userId = req.user.id;
    const userProfile = req.user.profile;
    const days = 30;
    const timeline = generateTimeline(days);

    // Calculate date range for the database query
    const startDate = moment().subtract(days - 1, 'days').startOf('day').toDate();
    const endDate = moment().endOf('day').toDate();

    try {
        // 1. Fetch all relevant logs for the date range
        const logs = await DailyLog.find({
            userId: userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        // --- Data Aggregation and Alignment ---
        
        // DataMap to hold aggregated values per day (YYYY-MM-DD)
        const dataMap = new Map();
        timeline.forEach(date => dataMap.set(date, {
            intake: 0, protein: 0, carbs: 0, fats: 0, 
            weight: null, 
            risk: null
        }));

        // Process logs to aggregate daily totals and track latest values
        logs.forEach(log => {
            const dateKey = moment(log.date).format('YYYY-MM-DD');
            const dataEntry = dataMap.get(dateKey);

            if (!dataEntry) return;

            if (log.type === 'calorie_intake') {
                dataEntry.intake += log.calories || 0;
                dataEntry.protein += log.protein || 0;
                dataEntry.carbs += log.carbs || 0;
                dataEntry.fats += log.fats || 0;
            } else if (log.type === 'risk_assessment') {
                // Use the latest risk assessment for the day
                dataEntry.risk = log.risk;
            } else if (log.type === 'weight_update') {
                // Use the latest weight logged for the day
                dataEntry.weight = log.weight; 
            }
        });

        // 2. Final Time-Series Array Construction (Forward Fill Logic for Weight/Risk)
        let lastWeight = userProfile.weight || 0;
        let lastRiskScore = mapRiskToScore(userProfile.latestRiskScore);
        
        const aggregatedData = {
            intake: [], target: [], protein: [], carbs: [], fats: [],
            weight: [], bmi: [], riskScore: []
        };
        
        // Constants from Profile
        const heightMeters = (userProfile.height || 170) / 100;
        const heightSq = heightMeters * heightMeters;
        const targetCalorie = userProfile.dailyCalorieTarget || 2000;
        const targetWeight = userProfile.targetWeight || null;
        
        timeline.forEach(dateKey => {
            const entry = dataMap.get(dateKey);

            // --- Calorie Data ---
            aggregatedData.intake.push(entry.intake || null); 
            aggregatedData.target.push(targetCalorie); 
            aggregatedData.protein.push(entry.protein || null);
            aggregatedData.carbs.push(entry.carbs || null);
            aggregatedData.fats.push(entry.fats || null);

            // --- Weight Data (Forward Fill) ---
            // If entry.weight is present, use it; otherwise, use the last known weight.
            const currentWeight = entry.weight > 0 ? entry.weight : lastWeight;
            
            // Push weight, but only if height is known (to calculate BMI)
            if (currentWeight > 0) {
                aggregatedData.weight.push(currentWeight);
                // Calculate BMI
                aggregatedData.bmi.push((currentWeight / heightSq).toFixed(2)); 
                lastWeight = currentWeight; // Update last known weight
            } else {
                aggregatedData.weight.push(null);
                aggregatedData.bmi.push(null);
            }

            // --- Risk Data (Forward Fill) ---
            const currentRiskScore = mapRiskToScore(entry.risk) || lastRiskScore;
            aggregatedData.riskScore.push(currentRiskScore);
            lastRiskScore = currentRiskScore;
        });
        
        // 3. Assemble the final structured response
        const responseData = {
            timeline: timeline,
            calorieData: {
                intake: aggregatedData.intake.map(v => v === 0 ? null : v), // Ensure 0s are rendered as gaps
                target: aggregatedData.target,
                protein: aggregatedData.protein,
                carbs: aggregatedData.carbs,
                fats: aggregatedData.fats,
            },
            bodyData: {
                weight: aggregatedData.weight.map(v => v === 0 ? null : v),
                bmi: aggregatedData.bmi.map(v => v === 0 ? null : v),
                goalWeight: targetWeight
            },
            riskData: {
                riskScore: aggregatedData.riskScore,
                // Leaving lifestyleActions as an empty array unless you build a dedicated feature to log these
                lifestyleActions: [] 
            }
        };

        res.json({
            message: "Comprehensive analytics history fetched successfully.",
            data: responseData
        });

    } catch (error) {
        console.error('Error fetching analytics history:', error);
        res.status(500).json({ message: "Failed to load analytics history.", details: error.message });
    }
});

module.exports = router;