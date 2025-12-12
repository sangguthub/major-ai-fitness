from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app) # Enable CORS for cross-origin requests from Node/React

# --- MOCK FOOD DATABASE ---
# Provides realistic calorie and macro data based on the input filename.
FOOD_DATABASE = {
    
  # 1. Healthy / Low Calorie
  "sprouts_salad.jpg": {
    "foodName": "Sprouts & Veggie Salad",
    "caloriesEstimated": 180,
    "macroBreakdown": {"protein": 12, "fat": 3, "carbohydrates": 28}
  },
  "banana.jpg": {
    "foodName": "Banana",
    "caloriesEstimated": 105,
    "macroBreakdown": {"protein": 1, "fat": 0, "carbohydrates": 27}
  },
  "green_smoothie.jpg": {
    "foodName": "Green Detox Smoothie",
    "caloriesEstimated": 160,
    "macroBreakdown": {"protein": 4, "fat": 2, "carbohydrates": 35}
  },
  "boiled_eggs.jpg": {
    "foodName": "Boiled Eggs (2 pcs)",
    "caloriesEstimated": 140,
    "macroBreakdown": {"protein": 12, "fat": 10, "carbohydrates": 1}
  },
  "paneer_tikka.jpg": {
    "foodName": "Paneer Tikka",
    "caloriesEstimated": 300,
    "macroBreakdown": {"protein": 22, "fat": 18, "carbohydrates": 8}
  },
  "veg_upma.jpg": {
    "foodName": "Veg Upma",
    "caloriesEstimated": 230,
    "macroBreakdown": {"protein": 6, "fat": 7, "carbohydrates": 36}
  },

  # 2. Medium / Balanced
  "masala_dosa.jpg": {
    "foodName": "Masala Dosa",
    "caloriesEstimated": 520,
    "macroBreakdown": {"protein": 10, "fat": 22, "carbohydrates": 70}
  },
  "vegetable_pulao.jpg": {
    "foodName": "Vegetable Pulao",
    "caloriesEstimated": 480,
    "macroBreakdown": {"protein": 8, "fat": 12, "carbohydrates": 78}
  },
  "grilled_chicken_plate.jpg": {
    "foodName": "Grilled Chicken with Veggies",
    "caloriesEstimated": 560,
    "macroBreakdown": {"protein": 45, "fat": 20, "carbohydrates": 35}
  },
  "dal_roti.jpg": {
    "foodName": "Dal with 2 Rotis",
    "caloriesEstimated": 450,
    "macroBreakdown": {"protein": 18, "fat": 10, "carbohydrates": 65}
  },
  "noodles.jpg": {
    "foodName": "Veg Hakka Noodles",
    "caloriesEstimated": 500,
    "macroBreakdown": {"protein": 10, "fat": 14, "carbohydrates": 80}
  },
  "poha.jpg": {
    "foodName": "Kanda Poha",
    "caloriesEstimated": 320,
    "macroBreakdown": {"protein": 8, "fat": 10, "carbohydrates": 50}
  },

  # 3. High Calorie / High Fat
  "butter_chicken.jpg": {
    "foodName": "Butter Chicken",
    "caloriesEstimated": 780,
    "macroBreakdown": {"protein": 38, "fat": 48, "carbohydrates": 20}
  },
  "paneer_butter_masala.jpg": {
    "foodName": "Paneer Butter Masala",
    "caloriesEstimated": 720,
    "macroBreakdown": {"protein": 22, "fat": 50, "carbohydrates": 32}
  },
  "samosa.jpg": {
    "foodName": "Samosa (1 pc)",
    "caloriesEstimated": 260,
    "macroBreakdown": {"protein": 4, "fat": 17, "carbohydrates": 24}
  },
  "donut.jpg": {
    "foodName": "Chocolate Donut",
    "caloriesEstimated": 420,
    "macroBreakdown": {"protein": 5, "fat": 22, "carbohydrates": 52}
  },
  "ice_cream.jpg": {
    "foodName": "Vanilla Ice Cream (1 cup)",
    "caloriesEstimated": 380,
    "macroBreakdown": {"protein": 6, "fat": 22, "carbohydrates": 40}
  },
  "pav_bhaji.jpg": {
    "foodName": "Pav Bhaji",
    "caloriesEstimated": 700,
    "macroBreakdown": {"protein": 12, "fat": 30, "carbohydrates": 98}
  }
}


# Add a default entry for unknown images
DEFAULT_FOOD = {
    "foodName": "Unidentified Meal (Default)",
    "caloriesEstimated": 400,
    "macroBreakdown": {"protein": 20, "fat": 15, "carbohydrates": 50},
}


@app.route('/predict-calories', methods=['POST'])
def predict_calories():
    """
    Simulates a Deep Learning CNN prediction based on the provided filename.
    """
    try:
        data = request.json
        filename = data.get('filename')
        
        if not filename:
            # Should be prevented by frontend validation, but included for API safety
            return jsonify({"message": "No filename provided"}), 400

        # --- MOCK PREDICTION LOGIC ---
        # Look up the details based on the filename (case-insensitive lookup).
        # We use .copy() to ensure the random variance only affects the result, not the database template.
        prediction = FOOD_DATABASE.get(filename.lower(), DEFAULT_FOOD).copy()
        
        # Add a small random variance for realism
        variance = random.randint(-20, 20)
        prediction['caloriesEstimated'] = max(50, prediction['caloriesEstimated'] + variance)
        
        # --- MOCK ACCURACY ---
        prediction['confidence'] = 0.95

        return jsonify(prediction), 200

    except Exception as e:
        print(f"Error during calorie prediction mock: {e}")
        return jsonify({"message": "Internal Python service error"}), 500

if __name__ == '__main__':
    # Running on port 5001
    app.run(port=5001, debug=True)