const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { findUserWithPassword } = require('../utils/dbUtils'); 
const { GoogleGenAI } = require('@google/genai'); // Ensure this is installed

// Initialize the GoogleGenAI client (using the key from .env)
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
const model = "gemini-2.5-flash"; 

// Helper function to format profile data into a readable string
const formatProfileForAI = (profile) => {
    if (!profile) return "No profile data available. Generate a general maintenance plan.";
    
    return `
        User Health Snapshot:
        - Age: ${profile.age || 'N/A'}
        - Height (m): ${profile.height / 100 || 'N/A'}
        - Weight (kg): ${profile.weight || 'N/A'}
        - BMI: ${profile.bmi ? profile.bmi.toFixed(2) : 'N/A'}
        - Fitness Goal: ${profile.goal || 'maintain'}
        - Activity Level: ${profile.activityLevel || 'moderate'}
        - Daily Calorie Target: ${profile.dailyCalorieTarget || 'N/A'} kcal
        - Latest Risk Score (AI): ${profile.latestRiskScore || 'No score yet'}
    `;
};

// @route GET /api/recommendations/plan
// @desc Generates a full, personalized daily plan using Gemini
router.get('/plan', protect, async (req, res) => {
    const userId = req.user.id; 

    try {
        // 1. Fetch complete user profile from MongoDB
        const userWithDetails = await findUserWithPassword(userId);
        if (!userWithDetails || !userWithDetails.profile) {
            return res.status(404).json({ message: "User profile not found. Complete your profile first." });
        }
        
        const userProfile = formatProfileForAI(userWithDetails.profile);

        // 2. Define the clear prompt for the AI
        const prompt = `
            You are a certified Personal Trainer and Nutritionist. Your task is to generate a comprehensive, personalized **Daily Action Plan** based on the user's data.
            
            Current User Data:
            ${userProfile}

            Generate the plan in three structured sections. The response MUST be a single JSON object.

            1. **Workout:** A 30-minute workout routine tailored to their goal and activity level (e.g., '3 sets of 12 reps').
            2. **Meal Plan Focus:** A specific, actionable dietary focus for the day (e.g., 'Increase fiber intake to 30g' or 'Focus on lean protein at every meal').
            3. **Mind/Recovery:** A single, non-exercise related recovery or mental health tip.

            The final output MUST be a JSON object with the keys 'Workout', 'MealPlanFocus', and 'MindRecovery', each containing a string with the detailed advice. Do not include any introductory or explanatory text outside the JSON.
        `;

        // 3. Call the Gemini API
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        Workout: { type: "string", description: "A detailed 30-minute workout routine with sets/reps." },
                        MealPlanFocus: { type: "string", description: "A specific nutrition goal or plan focus for the day." },
                        MindRecovery: { type: "string", description: "A tip for recovery, sleep, or mental health." }
                    },
                    required: ["Workout", "MealPlanFocus", "MindRecovery"]
                }
            }
        });
        
        // 4. Send the structured JSON back to the frontend
        const plan = JSON.parse(response.text);
        res.json(plan);

    } catch (error) {
        console.error('Gemini API Error for Plan:', error.message);
        res.status(500).json({ 
            message: "AI Planning service failed to generate a plan.",
            details: error.message 
        });
    }
});

module.exports = router;