const express = require('express');
const { protect } = require('../middleware/auth');
const { loadLogs } = require('../utils/mockDB');
const RDI_TARGETS = require('../mock_db/rdi_targets.json'); // Load the RDI data

const router = express.Router();

// Helper to load RDI based on profile
const getRDI = (profile) => {
    const ageGroup = '19-50'; // Simplification
    const activity = profile.activityLevel === 0 ? 'sedentary' : 'active';
    const key = `${profile.gender}_${activity}_${ageGroup}`;
    
    return RDI_TARGETS[key] || RDI_TARGETS['default'];
};

// @route GET /api/nutrients/check
// @desc Analyzes today's nutrient intake against RDI targets
router.get('/check', protect, (req, res) => {
    const { profile, id: userId } = req.user;
    const allLogs = loadLogs().filter(log => log.userId === userId);
    const today = new Date().toISOString().split('T')[0];

    const RDIs = getRDI(profile);
    
    // Aggregate today's intake
    let totalIntake = {
        'Protein (g)': 0,
        'Iron (mg)': 0,
        'Vitamin D (IU)': 0 // Mocked, as current macro breakdown only has C/P/F
    };
    
    allLogs.filter(log => log.type === 'meal_intake' && log.date.startsWith(today))
           .forEach(meal => {
               // Use the macro data already available in log
               totalIntake['Protein (g)'] += meal.macroBreakdown.Protein || 0;
               // Mocking micro-nutrient data based on total protein for demo purposes
               totalIntake['Iron (mg)'] += Math.round(meal.macroBreakdown.Protein * 0.1); 
               totalIntake['Vitamin D (IU)'] += Math.round(meal.macroBreakdown.Protein * 5); 
           });
           
    let warnings = [];
    
    // Compare intake to RDI
    for (const nutrient in RDIs) {
        const target = RDIs[nutrient];
        const intake = totalIntake[nutrient];
        
        if (intake < target * 0.7) { // Warn if intake is less than 70% of RDI
            warnings.push({
                nutrient,
                target: target,
                intake: intake,
                status: 'Low',
                message: `Intake is low (${Math.round((intake / target) * 100)}% of target).`
            });
        }
    }

    res.json({
        rdiTargets: RDIs,
        todayIntake: totalIntake,
        warnings
    });
});

module.exports = router;