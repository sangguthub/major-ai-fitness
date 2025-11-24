import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# 1. MOCK DATA GENERATION
np.random.seed(42)
N_SAMPLES = 1000

# Features: Order matters when deploying!
bmi = np.random.uniform(18.0, 45.0, N_SAMPLES)
age = np.random.randint(18, 60, N_SAMPLES)
gender = np.random.randint(0, 2, N_SAMPLES) # 0=Male, 1=Female
family_history = np.random.randint(0, 2, N_SAMPLES) # 0=No, 1=Yes
activity_level = np.random.randint(0, 3, N_SAMPLES) # 0=Sedentary, 1=Active, 2=Very Active
sleep_time = np.random.uniform(4.0, 10.0, N_SAMPLES)
junk_food_freq = np.random.randint(0, 3, N_SAMPLES) # 0=Rarely, 1=Weekly, 2=Daily

# Target Variable (Obesity Risk: 0=Low, 1=Medium, 2=High)
# Simple rule-based risk score for simulation
risk_score = (bmi * 0.15) + (age * 0.05) + (family_history * 5) + (junk_food_freq * 3) - (activity_level * 2)
risk_score = risk_score / np.max(risk_score)

obesity_risk = np.where(risk_score < 0.35, 0,
                        np.where(risk_score < 0.70, 1, 2))

data = pd.DataFrame({
    'bmi': bmi, 'age': age, 'gender': gender, 
    'family_history': family_history, 'activity_level': activity_level, 
    'sleep_time': sleep_time, 'junk_food_freq': junk_food_freq,
    'obesity_risk': obesity_risk
})

X = data.drop('obesity_risk', axis=1)
y = data['obesity_risk']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. TRAIN AND EVALUATE
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f"Random Forest Model Accuracy: {accuracy_score(y_test, y_pred):.4f}")

# 3. SAVE MODEL
MODEL_FILE = 'obesity_risk_model.pkl'
joblib.dump(model, MODEL_FILE)
print(f"Model saved to '{MODEL_FILE}'")