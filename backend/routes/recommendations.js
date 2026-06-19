const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { findUserWithPassword } = require('../utils/dbUtils'); 
// Use the official SDK
const { GoogleGenerativeAI } = require('@google/generative-ai'); 

// Initialize client explicitly
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.get('/plan', protect, async (req, res) => {
    const userId = req.user.id; 

    try {
        const userWithDetails = await findUserWithPassword(userId);
        if (!userWithDetails?.profile) {
            return res.status(404).json({ message: "User profile not found." });
        }
        
        const userProfile = JSON.stringify(userWithDetails.profile);
        const prompt = `Act as a trainer. Profile: ${userProfile}. Return JSON with 'Workout', 'MealPlanFocus', 'MindRecovery'.`;

        // Use the official SDK's method
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });
        
        const responseText = result.response.text();
        res.json(JSON.parse(responseText));

    } catch (error) {
        console.error('Gemini API Error:', error.message);
        res.status(500).json({ 
            message: "AI Planning service failed.", 
            details: error.message 
        });
    }
});

module.exports = router;
