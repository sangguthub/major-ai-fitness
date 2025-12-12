const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const { connectToDb } = require('./config/db'); // Import connectToDb function

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection and Server Start Logic ---
connectToDb((err) => {
    if (!err) {
        // Start server ONLY if DB connection is successful
        const PORT = process.env.PORT || 8081;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        
        // --- Mount Routes ONLY after successful DB connection ---
        
        // Root route
        app.get('/', (req, res) => {
            res.send('AI Fitness API is running...');
        });
        
        // API Routes
        app.use('/api/auth', require('./routes/auth'));
        app.use('/api/profile', require('./routes/profile'));
        app.use('/api/risk', require('./routes/risk'));
        app.use('/api/intake', require('./routes/intake'));
        app.use('/api/analytics', require('./routes/analytics'));
        app.use('/api/nutrients', require('./routes/nutrients'));
        
        // CRITICAL FIX: Ensure consistent plural name is loaded here
        app.use('/api/recommendations', require('./routes/recommendations')); 

    } else {
        console.error("Failed to start server due to database connection error. Check MongoDB connection details in .env file.");
    }
});