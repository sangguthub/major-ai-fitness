const express = require('express');
const { protect } = require('../middleware/auth');
const { loadLogs, loadUsers } = require('../utils/mockDB');

const router = express.Router();

// Rule-Based Recommendation Engine (Simplified)
const generateRecommendation = (userProfile, latestRisk, dailyCalorieTarget) => {
    const { bmi, dietPreference, activityLevel } = userProfile;
    const riskLevel = latestRisk || 'Low'; 
    const isObese = bmi >= 30;

    // --- 1. Set Base Calorie Goal (Placeholder Logic) ---
    // If not calculated from BMR, use a default target
    const targetCalories = dailyCalorieTarget || 2000; 

    // --- 2. Workout Plan Rules ---
    let workoutLevel = 'Beginner';
    if (activityLevel >= 2) workoutLevel = 'Advanced';
    else if (activityLevel === 1) workoutLevel = 'Intermediate';

    let workoutPlan = {
        level: workoutLevel,
        duration: "45 minutes",
        focus: workoutLevel === 'Beginner' ? 'Light cardio and stretching' : 'Strength training and HIIT',
        plan: [
            "Warm-up (5 mins)",
            `Main Workout (${workoutLevel} intensity): ${workoutLevel === 'Beginner' ? 'Walking/Jumping Jacks' : 'Squats, Push-ups, Plank'}`,
            "Cool-down (5 mins)"
        ]
    };

    // --- 3. Diet Plan Rules ---
    let dietNotes = [];
    let requiredProtein = Math.round((targetCalories * 0.25) / 4); // 25% protein
    let requiredFat = Math.round((targetCalories * 0.25) / 9);     // 25% fat
    let requiredCarb = Math.round((targetCalories * 0.50) / 4);    // 50% carb

    if (isObese || riskLevel === 'High') {
        requiredProtein = Math.round((targetCalories * 0.35) / 4); // Higher protein for satiety/muscle
        dietNotes.push("Focus on high-fiber, low-glycemic foods.");
    }
    if (dietPreference === 'veg') {
        dietNotes.push("Ensure protein intake via legumes, dairy, and tofu.");
    }

    const sampleDiet = {
        Breakfast: `${Math.round(targetCalories * 0.2)} calories. E.g., ${dietPreference === 'veg' ? 'Oats or Poha' : 'Eggs and whole-wheat toast'}`,
        Lunch: `${Math.round(targetCalories * 0.35)} calories. E.g., Bowl of salad + ${dietPreference === 'veg' ? 'Dal and Chapati' : 'Grilled Chicken and Rice'}`,
        Snacks: `${Math.round(targetCalories * 0.1)} calories. E.g., Fruits or Handful of nuts`,
        Dinner: `${Math.round(targetCalories * 0.35)} calories. E.g., Light soup and vegetables`,
    };

    return {
        dailyCalorieTarget: targetCalories,
        dietPlan: sampleDiet,
        macroGoal: { protein: requiredProtein, fat: requiredFat, carbohydrate: requiredCarb },
        dietNotes,
        workoutPlan
    };
};


// @route GET /api/recommendation
// @desc Get personalized diet and workout recommendations
router.get('/', protect, (req, res) => {
    const { profile, id: userId } = req.user;
    
    // 1. Get Latest Risk Score (from logs)
    const logs = loadLogs().filter(log => log.userId === userId && log.type === 'risk_assessment');
    const latestRisk = logs.length > 0 ? logs[logs.length - 1].risk : null;

    // 2. Determine Calorie Target (Simplification: using BMR * Activity Factor)
    let activityFactor = 1.2; // Sedentary
    if (profile.activityLevel === 1) activityFactor = 1.55;
    if (profile.activityLevel === 2) activityFactor = 1.9;

    let dailyCalorieTarget = profile.bmr ? Math.round(profile.bmr * activityFactor) : 2000;
    
    // Apply Goal: If goal is set to 'lose weight', subtract 500 kcal
    // Mocking the goal here:
    const GOAL = 'maintain'; 
    if (GOAL === 'lose weight') {
        dailyCalorieTarget = Math.max(1200, dailyCalorieTarget - 500);
    }


    const recommendations = generateRecommendation(profile, latestRisk, dailyCalorieTarget);

    res.json({
        message: "Personalized recommendations generated based on profile and risk.",
        profileSnapshot: { bmi: profile.bmi, risk: latestRisk, target: dailyCalorieTarget },
        recommendations
    });
});

module.exports = router;