from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

# --- Configuration ---
RISK_MAPPING = {0: 'Low', 1: 'Medium', 2: 'High'}
MODEL_FILE = 'obesity_risk_model.pkl'

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
        
        # Ensure feature order matches training:
        # ['bmi', 'age', 'gender', 'family_history', 'activity_level', 'sleep_time', 'junk_food_freq']
        features = [
            float(data.get('bmi')),
            int(data.get('age')),
            int(data.get('gender')), 
            int(data.get('family_history')), 
            int(data.get('activity_level')), 
            float(data.get('sleep_time')),
            int(data.get('junk_food_freq'))
        ]

        input_data = np.array([features])
        prediction_index = risk_model.predict(input_data)[0]
        probabilities = risk_model.predict_proba(input_data)[0]
        
        predicted_risk = RISK_MAPPING.get(prediction_index, 'Unknown')
        
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
        return jsonify({"error": str(e), "message": "Invalid input format or missing fields."}), 400

if __name__ == '__main__':
    # Running on port 5000
    app.run(port=5000, debug=True)