require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const riskRoutes = require('./routes/risk');
const intakeRoutes = require('./routes/intake');
const recommendationRoutes = require('./routes/recommendation'); // New Route
const nutrientsRoutes = require('./routes/nutrients');
const analyticsRoutes = require('./routes/analytics');
const app = express();

const PORT = process.env.PORT || 8080;


// Middleware
app.use(cors());
app.use(express.json());


// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/intake', intakeRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/nutrients', nutrientsRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
    res.send('AI Fitness Backend API is running!');
});

// Error Handling (Basic)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the backend at http://localhost:${PORT}`);
});