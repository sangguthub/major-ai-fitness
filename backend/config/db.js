const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI; 

// --- CRITICAL DEBUGGING LINES ---
// console.log("DEBUG URI READ (with quotes):", `"${uri}"`);
console.log("DEBUG URI LENGTH:", uri ? uri.length : 'undefined');
// --- END DEBUG ---

// Safety check: If the URI is missing or too short (indicating an error in .env loading), 
// log an error and exit the process temporarily.
if (!uri || uri.length < 50 || uri.includes('<') || uri.includes('>')) {
    console.error("FATAL ERROR: MONGO_URI is missing, too short, or still contains angle brackets (<>).");
    console.error("Please ensure backend/.env file is present and the connection string is correctly defined.");
    // This stops the application from crashing on the MongoClient constructor call
    process.exit(1); 
}

const client = new MongoClient(uri);

let dbConnection;

module.exports = {
  // 1. Establish connection to the database
  connectToDb: async (cb) => {
    try {
      await client.connect();
      // Store the connection object for re-use
      dbConnection = client.db(); 
      console.log("Database connection successful to MongoDB.");
      return cb(null);
    } catch (err) {
      console.error("Database connection failed during connection attempt:", err.message);
      return cb(err);
    }
  },

  // 2. Function to get the connected database instance
  getDb: () => dbConnection,

  // 3. Close connection (for clean shutdown)
  closeDb: () => client.close()
};