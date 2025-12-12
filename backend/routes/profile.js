const express = require('express');
const { protect } = require('../middleware/auth');
const { calculateBMR, calculateBMI, calculateTDEE } = require('../utils/healthCalculations');
// MongoDB Utilities
const { loadLogs, updateUser } = require('../utils/dbUtils'); 

const router = express.Router();

// Helper to check and update the streak based on last_login time
const updateLoginStreak = (profile) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const lastLoginTime = profile.last_login ? new Date(profile.last_login) : null;
    
    // CRITICAL FIX: Declare newStreak before use (Line 15 in old trace)
    let newStreak = profile.login_streak || 0; 
    
    if (lastLoginTime) {
        lastLoginTime.setHours(0, 0, 0, 0); // Start of last login day
        const oneDay = 24 * 60 * 60 * 1000;
        const timeDiff = today.getTime() - lastLoginTime.getTime();
        const dayDiff = Math.round(timeDiff / oneDay);

        if (dayDiff === 1) {
            // Logged in yesterday and today: continue streak
            newStreak += 1;
        } else if (dayDiff > 1) {
            // Missed a day: reset streak
            newStreak = 1; 
        } else if (dayDiff === 0) {
            // Already logged in today: retain current streak
            newStreak = profile.login_streak || 1; 
        }
    } else {
        // First ever login/update
        newStreak = 1;
    }

    profile.login_streak = newStreak;
    profile.last_login = today.toISOString(); 

    return profile;
};


// @route GET /api/profile
// Handles profile fetching, streak update, and risk score aggregation.
router.get('/', protect, async (req, res) => {
    let profile = req.user.profile;
    const userId = req.user.id;
    
    // 1. UPDATE STREAK
    profile = updateLoginStreak(profile);

    // 2. AGGREGATE LATEST RISK SCORE (from MongoDB logs)
    const logs = await loadLogs(userId); 
    const riskLogs = logs.filter(log => log.type === 'risk_assessment');
    
    let latestRisk = 'N/A';
    if (riskLogs.length > 0) {
        // Sort by date/time (most recent is last)
        riskLogs.sort((a, b) => new Date(a.date) - new Date(b.date)); 
        latestRisk = riskLogs[riskLogs.length - 1].risk;
    }

    profile.latestRiskScore = latestRisk;
    
    // 3. Save updated profile (streak/last_login and risk score) to MongoDB
    const updateResult = await updateUser(userId, { profile: profile }); 

    if (updateResult) {
        // Return the full updated user object
        res.json({ ...req.user, profile: profile });
    } else {
        res.status(500).json({ message: "Failed to save profile changes to database." });
    }
});

// @route POST /api/profile
// Handles profile updates and TDEE calculation.
router.post('/', protect, async (req, res) => {
    let profile = req.user.profile;
    const userId = req.user.id;
    const updates = req.body;

    // 1. Apply updates
    Object.assign(profile, updates);

    // 2. Perform Health Calculations
    if (profile.height && profile.weight && profile.age) {
        profile.bmi = calculateBMI(profile.height, profile.weight);
        profile.bmr = calculateBMR(profile.gender, profile.height, profile.weight, profile.age);
        profile.tdee = calculateTDEE(profile.bmr, profile.activityLevel);

        let target = profile.tdee;
        if (profile.goal === 'lose') {
            target -= 500;
        } else if (profile.goal === 'gain') {
            target += 500;
        }
        profile.dailyCalorieTarget = Math.round(target);
        console.log(`DEBUG: Calculated Daily Target: ${profile.dailyCalorieTarget} kcal`);
    }
    
    // 3. Update streak
    profile = updateLoginStreak(profile);

    // 4. Save updated profile to MongoDB
    const updateResult = await updateUser(userId, { profile: profile }); 

    if (updateResult) {
        res.json({ message: "Profile updated successfully, TDEE and streak calculated." });
    } else {
        res.status(500).json({ message: "Failed to save profile changes to database." });
    }
});

module.exports = router;