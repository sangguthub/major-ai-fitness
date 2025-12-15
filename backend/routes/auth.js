const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const {
    findUser,
    createUser,
    updateUser,
    findUserWithPassword
} = require('../utils/dbUtils');

const sendEmail = require('../utils/sendEmail');

/* ============================
   JWT HELPER
============================ */
const generateJWT = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

/* ============================
   PROTECT MIDDLEWARE (FIXED)
============================ */
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Decode token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 🔥 FIX: Use ID, not email
            const user = await findUser(decoded.id);

            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('Auth error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/* ============================
   REGISTER
============================ */
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await findUser(email);
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            name,
            email,
            password: hashedPassword,
            profile: {
                height: 0,
                weight: 0,
                age: 0,
                gender: 'male',
                activityLevel: 'moderate',
                goal: 'maintain',
                dailyCalorieTarget: 0,
                latestRiskScore: 'N/A',
                last_login: new Date().toISOString()
            },
            createdAt: new Date()
        };

        const createdUser = await createUser(newUser);

        const token = generateJWT(
            createdUser.insertedId.toString(),
            email
        );

        res.status(201).json({
            token,
            id: createdUser.insertedId.toString(),
            name,
            email,
            profile: newUser.profile
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

/* ============================
   LOGIN
============================ */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await findUser(email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userWithPassword = await findUserWithPassword(user._id.toString());

    const isMatch = await bcrypt.compare(password, userWithPassword.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    await updateUser(userWithPassword._id.toString(), {
        'profile.last_login': new Date().toISOString()
    });

    const token = generateJWT(
        userWithPassword._id.toString(),
        userWithPassword.email
    );

    res.json({
        token,
        id: userWithPassword._id.toString(),
        name: userWithPassword.name,
        email: userWithPassword.email,
        profile: userWithPassword.profile
    });
});

/* ============================
   CHANGE PASSWORD (FIXED)
============================ */
router.post('/change-password', protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // 🔥 MUST include password hash
        const user = await findUserWithPassword(req.user._id.toString());

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await updateUser(user._id.toString(), { password: hashedPassword });

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Failed to update password' });
    }
});

module.exports = router;
