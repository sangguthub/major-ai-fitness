const express = require('express');
const { protect } = require('../middleware/auth');
const { loadUsers, saveUsers, loadLogs } = require('../utils/mockDB');
const { calculateBMR, calculateBMI, calculateTDEE } = require('../utils/healthCalculations');

const router = express.Router();

// Helper to check and update the streak based on last_login time
const updateLoginStreak = (profile) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const lastLoginTime = profile.last_login ? new Date(profile.last_login) : null;
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

    // Update the profile fields
    profile.login_streak = newStreak;
    profile.last_login = today.toISOString(); 

    return profile;
};


// @route GET /api/profile (Handles profile fetching and streak calculation)
router.get('/', protect, (req, res) => {
    const { profile, id } = req.user;
    const users = loadUsers();
    
    // 1. UPDATE STREAK
    updateLoginStreak(profile);

    // 2. Save updated profile (with new streak/last_login) to the mock DB
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        users[userIndex].profile = profile;
        saveUsers(users);
    }

    // 3. Return the updated profile
    res.json(req.user);
});

// @route POST /api/profile (Handles profile updates and TDEE calculation)
router.post('/', protect, (req, res) => {
    const { profile, id } = req.user;
    const updates = req.body;

    // 1. Apply updates to profile
    Object.assign(profile, updates);

    // 2. Perform Health Calculations (Only if basic data is present)
    if (profile.height && profile.weight && profile.age) {
        profile.bmi = calculateBMI(profile.height, profile.weight);
        profile.bmr = calculateBMR(profile.gender, profile.height, profile.weight, profile.age);
        profile.tdee = calculateTDEE(profile.bmr, profile.activityLevel);

        // Calculate Goal-Adjusted Calorie Target (TDEE + goal adjustment)
        let target = profile.tdee;
        if (profile.goal === 'lose') {
            target -= 500;
        } else if (profile.goal === 'gain') {
            target += 500;
        }
        profile.dailyCalorieTarget = Math.round(target);
    }
    
    // 3. Ensure streak is updated on POST request as well
    updateLoginStreak(profile);

    // 4. Save updated profile to the mock DB
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex !== -1) {
        users[userIndex].profile = profile;
        saveUsers(users);
        res.json({ message: "Profile updated successfully, TDEE and streak calculated." });
    } else {
        res.status(404).json({ message: "User not found." });
    }
});

module.exports = router;