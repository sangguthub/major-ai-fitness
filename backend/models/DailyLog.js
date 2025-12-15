const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // The type of log event
    type: { 
        type: String, 
        enum: ['calorie_intake', 'risk_assessment', 'weight_update'], 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },

    // --- Calorie/Macro Fields (Used when type is 'calorie_intake') ---
    calories: { type: Number },
    protein: { type: Number }, // in grams
    carbs: { type: Number },  // in grams
    fats: { type: Number },    // in grams

    // --- Risk Assessment Fields (Used when type is 'risk_assessment') ---
    risk: { type: String }, // e.g., 'Low', 'Medium', 'High'
    probabilities: { type: Object },
    inputParams: { type: Object }, // The data used to run the ML model

    // --- Weight Field (Used when type is 'weight_update') ---
    weight: { type: Number } // in kg
});

// Create a compound index for efficient querying by user and date
dailyLogSchema.index({ userId: 1, date: 1 });

const DailyLog = mongoose.model('DailyLog', dailyLogSchema);
module.exports = DailyLog;