const express = require('express');
const { protect } = require('../middleware/auth');
const { loadUsers, saveUsers, loadLogs } = require('../utils/mockDB');

const router = express.Router();

// Helper function to calculate BMR (Harris-Benedict Equation - Simplified)
const calculateBMR = ({ weight, height, age, gender }) => {
    if (!weight || !height || !age || !gender) return 0;
    
    // Weight in kg, Height in cm
    if (gender.toLowerCase() === 'male') {
        return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else if (gender.toLowerCase() === 'female') {
        return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    return 0;
};

// @route GET /api/profile
router.get('/', protect, (req, res) => {
    const { profile, name, email } = req.user;
    
    if (profile.height && profile.weight) {
        // BMI = weight (kg) / [height (m)]^2
        const heightM = profile.height / 100;
        profile.bmi = parseFloat((profile.weight / (heightM * heightM)).toFixed(2));
        profile.bmr = parseFloat(calculateBMR(profile).toFixed(0));
    }

    // Include the user's latest risk assessment if available
    const logs = loadLogs().filter(log => log.userId === req.user.id && log.type === 'risk_assessment');
    const latestRisk = logs.length > 0 ? logs[logs.length - 1].risk : null;
    
    res.json({ 
        name, 
        email, 
        profile, 
        latestRisk 
    });
});

// @route POST /api/profile
router.post('/', protect, (req, res) => {
    const newProfileData = req.body;
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex !== -1) {
        users[userIndex].profile = {
            ...users[userIndex].profile,
            ...newProfileData
        };

        // Recalculate BMI/BMR immediately after update
        const updatedProfile = users[userIndex].profile;
        if (updatedProfile.height && updatedProfile.weight) {
            const heightM = updatedProfile.height / 100;
            updatedProfile.bmi = parseFloat((updatedProfile.weight / (heightM * heightM)).toFixed(2));
            updatedProfile.bmr = parseFloat(calculateBMR(updatedProfile).toFixed(0));
        }

        saveUsers(users);
        res.json({ message: 'Profile updated successfully', profile: updatedProfile });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;