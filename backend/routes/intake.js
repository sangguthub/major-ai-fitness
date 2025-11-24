const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');
const { loadLogs, saveLogs } = require('../utils/mockDB');

const router = express.Router();
const CALORIE_API_URL = `${process.env.CALORIE_API_URL}/predict-calories`;

// @route POST /api/intake/upload-image
router.post('/upload-image', protect, async (req, res) => {
    const userId = req.user.id;
    const { mealType, imageUrl, filename } = req.body; 

    if (!imageUrl || !filename || !mealType) {
        return res.status(400).json({ message: 'Missing required fields: imageUrl, filename, and mealType.' });
    }

    try {
        // Send filename to the mock Python API
        const response = await axios.post(CALORIE_API_URL, { filename, imageUrl });
        
        const mealPrediction = response.data;

        // Log the meal result
        const logs = loadLogs();
        const newMealLog = {
            logId: `meal-${Date.now()}`,
            userId,
            type: 'meal_intake',
            date: new Date().toISOString(),
            mealType,
            foodName: mealPrediction.foodName,
            caloriesEstimated: mealPrediction.caloriesEstimated,
            macroBreakdown: mealPrediction.macroBreakdown,
            imageUrl
        };
        saveLogs([...logs, newMealLog]);

        res.json({ 
            message: "Meal estimation successful and logged.", 
            log: newMealLog,
            prediction: mealPrediction
        });

    } catch (error) {
        console.error('Error calling Python Calorie API:', error.message);
        res.status(503).json({ 
            message: 'Failed to connect to the Calorie Estimation service.',
            details: error.response ? error.response.data : error.message
        });
    }
});

module.exports = router;