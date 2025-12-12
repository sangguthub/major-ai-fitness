const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');
// FIX: Import the new MongoDB functions
const { addLog } = require('../utils/dbUtils'); 

const router = express.Router();
// Assuming CALORIE_API_URL is defined in .env
const CALORIE_API_URL = `${process.env.CALORIE_API_URL}/predict-calories`;

// @route POST /api/intake/upload-image
router.post('/upload-image', protect, async (req, res) => { // ADD async
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
        const newMealLog = {
            userId,
            type: 'meal_intake',
            mealType,
            foodName: mealPrediction.foodName,
            caloriesEstimated: mealPrediction.caloriesEstimated,
            macroBreakdown: mealPrediction.macroBreakdown,
            imageUrl
        };
        // FIX: Use MongoDB addLog
        await addLog(newMealLog); 

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