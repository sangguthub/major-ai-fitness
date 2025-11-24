const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');
const { loadLogs, saveLogs } = require('../utils/mockDB');

const router = express.Router();
const RISK_API_URL = `${process.env.RISK_API_URL}/predict-risk`;

// @route POST /api/risk/predict
router.post('/predict', protect, async (req, res) => {
    const userId = req.user.id;
    const inputData = req.body; 

    const requiredFields = ['bmi', 'age', 'gender', 'family_history', 'activity_level', 'sleep_time', 'junk_food_freq'];
    const missingFields = requiredFields.filter(field => inputData[field] === undefined);

    if (missingFields.length > 0) {
        return res.status(400).json({ message: `Missing required fields for prediction: ${missingFields.join(', ')}` });
    }

    try {
        const response = await axios.post(RISK_API_URL, inputData);
        
        const predictionResult = response.data;

        // Log the prediction result
        const logs = loadLogs();
        const newRiskLog = {
            userId,
            type: 'risk_assessment',
            date: new Date().toISOString(),
            risk: predictionResult.obesity_risk,
            probabilities: predictionResult.probabilities,
            inputParams: inputData
        };
        saveLogs([...logs, newRiskLog]);

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