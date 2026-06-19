const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const { connectToDb } = require('./config/db'); // Import connectToDb function

const app = express();

// --- Middleware Configuration ---
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Uses the variable from your Render dashboard
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions)); // Use the specific configuration to resolve CORS
app.use(express.json());

// Load Route Modules
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
        const PORT = process.env.PORT || 8081;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        
        // --- Mount Routes ---
        app.get('/', (req, res) => {
            res.send('AI Fitness API is running...');
        });
        
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
        process.exit(1); 
    }
});
