const mongoose = require('mongoose');

// Define the nested Profile Schema
const profileSchema = new mongoose.Schema({
    age: { type: Number, default: 0 },
    height: { type: Number, default: 0 }, // in cm
    weight: { type: Number, default: 0 }, // in kg (current weight)
    bmi: { type: Number, default: 0 },
    goal: { type: String, default: 'maintain' }, // e.g., 'loss', 'gain', 'maintain'
    activityLevel: { type: String, default: 'moderate' },
    dailyCalorieTarget: { type: Number, default: 2000 },
    targetWeight: { type: Number },
    latestRiskScore: { type: String, default: 'N/A' }, // e.g., 'Low', 'Medium', 'High'
    login_streak: { type: Number, default: 0 },
}, { _id: false }); // Do not create a separate _id for the embedded profile document

// Define the main User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: profileSchema, // Embed the profile schema
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
module.exports = User;