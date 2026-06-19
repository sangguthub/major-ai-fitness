const express = require('express');
const router = express.Router();
// 1. Ensure you use the official SDK: npm install @google/generative-ai
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/auth');
const { findUserWithPassword } = require('../utils/dbUtils'); 

// --- API KEY SETUP ---
const API_KEYS = [
    process.env.GEMINI_API_KEY_PRIMARY, 
    process.env.GEMINI_API_KEY_SECONDARY,
].filter(key => key);

const modelName = "gemini-1.5-flash"; // Ensure this model exists

// 2. Corrected Client Creation
const createAIClient = (apiKey) => {
    // Pass the API key string directly to the constructor
    return new GoogleGenerativeAI(apiKey);
};

// 3. Fallback Logic with corrected model usage
const generateContentWithFallback = async (contents, config) => {
    let lastError = null;
    
    for (const apiKey of API_KEYS) {
        if (!apiKey) continue;
        
        try {
            console.log(`Attempting API call...`);
            const genAI = createAIClient(apiKey);
            // Use getGenerativeModel on the genAI instance
            const modelInstance = genAI.getGenerativeModel({ model: modelName });
            
            const response = await modelInstance.generateContent({
                contents: [{ role: "user", parts: [{ text: contents }] }],
                generationConfig: config,
            });
            
            return response.response; // Return the response object
            
        } catch (error) {
            console.warn(`[Key Fallback] API key failed: ${error.message}`);
            lastError = error;
        }
    }
    
    throw lastError || new Error("No valid API keys were found.");
};

// @route POST /api/ai/maintenance-coach
router.post('/maintenance-coach', protect, async (req, res) => {
    if (API_KEYS.length === 0) {
        return res.status(503).json({ message: "AI Coach service unavailable." });
    }

    try {
        const userWithDetails = await findUserWithPassword(req.user.id);
        const userProfile = userWithDetails?.profile ? JSON.stringify(userWithDetails.profile) : "General health.";
        
        const prompt = `Act as an AI Fitness Coach. Analyze this profile: ${userProfile}. Return ONLY JSON.`;

        const response = await generateContentWithFallback(prompt, {
            responseMimeType: "application/json"
        });
        
        res.json(JSON.parse(response.text()));

    } catch (error) {
        console.error('AI Coach Service Error:', error.message);
        res.status(500).json({ message: "AI Coach service failed.", details: error.message });
    }
});

module.exports = router;
