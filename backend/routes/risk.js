const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');
// FIX: Import the new MongoDB function for adding logs
const { addLog } = require('../utils/dbUtils'); 

// Assuming RISK_API_URL is defined in .env
const RISK_API_URL = `${process.env.RISK_API_URL}/predict-risk`;

// @route POST /api/risk/predict
router.post('/predict', protect, async (req, res) => { // ADD async
    const userId = req.user.id;
    const inputData = req.body; 

    const requiredFields = ['bmi', 'age', 'gender', 'family_history', 'activity_level', 'sleep_time', 'junk_food_freq'];
    const missingFields = requiredFields.filter(field => inputData[field] === undefined);

    if (missingFields.length > 0) {
        return res.status(400).json({ message: `Missing required fields for prediction: ${missingFields.join(', ')}` });
    }

    try {
        // 1. Call Python ML service
        const response = await axios.post(RISK_API_URL, inputData);
        const predictionResult = response.data;

        // 2. Log the prediction result to MongoDB
        const newRiskLog = {
            userId,
            type: 'risk_assessment',
            risk: predictionResult.obesity_risk, // e.g., 'Low', 'Medium', 'High'
            probabilities: predictionResult.probabilities,
            inputParams: inputData
        };
        // FIX: Use MongoDB addLog
        await addLog(newRiskLog); 

        res.json({ 
            message: "Risk prediction successful and logged.", 
            result: predictionResult 
        });

    } catch (error) {
        console.error('Error calling Python Risk API:', error.message);
        res.status(503).json({ 
            message: 'Failed to connect to the Health Risk Prediction service.',
            details: error.response ? error.response.data : error.message
        });
    }
});

module.exports = router;