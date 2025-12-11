// healthCalculations.js

/**
 * Calculates Body Mass Index (BMI)
 * Formula: weight (kg) / [height (m)]^2
 * @param {number} heightCm - Height in centimeters
 * @param {number} weightKg - Weight in kilograms
 * @returns {number} BMI value
 */
const calculateBMI = (heightCm, weightKg) => {
    if (!heightCm || !weightKg) return 0;
    const heightM = heightCm / 100; // Convert cm to meters
    return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
};

/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.
 * @param {string} gender - 'male' or 'female'
 * @param {number} heightCm - Height in centimeters
 * @param {number} weightKg - Weight in kilograms
 * @param {number} age - Age in years
 * @returns {number} BMR in calories/day
 */
const calculateBMR = (gender, heightCm, weightKg, age) => {
    if (!gender || !heightCm || !weightKg || !age) return 0;

    let bmr;
    if (gender.toLowerCase() === 'male') {
        // Male: (10 * weight in kg) + (6.25 * height in cm) - (5 * age in years) + 5
        bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
        // Female: (10 * weight in kg) + (6.25 * height in cm) - (5 * age in years) - 161
        bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }

    return Math.round(bmr);
};

/**
 * Calculates Total Daily Energy Expenditure (TDEE)
 * @param {number} bmr - Basal Metabolic Rate
 * @param {number} activityLevel - 0=Sedentary, 1=Active, 2=Very Active
 * @returns {number} TDEE in calories/day
 */
const calculateTDEE = (bmr, activityLevel) => {
    if (!bmr) return 0;

    let activityFactor;
    switch (activityLevel) {
        case 0: // Sedentary (Little to no exercise)
            activityFactor = 1.2;
            break;
        case 1: // Active (Moderate exercise 3-5 times/week)
            activityFactor = 1.55;
            break;
        case 2: // Very Active (Intense exercise 6-7 times/week)
            activityFactor = 1.9;
            break;
        default:
            activityFactor = 1.2;
    }

    return Math.round(bmr * activityFactor);
};

module.exports = {
    calculateBMI,
    calculateBMR,
    calculateTDEE,
};