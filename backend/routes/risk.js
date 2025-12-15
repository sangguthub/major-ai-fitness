const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');
// Import both addLog and updateUser from dbUtils
const { addLog, updateUser } = require('../utils/dbUtils'); 

// Assuming RISK_API_URL is defined in .env
// e.g., RISK_API_URL=http://localhost:5000
const RISK_API_URL = `${process.env.RISK_API_URL}/predict-risk`;

// @route POST /api/risk/predict
router.post('/predict', protect, async (req, res) => { 
    const userId = req.user.id;
    const inputData = req.body; 

    const requiredFields = ['bmi', 'age', 'gender', 'family_history', 'activity_level', 'sleep_time', 'junk_food_freq'];
    
    // Include additional optional but good-to-have profile fields for better prediction and logging
    const optionalProfileFields = ['daily_water_intake', 'veg_fruit_servings', 'processed_meat_freq', 'sugary_drinks_freq'];
    
    const allFields = [...requiredFields, ...optionalProfileFields];
    const missingFields = requiredFields.filter(field => inputData[field] === undefined);

    if (missingFields.length > 0) {
        // Frontend should prevent this, but we validate strictly
        return res.status(400).json({ message: `Missing required fields for prediction: ${missingFields.join(', ')}` });
    }

    try {
        // 1. Call Python ML service
        const response = await axios.post(RISK_API_URL, inputData);
        const predictionResult = response.data; // e.g., { obesity_risk: 'Medium', probabilities: {...} }

        // 2. Log the prediction result to MongoDB (Risk History)
        const newRiskLog = {
            userId,
            type: 'risk_assessment',
            risk: predictionResult.obesity_risk, 
            score: predictionResult.risk_score_numeric, // Assuming Python returns a simple 1/2/3 score
            probabilities: predictionResult.probabilities,
            inputParams: inputData,
            date: new Date().toISOString().split('T')[0] // Log date for charts
        };
        await addLog(newRiskLog); 

        // 3. CRITICAL FIX: Update the user's main profile with the latest score
        // This ensures the Dashboard header metrics are up-to-date.
        await updateUser(userId, { 
            'profile.latestRiskScore': predictionResult.obesity_risk,
            'profile.latestRiskDate': new Date().toISOString()
        });
        
        // 4. Send success response
        res.json({ 
            message: "Risk prediction successful and logged.", 
            result: predictionResult 
        });

    } catch (error) {
        // Log error details for debugging the external service
        console.error('Error calling Python Risk API:', error.message);
        console.error('API Response Status:', error.response?.status);
        
        // 5. Send service unavailable status (503)
        res.status(503).json({ 
            message: 'Failed to connect to the Health Risk Prediction service. Ensure Python API is running.',
            details: error.response?.data || error.message
        });
    }
});

module.exports = router;