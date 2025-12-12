const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findUser, createUser, updateUser, findUserWithPassword } = require('../utils/dbUtils'); 

// --- Helper Functions ---
const generateJWT = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    const existingUser = await findUser(email); 
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
        name,
        email,
        password: hashedPassword,
        profile: {
            height: 0, weight: 0, age: 0, gender: 'male', activityLevel: 'moderate', goal: 'maintain',
            dailyCalorieTarget: 0, latestRiskScore: 'N/A', login_streak: 1, last_login: new Date().toISOString(),
        }
    };

    const result = await createUser(newUser); 

    if (result && result.insertedId) {
        const token = generateJWT(result.insertedId.toString(), email);
        res.status(201).json({ 
            token, 
            id: result.insertedId.toString(),
            name: newUser.name,
        });
    } else {
        res.status(500).json({ message: 'User creation failed.' });
    }
});


// @route POST /api/auth/login  <-- CRITICAL LOGIN ROUTE
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await findUser(email); 
    const userWithPassword = user ? await findUserWithPassword(user._id.toString()) : null;


    if (userWithPassword && (await bcrypt.compare(password, userWithPassword.password))) {
        // Update last_login field in MongoDB
        const today = new Date().toISOString();
        await updateUser(userWithPassword._id.toString(), { 'profile.last_login': today });
        
        const token = generateJWT(userWithPassword._id.toString(), userWithPassword.email);

        res.json({ 
            token, 
            id: userWithPassword._id.toString(),
            name: userWithPassword.name,
            email: userWithPassword.email,
            profile: userWithPassword.profile
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;