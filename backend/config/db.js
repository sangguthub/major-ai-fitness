const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI; 

// --- CRITICAL DEBUGGING LINES ---
console.log("DEBUG URI LENGTH:", uri ? uri.length : 'undefined');
// --- END DEBUG ---

// Safety check:
if (!uri || uri.length < 50 || uri.includes('<') || uri.includes('>')) {
    console.error("FATAL ERROR: MONGO_URI is missing, too short, or still contains angle brackets (<>).");
    console.error("Please ensure backend/.env file is present and the connection string is correctly defined.");
    process.exit(1); 
}

// Mongoose Connection Status Object (Optional, but helpful for debugging)
const dbConnection = mongoose.connection;

module.exports = {
  // 1. Establish connection using Mongoose
  connectToDb: async (cb) => {
    try {
      // Use mongoose.connect to establish connection
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 20000, // Extend timeout for robustness
        socketTimeoutMS: 45000,          // Extend socket timeout
        // Removed useNewUrl, useUnifiedTopology, etc. as they are default now
      }); 
      
      console.log("Database connection successful to MongoDB (via Mongoose).");

      // Listen for connection errors after initial success
      dbConnection.on('error', err => {
          console.error('Mongoose runtime connection error:', err);
      });

      return cb(null);
    } catch (err) {
      console.error("Database connection failed during connection attempt:", err.message);
      return cb(err);
    }
  },

  // 2. Function to get the connected database instance (Mongoose handles this internally, 
  // but we keep the function signature for compatibility if needed elsewhere)
  getDb: () => dbConnection,

  // 3. Close connection (for clean shutdown)
  closeDb: () => mongoose.disconnect()
};