const express = require('express');
const { protect } = require('../middleware/auth');
const { loadLogs } = require('../utils/dbUtils'); // Use MongoDB loadLogs

const router = express.Router();

// Rule-Based Recommendation Engine (Simplified)
const generateRecommendation = (userProfile, latestRisk, dailyCalorieTarget) => {
    const { bmi, dietPreference, activityLevel } = userProfile;
    const riskLevel = latestRisk || 'Low'; 

    // --- 1. Set Base Calorie Goal ---
    const targetCalories = dailyCalorieTarget || 2000; 

    // --- 2. Workout Plan Rules (Simplified Logic) ---
    let workoutLevel = 'Beginner';
    // Match logic to expected profile values (e.g., 'high', 'moderate', etc.)
    if (activityLevel === 'high') workoutLevel = 'Advanced';
    else if (activityLevel === 'moderate') workoutLevel = 'Intermediate';

    let workoutPlan = [
        "Warm-up (5 mins)",
        `Main Workout (${workoutLevel} intensity): ${workoutLevel === 'Beginner' ? 'Walking/Jumping Jacks (20 mins)' : 'Strength training (30 mins)'}`,
        "Cool-down (5 mins)",
        `Weekly Focus: ${workoutLevel === 'Beginner' ? 'Consistency' : 'Progressive Overload'}`
    ];


    // --- 3. Diet Plan Rules (Simplified Logic) ---
    let dietNotes = [];
    let requiredProtein = Math.round((targetCalories * 0.25) / 4); 

    if (riskLevel === 'High') {
        dietNotes.push("Focus on high-fiber, low-glycemic foods.");
    }
    if (userProfile.goal === 'lose') {
        dietNotes.push(`Maintain caloric deficit by strictly tracking macros.`);
    }

    const dietPlan = [
        `Breakfast: ~${Math.round(targetCalories * 0.2)} kcal. E.g., ${dietPreference === 'veg' ? 'Oats or Poha' : 'Eggs and whole-wheat toast'}`,
        `Lunch: ~${Math.round(targetCalories * 0.35)} kcal. E.g., Salad + ${dietPreference === 'veg' ? 'Dal and Chapati' : 'Grilled Chicken and Rice'}`,
        `Dinner: ~${Math.round(targetCalories * 0.35)} kcal. E.g., Light soup and vegetables`,
        `Daily Protein Goal: ${requiredProtein}g`
    ];

    return {
        dailyCalorieTarget: targetCalories,
        dietPlan: dietPlan,
        exercisePlan: workoutPlan,
    };
};


// @route POST /api/recommendations/generate <-- Frontend POST request lands here
router.post('/generate', protect, async (req, res) => { 
    const { profile, id: userId } = req.user;
    
    // 1. Get Latest Risk Score (from MongoDB logs)
    const logs = await loadLogs(userId); 
    const riskLogs = logs.filter(log => log.type === 'risk_assessment');
    
    let latestRisk = profile.latestRiskScore || 'N/A';
    if (riskLogs.length > 0) {
        riskLogs.sort((a, b) => new Date(a.date) - new Date(b.date)); 
        latestRisk = riskLogs[riskLogs.length - 1].risk; 
    }

    // 2. Generate plan using current profile data
    const recommendations = generateRecommendation(profile, latestRisk, profile.dailyCalorieTarget);

    res.json({
        message: "Personalized recommendations generated based on profile and risk.",
        profileSnapshot: { bmi: profile.bmi, risk: latestRisk, target: profile.dailyCalorieTarget },
        recommendations
    });
});

module.exports = router;