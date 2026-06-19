const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const { protect } = require('../middleware/auth');
const { findUserWithPassword } = require('../utils/dbUtils'); 

// --- NEW API KEY SETUP ---
// 1. Define an array of API keys. Load them securely from environment variables.
// The first key in the array is the primary key.
const API_KEYS = [
    process.env.GEMINI_API_KEY_PRIMARY, // Primary Key (e.g., GEMINI_API_KEY_1)
    process.env.GEMINI_API_KEY_SECONDARY, // Secondary Key (e.g., GEMINI_API_KEY_2)
    process.env.GEMINI_API_KEY_TERTIARY,
    process.env.GEMINI_API_KEY_4, // Tertiary Key (optional)
].filter(key => key); // Filter out any undefined/empty keys

// 2. Define the model globally
const model = "gemini-2.5-flash";

// 3. Helper function to create an AI client
const createAIClient = (apiKey) => {
    // If the key exists, pass it explicitly inside the options object
    if (apiKey) {
        return new GoogleGenAI({ apiKey: apiKey });
    }
    // Return a client that will fail gracefully if the key is missing
    return new GoogleGenAI({}); 
};

// 4. Fallback Logic: Try each key in sequence until successful
const generateContentWithFallback = async (contents, config) => {
    let lastError = null;
    
    // Loop through each API key defined in the API_KEYS array
    for (const apiKey of API_KEYS) {
        if (!apiKey) continue; // Skip if key is somehow null/undefined
        
        // Initialize the client with the current key
        const ai = createAIClient(apiKey);
        
        try {
            console.log(`Attempting API call with key ending in: ${apiKey.slice(-4)}`);
            
            const response = await ai.models.generateContent({
                model: model,
                contents: contents,
                config: config,
            });
            
            // If successful, return the response immediately
            return response;
            
        } catch (error) {
            // Log the error and store it, then continue to the next key
            console.warn(`[Key Fallback] API key ending in ${apiKey.slice(-4)} failed: ${error.message.split('\n')[0]}`);
            lastError = error;
        }
    }
    
    // If the loop finishes without a successful return, throw the last encountered error
    if (lastError) {
        throw new Error(`All API keys failed to generate content. Last error: ${lastError.message}`);
    }
    
    // Should not happen if API_KEYS has at least one valid key
    throw new Error("No valid API keys were found or provided.");
};
// --- END NEW API KEY SETUP ---

// Helper function to format profile data into a readable string for the AI
const formatProfileForAI = (profile) => {
    // ... (This function remains unchanged)
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

    // Ensure at least one key is available before proceeding
    if (API_KEYS.length === 0) {
        return res.status(503).json({ message: "AI Coach service unavailable: No API keys configured." });
    }

    try {
        // 1. Fetch complete user profile from MongoDB
        const userWithDetails = await findUserWithPassword(userId);
        if (!userWithDetails || !userWithDetails.profile) {
            return res.status(404).json({ message: "User profile not found." });
        }
        
        const userProfile = formatProfileForAI(userWithDetails.profile);
        const { currentChallenge, previousAdvice } = req.body; 

        // 2. Define the clear prompt for the AI
        const prompt = `
           ### System Persona & Role
You are the **AI Fitness Maintenance Coach**, a data-driven, empathetic, and slightly witty coach. Your mission is to transform raw user metrics into a surgical strike of motivation. You don't give generic advice; you give "right now" solutions.

### Contextual Inputs
- **User Profile:** ${userProfile} 
- **Active Struggle:** ${currentChallenge ? currentChallenge : 'No current struggle reported—keep the momentum!'}

### Task
Analyze the user's data (specifically looking at their BMI, activity levels, and risk scores) to generate exactly three actionable insights. 

### Constraints 
1. **Precision:** If the user has a high "Sedentary" score, the advice must target movement. If the "Risk Score" is high, focus on heart health or inflammation.
2. **Tone:** Professional yet conversational. Think "supportive peer," not "clinical manual."
3. **Format:** Output ONLY a JSON array of three objects. No markdown blocks, no conversational filler, no "Here is your plan."

### JSON Schema Requirement
[
  {
    "category": "Daily Maintenance",
    "action": "One micro-habit (under 5 mins) to do immediately.",
    "reasoning": "The 'Why' based on the user's data."
  },
  {
    "category": "Dietary Suggestion",
    "action": "One specific nutritional pivot (e.g., 'Swap X for Y').",
    "reasoning": "How this lowers their specific risk score or hits their goal."
  },
  {
    "category": "Long-Term Focus",
    "action": "One strategic habit to build over the next 30 days.",
    "reasoning": "How this addresses their primary weakness."
  }
]
        `;

        // 3. Call the Gemini API using the new fallback function
        const response = await generateContentWithFallback(
            prompt, // Contents
            { // Config
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
        );
        
        // 4. Send the structured JSON back to the frontend
        const suggestions = JSON.parse(response.text);
        res.json(suggestions);

    } catch (error) {
        // This catch block will now catch errors from the fallback function
        console.error('AI Coach Service Error:', error.message);
        res.status(500).json({ 
            message: "AI Coach service failed to generate advice.",
            details: error.message 
        });
    }
});

module.exports = router;
