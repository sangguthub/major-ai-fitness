import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# --- CONFIGURATION FOR REAL DATA ---
HEALTH_DATA_PATH = 'real_health_data.csv'
MODEL_FILE = 'obesity_risk_model.pkl'

def load_and_preprocess_data(file_path):
    """Loads CSV data and prepares features for the ML model."""
    try:
        df = pd.read_csv(file_path)
        print(f"Loaded real data from {file_path}. Shape: {df.shape}")
    except FileNotFoundError:
        print(f"ERROR: Real data file '{file_path}' not found. Using internal mock data generation.")
        # FALLBACK: Mock data generation (updated to include new features)
        N_SAMPLES = 1000
        np.random.seed(42)
        df = pd.DataFrame({
            'bmi': np.random.uniform(18.0, 45.0, N_SAMPLES),
            'age': np.random.randint(18, 60, N_SAMPLES),
            'gender': np.random.randint(0, 2, N_SAMPLES),
            'family_history': np.random.randint(0, 2, N_SAMPLES),
            'activity_level': np.random.randint(0, 3, N_SAMPLES),
            'sleep_time': np.random.uniform(4.0, 10.0, N_SAMPLES),
            'junk_food_freq': np.random.randint(0, 3, N_SAMPLES),
            
            # --- NEW FEATURES ADDED FOR TRAINING ---
            'daily_water_intake': np.random.uniform(0.5, 4.0, N_SAMPLES),
            'veg_fruit_servings': np.random.randint(0, 7, N_SAMPLES),
            'processed_meat_freq': np.random.randint(0, 3, N_SAMPLES),
            'sugary_drinks_freq': np.random.randint(0, 3, N_SAMPLES),
            # ----------------------------------------
            
            'obesity_risk': np.where(np.random.rand(N_SAMPLES) > 0.6, 2, np.random.randint(0, 2, N_SAMPLES))
        })
        
    # --- CRITICAL UPDATE: NEW FEATURE COLUMNS ---
    FEATURE_COLUMNS = [
        'bmi', 'age', 'gender', 'family_history', 'activity_level', 
        'sleep_time', 'junk_food_freq', 
        'daily_water_intake', 'veg_fruit_servings', 'processed_meat_freq', 'sugary_drinks_freq'
    ]
    TARGET_COLUMN = 'obesity_risk' 

    # Note: Ensure your 'real_health_data.csv' has these 4 new columns!

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]
    
    # Simple cleaning: fill missing numerical values with the mean
    X = X.fillna(X.mean())

    return X, y

def train_and_save_model():
    X, y = load_and_preprocess_data(HEALTH_DATA_PATH)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # TRAIN RANDOM FOREST MODEL
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Save model artifact
    joblib.dump(model, MODEL_FILE)
    print(f"Model saved to '{MODEL_FILE}'. Run python risk_service.py to start.")

if __name__ == '__main__':
    train_and_save_model()