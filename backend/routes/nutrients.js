const express = require('express');
const { protect } = require('../middleware/auth');
const { loadLogs } = require('../utils/dbUtils'); // FIX: Import from dbUtils
const RDI_TARGETS = require('../mock_db/rdi_targets.json'); // Remains unchanged

const router = express.Router();

// Helper to load RDI based on profile
const getRDI = (profile) => {
    // ... (logic remains unchanged)
    const ageGroup = '19-50'; // Simplification
    const activity = profile.activityLevel === 0 ? 'sedentary' : 'active';
    const key = `${profile.gender}_${activity}_${ageGroup}`;
    
    return RDI_TARGETS[key] || RDI_TARGETS['default'];
};

// @route GET /api/nutrients/check
router.get('/check', protect, async (req, res) => { // ADD async
    const { profile, id: userId } = req.user;
    
    // FIX: Await MongoDB loadLogs()
    const allLogs = await loadLogs(userId);
    
    // Filter to only include the user's logs
    // NOTE: loadLogs already filters by userId, so this filter is redundant but harmless.
    // const allLogs = fullLogs.filter(log => log.userId === userId); 
    
    const today = new Date().toISOString().split('T')[0];

    const RDIs = getRDI(profile);
    
    // Aggregate today's intake
    let totalIntake = {
        'Protein (g)': 0,
        'Iron (mg)': 0,
        'Vitamin D (IU)': 0 
    };
    
    // FIX: Use async function's result (allLogs)
    allLogs.filter(log => log.type === 'meal_intake' && log.date.startsWith(today))
           .forEach(meal => {
               totalIntake['Protein (g)'] += meal.macroBreakdown.protein || 0; // Fix: use lowercase property name from dbUtils
               // Mocking micro-nutrient data based on total protein for demo purposes
               totalIntake['Iron (mg)'] += Math.round((meal.macroBreakdown.protein || 0) * 0.1); 
               totalIntake['Vitamin D (IU)'] += Math.round((meal.macroBreakdown.protein || 0) * 5); 
           });
           
    let warnings = [];
    
    // Compare intake to RDI
    for (const nutrient in RDIs) {
        const target = RDIs[nutrient];
        const intake = totalIntake[nutrient];
        
        if (intake < target * 0.7) { 
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