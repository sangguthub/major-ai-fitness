const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { loadUsers, saveUsers } = require('../utils/mockDB');

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1000d' });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    // ... (logic from previous response)
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    const users = loadUsers();
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
        id: uuidv4(),
        email,
        name,
        passwordHash,
        profile: { existingConditions: [] },
        createdAt: new Date().toISOString()
    };

    saveUsers([...users, newUser]);

    res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser.id),
    });
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // ... (logic from previous response)
    const users = loadUsers();
    const user = users.find(u => u.email === email);

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            profile: user.profile,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;