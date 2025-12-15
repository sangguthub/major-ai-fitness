const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const { protect } = require('../middleware/auth');
const { findUserWithPassword } = require('../utils/dbUtils'); 

// Initialize the GoogleGenAI client (ensure you have installed @google/genai)
// npm install @google/genai
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
const model = "gemini-2.5-flash"; // Use the efficient model

// Helper function to format profile data into a readable string for the AI
const formatProfileForAI = (profile) => {
    if (!profile) return "No profile data available. Give general health tips.";
    
    return `
        User Profile Summary:
        - Age: ${profile.age || 'N/A'}
        - Gender: ${profile.gender || 'N/A'}
        - Height (m): ${profile.height / 100 || 'N/A'}
        - Weight (kg): ${profile.weight || 'N/A'}
        - BMI: ${profile.bmi ? profile.bmi.toFixed(2) : 'N/A'}
        - Fitness Goal: ${profile.goal || 'N/A'}
        - Activity Level: ${profile.activityLevel || 'N/A'}
        - Latest Risk Score (AI): ${profile.latestRiskScore || 'No score yet'}
    `;
};

// @route POST /api/ai/maintenance-coach
// @desc Gets personalized daily maintenance tips from Gemini
router.post('/maintenance-coach', protect, async (req, res) => {
    const userId = req.user.id; 

    try {
        // 1. Fetch complete user profile from MongoDB
        const userWithDetails = await findUserWithPassword(userId);
        if (!userWithDetails || !userWithDetails.profile) {
            return res.status(404).json({ message: "User profile not found." });
        }
        
        const userProfile = formatProfileForAI(userWithDetails.profile);
        const { currentChallenge, previousAdvice } = req.body; // Allows sending context from frontend

        // 2. Define the clear prompt for the AI
        const prompt = `
            You are the AI Fitness Maintenance Coach. Your role is to provide highly actionable, personalized, and motivating advice.
            The user's goal is to maintain or improve their fitness based on their current status.
            
            Current User Data:
            ${userProfile}

            ${currentChallenge ? `The user is currently struggling with: ${currentChallenge}.` : ''}

            Provide advice in the following three categories, formatted strictly as an array of three JSON objects (1 for each category). The total advice length should be concise and focused:
            
            1. **Daily Maintenance (Quick Check):** 1 very specific, small action for today (e.g., 'Do 10 squats during a TV commercial').
            2. **Dietary Suggestion (Goal-Oriented):** 1 nutrition tip tied to their goal/risk score.
            3. **Long-Term Focus (Improvement Strategy):** 1 strategic tip to address their overall weakness (e.g., risk score or low activity).
            
            The final output MUST be a JSON array. Do not include any introductory or explanatory text outside the JSON.
        `;

        // 3. Call the Gemini API
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            category: { type: "string", description: "The category name (Daily Maintenance, Dietary Suggestion, Long-Term Focus)" },
                            tip: { type: "string", description: "The specific, actionable tip for the user" },
                            icon: { type: "string", description: "A relevant emoji for the tip (e.g., 👟, 🥗, 📈)" }
                        },
                        required: ["category", "tip", "icon"]
                    }
                }
            }
        });
        
        // 4. Send the structured JSON back to the frontend
        const suggestions = JSON.parse(response.text);
        res.json(suggestions);

    } catch (error) {
        console.error('Gemini API Error:', error.message);
        res.status(500).json({ 
            message: "AI Coach service failed to generate advice.",
            details: error.message 
        });
    }
});

module.exports = router;