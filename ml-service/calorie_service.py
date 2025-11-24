from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import random

# --- Configuration ---
app = Flask(__name__)
CORS(app) 

# MOCK DATA: Simulates the output of a trained CNN model
MOCK_FOOD_DB = {
    "dosa": {"calories": 120, "carb": 20, "protein": 4, "fat": 3},
    "chapati": {"calories": 80, "carb": 15, "protein": 3, "fat": 1},
    "rice_plate": {"calories": 300, "carb": 60, "protein": 6, "fat": 2},
    "chicken_curry": {"calories": 250, "carb": 5, "protein": 35, "fat": 10},
    "salad": {"calories": 100, "carb": 10, "protein": 5, "fat": 5},
}

# Helper function to mock the CNN classification (based on filename)
def mock_cnn_classify(filename):
    """Simulates image classification by checking keywords in the filename."""
    name = filename.lower()
    for dish, data in MOCK_FOOD_DB.items():
        if dish in name:
            return dish
    # Default if classification fails
    return random.choice(list(MOCK_FOOD_DB.keys()))

@app.route('/predict-calories', methods=['POST'])
def predict_calories():
    # File check is mocked using a dummy filename if no file is uploaded for local testing
    if 'file' not in request.files or not request.files['file'].filename:
        # Fallback for API testing (e.g., in Postman without file upload)
        filename = request.form.get('filename', 'default_rice_plate.jpg') 
        # return jsonify({"error": "No image file provided."}), 400 # Uncomment this for strict implementation
    else:
        file = request.files['file']
        filename = file.filename
        # In a real system, you'd save the file and pass the path to the TensorFlow/Keras model here.
        # file.save(f"uploads/{filename}")

    try:
        # 1. MOCK CLASSIFICATION
        food_name_key = mock_cnn_classify(filename)
        base_data = MOCK_FOOD_DB[food_name_key]
        
        # 2. MOCK PORTION ESTIMATION (e.g., multiplying by a random portion factor)
        # Real portion estimation requires complex CNN/segmentation
        portion_factor = random.uniform(0.8, 1.2) 

        estimated_calories = round(base_data['calories'] * portion_factor)
        estimated_carb = round(base_data['carb'] * portion_factor)
        estimated_protein = round(base_data['protein'] * portion_factor)
        estimated_fat = round(base_data['fat'] * portion_factor)

        # 3. Return Results
        return jsonify({
            "foodName": food_name_key.replace('_', ' ').title(),
            "caloriesEstimated": estimated_calories,
            "macroBreakdown": {
                "Carbohydrates": estimated_carb,
                "Protein": estimated_protein,
                "Fat": estimated_fat
            },
            "source": f"Mock CNN based on filename: {filename}"
        })

    except Exception as e:
        return jsonify({"error": str(e), "message": "Error processing image or model lookup."}), 500

if __name__ == '__main__':
    # Running on port 5001 (to avoid conflict with risk_service on 5000)
    app.run(port=5001, debug=False)