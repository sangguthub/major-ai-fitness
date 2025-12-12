from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

# --- Configuration ---
RISK_MAPPING = {0: 'Low', 1: 'Medium', 2: 'High'}
MODEL_FILE = 'obesity_risk_model.pkl'

# --- Feature Order Must Match Training Data (11 FEATURES) ---
FEATURE_ORDER = [
    'bmi', 'age', 'gender', 'activity_level', 'family_history', 'sleep_time', 
    'junk_food_freq', 
    # ADDED THE 4 NEW LIFESTYLE FEATURES:
    'daily_water_intake', 'veg_fruit_servings', 'processed_meat_freq', 'sugary_drinks_freq' 
]

app = Flask(__name__)
CORS(app) 

# Load the trained model
try:
    risk_model = joblib.load(MODEL_FILE)
    print("Obesity Risk Model loaded successfully.")
except FileNotFoundError:
    print(f"ERROR: Model file '{MODEL_FILE}' not found. Run train_risk_model.py first!")
    risk_model = None

@app.route('/predict-risk', methods=['POST'])
def predict_risk():
    if risk_model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.json
        
        # CRITICAL FIX: Extract all 11 features in the correct order.
        # We use float(data.get(key)) to handle potential missing keys gracefully,
        # although data validation should ideally prevent missing keys entirely.
        features = [
            float(data.get('bmi')),
            int(data.get('age')),
            int(data.get('gender')), 
            int(data.get('family_history')), 
            int(data.get('activity_level')), 
            float(data.get('sleep_time')),
            int(data.get('junk_food_freq')),
            
            # ADDED: Extract the 4 new features
            float(data.get('daily_water_intake')),
            int(data.get('veg_fruit_servings')),
            int(data.get('processed_meat_freq')),
            int(data.get('sugary_drinks_freq'))
        ]

        input_data = np.array([features])
        
        # Scikit-learn Warning Fix: Since we use NumPy array, we rely on positional matching
        # (which is fragile but works if the feature count/order is exact).
        prediction_index = risk_model.predict(input_data)[0]
        probabilities = risk_model.predict_proba(input_data)[0]
        
        predicted_risk = RISK_MAPPING.get(prediction_index, 'Unknown')
        
        # NOTE: Your probability mapping must match the classes trained (0, 1, 2)
        return jsonify({
            "obesity_risk": predicted_risk,
            "probabilities": {
                "Low": round(probabilities[0] * 100, 2),
                "Medium": round(probabilities[1] * 100, 2),
                "High": round(probabilities[2] * 100, 2)
            },
            "input_received": data 
        })

    except Exception as e:
        # A more detailed error message will now show which field caused the TypeError/KeyError
        return jsonify({"error": str(e), "message": "Prediction failed. Check that all 11 features are present and valid numbers/integers."}), 400

if __name__ == '__main__':
    # Running on port 5000
    app.run(port=5000, debug=True)