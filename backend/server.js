const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const { connectToDb } = require('./config/db'); // Import connectToDb function

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load Route Modules (Require them synchronously before connecting to DB)
// NOTE: This assumes models used within routes can handle asynchronous DB connection
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const riskRoutes = require('./routes/risk');
const intakeRoutes = require('./routes/intake');
const analyticsRoutes = require('./routes/analytics');
const nutrientsRoutes = require('./routes/nutrients');
const recommendationsRoutes = require('./routes/recommendations');
const aiRoutes = require('./routes/ai'); 


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
        
        // Mount API Routes
        app.use('/api/auth', authRoutes);
        app.use('/api/profile', profileRoutes);
        app.use('/api/risk', riskRoutes);
        app.use('/api/intake', intakeRoutes);
        app.use('/api/analytics', analyticsRoutes);
        app.use('/api/nutrients', nutrientsRoutes);
        app.use('/api/recommendations', recommendationsRoutes);
        app.use('/api/ai', aiRoutes); 

    } else {
        console.error("Failed to connect to MongoDB. Error:", err.message);
        console.error("Failed to start server due to database connection error. Check MongoDB connection details in .env file.");
        // Optional: Exit the process if DB connection fails
        process.exit(1); 
    }
});