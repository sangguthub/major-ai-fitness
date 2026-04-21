🧠 AI-Powered Personalized Fitness & Diet Recommendation System

An intelligent full-stack web application that provides personalized fitness, diet recommendations, calorie estimation from food images, and health risk prediction using Machine Learning.

🚀 Overview

This system helps users manage their health by combining:

📊 Health data analysis
🤖 Machine learning predictions
🍱 Image-based calorie estimation
🏋️ Personalized diet & workout plans

It follows a microservices architecture with a MERN stack and a Python ML service.

🏗️ Architecture
Frontend (React)
       ↓
Backend API (Node.js + Express)
       ↓
Database (MongoDB)
       ↓
ML Service (Python - FastAPI)
🧰 Tech Stack
🔹 Frontend
React.js
React Router
Tailwind CSS / Material UI
Axios
Chart.js / Recharts
🔹 Backend
Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
bcrypt (password hashing)
Multer (file upload)
🔹 ML Service
Python
FastAPI
scikit-learn
TensorFlow / Keras (optional)
NumPy, Pandas
🔹 Tools
Git & GitHub
VS Code
Postman / Thunder Client
Docker (optional)
✨ Features
🔐 Authentication
User registration & login
JWT-based authentication
Protected routes
🧍 Health Profile
Age, gender, height, weight
BMI calculation
Lifestyle & diet preferences
🍱 Meal Logging
Manual calorie tracking
Food image upload
AI-based calorie estimation
❤️ Health Risk Prediction
Predicts risks like:
Obesity
Diabetes
Uses ML models (Logistic Regression / Random Forest)
🧠 Recommendations
Personalized diet plans
Workout suggestions
Based on:
BMI
Goals
Risk level
📊 Dashboard
Calorie tracking
BMI trends
Risk history visualization
📁 Project Structure
fitness-ai-project/
 ├── frontend/        # React App
 ├── backend/         # Node.js API
 └── ml-service/      # Python ML Service
⚙️ Installation & Setup
1️⃣ Clone Repository
git clone <your-repo-url>
cd fitness-ai-project
2️⃣ Setup Backend
cd backend
npm install
npm run dev

Create .env:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PORT=5000
3️⃣ Setup Frontend
cd frontend
npm install
npm start
4️⃣ Setup ML Service
cd ml-service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install fastapi uvicorn scikit-learn numpy pandas
uvicorn app:app --reload
🔌 API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login
Profile
GET /api/profile
POST /api/profile
Meals
POST /api/meals/upload
GET /api/meals
Risk
POST /api/risk/assess
GET /api/risk/history
ML Service
POST /ml/predict-risk
POST /ml/predict-calories
📈 Development Roadmap
🟩 Level 1 – Core App
Auth system
Profile management
Manual calorie tracking
🟦 Level 2 – ML Integration
Risk prediction API
ML model integration
🟨 Level 3 – Image AI
Food image upload
Calorie estimation
🟥 Level 4 – Production Ready
UI improvements
Deployment
Docker setup
🎯 Future Enhancements
Real-time fitness tracking (wearables)
Advanced deep learning for food recognition
AI chatbot for fitness guidance
Mobile app version
🤝 Contribution

Contributions are welcome!
Fork the repo and submit a pull request.

📜 License

This project is open-source and available under the MIT License.

👨‍💻 Author

Developed by Sangappa Y K
