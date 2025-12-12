const jwt = require('jsonwebtoken');
// Use findUser to fetch user data via ID (without password)
const { findUser } = require('../utils/dbUtils'); 

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token and get user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id; 

            // Fetch user from DB using the ID
            const user = await findUser(userId); // MongoDB: findUser by ID

            if (!user) {
                return res.status(401).json({ message: 'User not found, token failed' });
            }

            // Attach user object to the request
            req.user = {
                id: user._id.toString(), 
                name: user.name,
                email: user.email,
                profile: user.profile,
            };

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };